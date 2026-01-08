import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export interface PageRecord {
    id: number;
    url: string;
    path: string;
    depth: number;
    status_code: number;
    content_type: string;
    title: string | null;
    is_error: boolean;
    crawled_at: string;
}

export interface CheckResultRecord {
    id: number;
    page_id: number;
    check_type: string;
    checked_at: string;
}

export interface CheckIssueRecord {
    id: number;
    result_id: number;
    issue_type: string;
    target: string | null;
    message: string | null;
}

export interface PageMetaRecord {
    id: number;
    page_id: number;
    meta_key: string;
    meta_value: string | null;
}

const SCHEMA = `
-- クロール結果
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  path TEXT NOT NULL,
  depth INTEGER NOT NULL,
  status_code INTEGER,
  content_type TEXT,
  title TEXT,
  is_error BOOLEAN DEFAULT FALSE,
  crawled_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- チェック結果
CREATE TABLE IF NOT EXISTS check_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL,
  check_type TEXT NOT NULL,
  checked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id)
);

-- チェック詳細（問題点）
CREATE TABLE IF NOT EXISTS check_issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  result_id INTEGER NOT NULL,
  issue_type TEXT NOT NULL,
  target TEXT,
  message TEXT,
  FOREIGN KEY (result_id) REFERENCES check_results(id)
);

-- メタ情報
CREATE TABLE IF NOT EXISTS page_meta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL,
  meta_key TEXT NOT NULL,
  meta_value TEXT,
  FOREIGN KEY (page_id) REFERENCES pages(id)
);
`;

export const useDatabase = () => {
    const init = async (): Promise<Database> => {
        if (db) return db;

        db = await Database.load("sqlite::memory:");

        // スキーマ作成
        const statements = SCHEMA.split(";").filter((s) => s.trim());
        for (const statement of statements) {
            if (statement.trim()) {
                await db.execute(statement);
            }
        }

        return db;
    };

    const clearAll = async (): Promise<void> => {
        const database = await init();
        await database.execute("DELETE FROM check_issues");
        await database.execute("DELETE FROM check_results");
        await database.execute("DELETE FROM page_meta");
        await database.execute("DELETE FROM pages");
    };

    // ========== Pages ==========

    const insertPage = async (page: Omit<PageRecord, "id" | "crawled_at">) => {
        const database = await init();
        const result = await database.execute(
            `INSERT OR REPLACE INTO pages (url, path, depth, status_code, content_type, title, is_error)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                page.url,
                page.path,
                page.depth,
                page.status_code,
                page.content_type,
                page.title,
                page.is_error ? 1 : 0,
            ]
        );
        return result.lastInsertId;
    };

    const insertPages = async (
        pages: Omit<PageRecord, "id" | "crawled_at">[]
    ) => {
        for (const page of pages) {
            await insertPage(page);
        }
    };

    const getAllPages = async (): Promise<PageRecord[]> => {
        const database = await init();
        return database.select<PageRecord[]>(
            "SELECT * FROM pages ORDER BY path"
        );
    };

    const getPagesByIds = async (ids: number[]): Promise<PageRecord[]> => {
        if (ids.length === 0) return [];
        const database = await init();
        const placeholders = ids.map(() => "?").join(",");
        return database.select<PageRecord[]>(
            `SELECT * FROM pages WHERE id IN (${placeholders})`,
            ids
        );
    };

    const searchPages = async (query: string): Promise<PageRecord[]> => {
        const database = await init();
        return database.select<PageRecord[]>(
            "SELECT * FROM pages WHERE url LIKE ? OR path LIKE ? ORDER BY path",
            [`%${query}%`, `%${query}%`]
        );
    };

    const getErrorPages = async (): Promise<PageRecord[]> => {
        const database = await init();
        return database.select<PageRecord[]>(
            "SELECT * FROM pages WHERE is_error = 1 ORDER BY path"
        );
    };

    // ========== Check Results ==========

    const insertCheckResult = async (
        pageId: number,
        checkType: string
    ): Promise<number> => {
        const database = await init();
        const result = await database.execute(
            "INSERT INTO check_results (page_id, check_type) VALUES (?, ?)",
            [pageId, checkType]
        );
        return result.lastInsertId ?? 0;
    };

    const insertCheckIssue = async (
        resultId: number,
        issueType: string,
        target: string | null,
        message: string | null
    ): Promise<void> => {
        const database = await init();
        await database.execute(
            "INSERT INTO check_issues (result_id, issue_type, target, message) VALUES (?, ?, ?, ?)",
            [resultId, issueType, target, message]
        );
    };

    const getCheckResults = async (
        pageId: number,
        checkType?: string
    ): Promise<CheckResultRecord[]> => {
        const database = await init();
        if (checkType) {
            return database.select<CheckResultRecord[]>(
                "SELECT * FROM check_results WHERE page_id = ? AND check_type = ?",
                [pageId, checkType]
            );
        }
        return database.select<CheckResultRecord[]>(
            "SELECT * FROM check_results WHERE page_id = ?",
            [pageId]
        );
    };

    const getCheckIssues = async (
        resultId: number
    ): Promise<CheckIssueRecord[]> => {
        const database = await init();
        return database.select<CheckIssueRecord[]>(
            "SELECT * FROM check_issues WHERE result_id = ?",
            [resultId]
        );
    };

    const getCheckResultsWithIssues = async (checkType: string) => {
        const database = await init();
        return database.select<
            {
                page_id: number;
                url: string;
                path: string;
                result_id: number;
                issues: string;
            }[]
        >(
            `SELECT
        p.id as page_id,
        p.url,
        p.path,
        cr.id as result_id,
        GROUP_CONCAT(ci.issue_type || ': ' || COALESCE(ci.message, ''), '\n') as issues
      FROM pages p
      INNER JOIN check_results cr ON p.id = cr.page_id
      LEFT JOIN check_issues ci ON cr.id = ci.result_id
      WHERE cr.check_type = ?
      GROUP BY p.id, cr.id`,
            [checkType]
        );
    };

    // ========== Page Meta ==========

    const insertPageMeta = async (
        pageId: number,
        metaKey: string,
        metaValue: string | null
    ): Promise<void> => {
        const database = await init();
        await database.execute(
            "INSERT INTO page_meta (page_id, meta_key, meta_value) VALUES (?, ?, ?)",
            [pageId, metaKey, metaValue]
        );
    };

    const getPageMeta = async (pageId: number): Promise<PageMetaRecord[]> => {
        const database = await init();
        return database.select<PageMetaRecord[]>(
            "SELECT * FROM page_meta WHERE page_id = ?",
            [pageId]
        );
    };

    // ========== Export ==========

    const exportPagesAsCsv = async (): Promise<string> => {
        const pages = await getAllPages();
        const headers = [
            "URL",
            "Path",
            "Depth",
            "Status",
            "Content-Type",
            "Title",
            "Error",
        ];
        const rows = pages.map((p) =>
            [
                p.url,
                p.path,
                p.depth,
                p.status_code,
                p.content_type,
                p.title || "",
                p.is_error ? "Yes" : "No",
            ]
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(",")
        );
        return [headers.join(","), ...rows].join("\n");
    };

    return {
        init,
        clearAll,
        // Pages
        insertPage,
        insertPages,
        getAllPages,
        getPagesByIds,
        searchPages,
        getErrorPages,
        // Check Results
        insertCheckResult,
        insertCheckIssue,
        getCheckResults,
        getCheckIssues,
        getCheckResultsWithIssues,
        // Page Meta
        insertPageMeta,
        getPageMeta,
        // Export
        exportPagesAsCsv,
    };
};
