import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import { PageHeader } from "../Components";
import {
    Table,
    Button,
    Space,
    Tag,
    Typography,
    Empty,
    Input,
    Dropdown,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    DownloadOutlined,
    CheckOutlined,
    CloseOutlined,
    SearchOutlined,
    FontSizeOutlined,
    FileImageOutlined,
    OrderedListOutlined,
    LinkOutlined,
} from "@ant-design/icons";

// Hooks
import { useDatabase, PageRecord } from "../hooks/useDatabase";

// Atoms
import { useValue as useUserValue } from "../Atoms/User";
import { useValue as usePassValue } from "../Atoms/Pass";

const PageList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [pages, setPages] = useState<PageRecord[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    const userValue = useUserValue();
    const passValue = usePassValue();
    const { getAllPages, exportPagesAsCsv } = useDatabase();

    // ページ一覧を取得
    useEffect(() => {
        const fetchPages = async () => {
            setLoading(true);
            try {
                const data = await getAllPages();
                setPages(data);
                // 全選択
                setSelectedRowKeys(data.map((p) => p.id));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    // 検索フィルタ
    const filteredPages = useMemo(() => {
        if (!searchText) return pages;
        const lower = searchText.toLowerCase();
        return pages.filter(
            (p) =>
                p.url.toLowerCase().includes(lower) ||
                p.path.toLowerCase().includes(lower) ||
                p.title?.toLowerCase().includes(lower)
        );
    }, [pages, searchText]);

    // 全選択/全解除
    const handleSelectAll = () => {
        setSelectedRowKeys(filteredPages.map((p) => p.id));
    };

    const handleDeselectAll = () => {
        setSelectedRowKeys([]);
    };

    // CSVエクスポート
    const handleExport = async () => {
        try {
            const csv = await exportPagesAsCsv();
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `crawl-results-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
        }
    };

    // チェック実行
    const handleRunCheck = (checkType: string) => {
        if (selectedRowKeys.length === 0) return;

        // 選択したページIDをクエリパラメータで渡す
        const params = new URLSearchParams();
        params.set("ids", selectedRowKeys.join(","));
        params.set("user", userValue);
        params.set("pass", passValue);

        navigate(`/${checkType}?${params.toString()}`);
    };

    // テーブルカラム定義
    const columns: ColumnsType<PageRecord> = [
        {
            title: "Path",
            dataIndex: "path",
            key: "path",
            ellipsis: true,
            sorter: (a, b) => a.path.localeCompare(b.path),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            ellipsis: true,
            render: (title: string | null) => title || "-",
        },
        {
            title: "Status",
            dataIndex: "status_code",
            key: "status_code",
            width: 100,
            sorter: (a, b) => a.status_code - b.status_code,
            render: (code: number, record: PageRecord) => {
                if (record.is_error || code >= 400) {
                    return <Tag color="error">{code}</Tag>;
                }
                if (code >= 300) {
                    return <Tag color="warning">{code}</Tag>;
                }
                return <Tag color="success">{code}</Tag>;
            },
        },
        {
            title: "Depth",
            dataIndex: "depth",
            key: "depth",
            width: 80,
            sorter: (a, b) => a.depth - b.depth,
        },
    ];

    // チェックボタンメニュー
    const checkMenuItems = [
        {
            key: "title",
            label: t("title.title"),
            icon: <FontSizeOutlined />,
            onClick: () => handleRunCheck("title"),
        },
        {
            key: "alt",
            label: t("alt.title"),
            icon: <FileImageOutlined />,
            onClick: () => handleRunCheck("alt"),
        },
        {
            key: "headline",
            label: t("headline.title"),
            icon: <OrderedListOutlined />,
            onClick: () => handleRunCheck("headline"),
        },
        {
            key: "link",
            label: t("link.title"),
            icon: <LinkOutlined />,
            onClick: () => handleRunCheck("link"),
        },
    ];

    // ページがない場合
    if (!loading && pages.length === 0) {
        return (
            <PageHeader
                primary={t("pageList.title")}
                secondary={t("pageList.description")}>
                <Empty description={t("pageList.no_pages")}>
                    <Button type="primary" onClick={() => navigate("/")}>
                        {t("crawl.title")}
                    </Button>
                </Empty>
            </PageHeader>
        );
    }

    return (
        <PageHeader
            primary={t("pageList.title")}
            secondary={t("pageList.description")}>
            {/* ツールバー */}
            <Space
                style={{
                    marginBottom: 16,
                    width: "100%",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}>
                <Space wrap>
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Button onClick={handleSelectAll} icon={<CheckOutlined />}>
                        {t("pageList.select_all")}
                    </Button>
                    <Button
                        onClick={handleDeselectAll}
                        icon={<CloseOutlined />}>
                        {t("pageList.deselect_all")}
                    </Button>
                    <Button onClick={handleExport} icon={<DownloadOutlined />}>
                        {t("pageList.export_csv")}
                    </Button>
                </Space>
                <Space>
                    <Typography.Text type="secondary">
                        {t("pageList.selected")}: {selectedRowKeys.length} /{" "}
                        {filteredPages.length}
                    </Typography.Text>
                    <Dropdown
                        menu={{ items: checkMenuItems }}
                        disabled={selectedRowKeys.length === 0}>
                        <Button type="primary">
                            {t("pageList.run_check")}
                        </Button>
                    </Dropdown>
                </Space>
            </Space>

            {/* テーブル */}
            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredPages}
                loading={loading}
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                pagination={{
                    pageSize: 50,
                    showSizeChanger: true,
                    pageSizeOptions: ["20", "50", "100", "200"],
                    showTotal: (total) => `Total ${total} pages`,
                }}
                size="small"
                scroll={{ x: true }}
            />
        </PageHeader>
    );
};

export default PageList;
