use std::collections::HashSet;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

use regex::Regex;
use reqwest::Client;
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};
use tokio::sync::Mutex;
use url::Url;

// グローバルなクロール状態
lazy_static::lazy_static! {
    static ref CRAWL_STATE: Arc<CrawlState> = Arc::new(CrawlState::new());
}

struct CrawlState {
    is_running: AtomicBool,
    should_stop: AtomicBool,
    visited: Mutex<HashSet<String>>,
    results: Mutex<Vec<CrawlResult>>,
    current_url: Mutex<String>,
}

impl CrawlState {
    fn new() -> Self {
        Self {
            is_running: AtomicBool::new(false),
            should_stop: AtomicBool::new(false),
            visited: Mutex::new(HashSet::new()),
            results: Mutex::new(Vec::new()),
            current_url: Mutex::new(String::new()),
        }
    }

    async fn reset(&self) {
        self.is_running.store(false, Ordering::SeqCst);
        self.should_stop.store(false, Ordering::SeqCst);
        self.visited.lock().await.clear();
        self.results.lock().await.clear();
        *self.current_url.lock().await = String::new();
    }
}

fn default_max_depth() -> u32 { 3 }
fn default_max_concurrent() -> u32 { 5 }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrawlConfig {
    pub url: String,
    #[serde(default)]
    pub user: String,
    #[serde(default)]
    pub pass: String,
    #[serde(default = "default_max_depth")]
    pub max_depth: u32,
    #[serde(default = "default_max_concurrent")]
    pub max_concurrent: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrawlResult {
    pub url: String,
    pub path: String,
    pub depth: u32,
    pub status_code: u16,
    pub content_type: String,
    pub title: Option<String>,
    pub is_error: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrawlProgress {
    pub is_running: bool,
    pub current_url: String,
    pub found_count: usize,
    pub error_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrawlResponse {
    pub success: bool,
    pub message: String,
    pub results: Vec<CrawlResult>,
}

/// クロール開始
#[tauri::command]
pub async fn start_crawl(app: AppHandle, config: CrawlConfig) -> Result<CrawlResponse, String> {
    // 既に実行中なら拒否
    if CRAWL_STATE.is_running.load(Ordering::SeqCst) {
        return Err("Crawl is already running".into());
    }

    // 状態リセット
    CRAWL_STATE.reset().await;
    CRAWL_STATE.is_running.store(true, Ordering::SeqCst);

    // ベースURLのパース
    let base_url = Url::parse(&config.url).map_err(|e| format!("Invalid URL: {}", e))?;
    let base_path = base_url.path().to_string();

    // HTTPクライアント作成
    let client = Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| format!("Failed to create client: {}", e))?;

    // クロール実行
    crawl_recursive(
        app.clone(),
        client,
        base_url.clone(),
        base_path,
        config.url.clone(),
        config.user,
        config.pass,
        0,
        config.max_depth,
        config.max_concurrent,
    )
    .await;

    CRAWL_STATE.is_running.store(false, Ordering::SeqCst);

    let results = CRAWL_STATE.results.lock().await.clone();
    let was_stopped = CRAWL_STATE.should_stop.load(Ordering::SeqCst);

    Ok(CrawlResponse {
        success: true,
        message: if was_stopped {
            "Crawl stopped by user".into()
        } else {
            "Crawl completed".into()
        },
        results,
    })
}

/// クロール停止
#[tauri::command]
pub async fn stop_crawl() -> Result<bool, String> {
    if !CRAWL_STATE.is_running.load(Ordering::SeqCst) {
        return Ok(false);
    }
    CRAWL_STATE.should_stop.store(true, Ordering::SeqCst);
    Ok(true)
}

/// クロール状態取得
#[tauri::command]
pub async fn get_crawl_status() -> CrawlProgress {
    let results = CRAWL_STATE.results.lock().await;
    let error_count = results.iter().filter(|r| r.is_error).count();

    CrawlProgress {
        is_running: CRAWL_STATE.is_running.load(Ordering::SeqCst),
        current_url: CRAWL_STATE.current_url.lock().await.clone(),
        found_count: results.len(),
        error_count,
    }
}

/// 再帰的クロール
async fn crawl_recursive(
    app: AppHandle,
    client: Client,
    base_url: Url,
    base_path: String,
    url: String,
    user: String,
    pass: String,
    depth: u32,
    max_depth: u32,
    _max_concurrent: u32,
) {
    // 停止チェック
    if CRAWL_STATE.should_stop.load(Ordering::SeqCst) {
        return;
    }

    // 深度チェック
    if depth > max_depth {
        return;
    }

    // URLを正規化して訪問済みチェック
    let normalized_url = match Url::parse(&url) {
        Ok(u) => normalize_url(&u),
        Err(_) => url.clone(),
    };

    {
        let mut visited = CRAWL_STATE.visited.lock().await;
        if visited.contains(&normalized_url) {
            return;
        }
        visited.insert(normalized_url.clone());
    }

    // 現在のURLを更新
    *CRAWL_STATE.current_url.lock().await = url.clone();

    // 進捗通知
    emit_progress(&app).await;

    // ページ取得
    let result = fetch_page(&client, &url, &user, &pass, &base_path, depth).await;

    // 結果保存
    let links = if let Ok((crawl_result, links)) = result {
        CRAWL_STATE.results.lock().await.push(crawl_result);
        emit_progress(&app).await;
        links
    } else {
        // エラー時も結果に追加
        if let Err(crawl_result) = result {
            CRAWL_STATE.results.lock().await.push(crawl_result);
            emit_progress(&app).await;
        }
        return;
    };

    // 子ページをクロール
    for link in links {
        if CRAWL_STATE.should_stop.load(Ordering::SeqCst) {
            break;
        }

        // 絶対URLに変換
        let absolute_url = match resolve_url(&base_url, &link) {
            Some(u) => u,
            None => continue,
        };

        // 同一オリジン、ベースパス以下かチェック
        if !is_valid_url(&absolute_url, &base_url, &base_path) {
            continue;
        }

        // 再帰
        Box::pin(crawl_recursive(
            app.clone(),
            client.clone(),
            base_url.clone(),
            base_path.clone(),
            absolute_url,
            user.clone(),
            pass.clone(),
            depth + 1,
            max_depth,
            _max_concurrent,
        ))
        .await;
    }
}

/// ページ取得
async fn fetch_page(
    client: &Client,
    url: &str,
    user: &str,
    pass: &str,
    base_path: &str,
    depth: u32,
) -> Result<(CrawlResult, Vec<String>), CrawlResult> {
    let parsed_url = Url::parse(url).map_err(|_| CrawlResult {
        url: url.to_string(),
        path: String::new(),
        depth,
        status_code: 0,
        content_type: String::new(),
        title: None,
        is_error: true,
    })?;

    let path = parsed_url.path().to_string();

    let request = if user.is_empty() {
        client.get(url)
    } else {
        client.get(url).basic_auth(user, Some(pass))
    };

    let response = request.send().await.map_err(|e| CrawlResult {
        url: url.to_string(),
        path: path.clone(),
        depth,
        status_code: e.status().map(|s| s.as_u16()).unwrap_or(0),
        content_type: String::new(),
        title: None,
        is_error: true,
    })?;

    let status_code = response.status().as_u16();
    let is_error = !response.status().is_success();

    let content_type = response
        .headers()
        .get("content-type")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_string();

    // HTMLでなければリンク抽出しない
    if !content_type.contains("text/html") {
        return Ok((
            CrawlResult {
                url: url.to_string(),
                path,
                depth,
                status_code,
                content_type,
                title: None,
                is_error,
            },
            vec![],
        ));
    }

    let body = response.text().await.map_err(|_| CrawlResult {
        url: url.to_string(),
        path: path.clone(),
        depth,
        status_code,
        content_type: content_type.clone(),
        title: None,
        is_error: true,
    })?;

    let document = Html::parse_document(&body);

    // タイトル取得
    let title_selector = Selector::parse("title").unwrap();
    let title = document
        .select(&title_selector)
        .next()
        .map(|e| e.text().collect::<String>());

    // リンク抽出
    let links = extract_links(&document, base_path);

    Ok((
        CrawlResult {
            url: url.to_string(),
            path,
            depth,
            status_code,
            content_type,
            title,
            is_error,
        },
        links,
    ))
}

/// リンク抽出
fn extract_links(document: &Html, base_path: &str) -> Vec<String> {
    let anchor_selector = Selector::parse("a[href]").unwrap();
    let skip_pattern = Regex::new(r"^(mailto:|tel:|javascript:|#)").unwrap();

    document
        .select(&anchor_selector)
        .filter_map(|e| {
            let href = e.value().attr("href")?;

            // スキップパターン
            if skip_pattern.is_match(href) {
                return None;
            }

            Some(href.to_string())
        })
        .collect()
}

/// URLを正規化（末尾スラッシュ、クエリ、フラグメント除去）
fn normalize_url(url: &Url) -> String {
    let mut normalized = url.clone();
    normalized.set_fragment(None);
    normalized.set_query(None);

    let mut result = normalized.to_string();
    // 末尾スラッシュを除去（ルートパスは除く）
    if result.ends_with('/') && normalized.path() != "/" {
        result.pop();
    }
    result
}

/// URLを絶対URLに解決
fn resolve_url(base: &Url, href: &str) -> Option<String> {
    base.join(href).ok().map(|u| normalize_url(&u))
}

/// URLがクロール対象か判定
fn is_valid_url(url_str: &str, base_url: &Url, base_path: &str) -> bool {
    let url = match Url::parse(url_str) {
        Ok(u) => u,
        Err(_) => return false,
    };

    // 同一オリジンチェック
    if url.origin() != base_url.origin() {
        return false;
    }

    // ベースパス以下かチェック（同階層含む）
    let path = url.path();

    // base_pathの親ディレクトリを取得
    let base_dir = if base_path.ends_with('/') {
        base_path.to_string()
    } else {
        match base_path.rfind('/') {
            Some(pos) => base_path[..=pos].to_string(),
            None => "/".to_string(),
        }
    };

    path.starts_with(&base_dir)
}

/// 進捗イベント送信
async fn emit_progress(app: &AppHandle) {
    let results = CRAWL_STATE.results.lock().await;
    let error_count = results.iter().filter(|r| r.is_error).count();

    let progress = CrawlProgress {
        is_running: CRAWL_STATE.is_running.load(Ordering::SeqCst),
        current_url: CRAWL_STATE.current_url.lock().await.clone(),
        found_count: results.len(),
        error_count,
    };

    let _ = app.emit("crawl_progress", progress);
}
