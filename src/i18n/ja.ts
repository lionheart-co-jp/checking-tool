export default {
    translation: {
        // Common
        common: {
            user: "ユーザー名",
            pass: "パスワード",
            basic: "基本情報",
            result: "チェック結果",
            not_found: "見つかりませんでした",
            warning: "注意",
            more: "詳細",
            bulk: "一括指定",
        },

        // Application
        apply: {
            title: "チェックサポートツール",
        },

        // Form
        form: {
            warning:
                "認証が必要なページをチェックする場合は、ユーザー名とパスワードを入力してください。",
            bulk_help: "一行ずつ複数のURLの入力が可能です",
        },

        // Dashboard
        dashboard: {
            title: "ダッシュボード",
        },

        // Title
        title: {
            title: "タイトル/メタ情報チェック",
            description: "title、metaタグの情報を確認します",
            remarks: {
                title: "title、metaタグの情報を設定する際の注意点",
                body1: "タイトルについてはディレクターの指示に沿って設定をしてください。指示がない場合は、「(ページ名) | (サイト名)」と設定してください。",
                body2: "特に指示がない場合、「og:title」にはtitleタグと同じ内容を、「og:description」にはmeta descriptionと同じ内容を入力してください。",
            },
        },

        // Alt
        alt: {
            title: "画像altチェック",
            description: "imgタグのalt属性をチェックします",
            remarks: {
                title: "チェック結果のアイコンについて",
                body1: "alt属性が存在していません。alt属性が空だとしても<strong>必ず追加する必要があります。</strong>",
                body2: "alt属性が空の状態です。画像にテキストが含まれている場合は、alt属性に入力してください。",
                body3: "alt属性に値が設定されています。値が画像内のテキストと合致するか確認してください。",
            },
        },

        // Headline
        headline: {
            title: "見出しチェック",
            description: "見出しの構造をチェックします",
            remarks: {
                title: "見出しを設定する際の注意点",
                body1: "見出しレベルはスキップしないようにしてください（例 : <h1> -> <h3>は良くありません）",
                body2: "<h1>タグはページ内に1つにしてください",
            },
        },

        // Link
        link: {
            title: "リンクチェック",
            description: "リンク先の存在をチェックします",
            warning:
                "この機能はページ内に設定されているリンク全てにアクセスを試みますので、短時間に何度も実行を繰り返さないようにしてください。",
        },

        // Crawl
        crawl: {
            title: "サイトクロール",
            description: "指定したURLからページを再帰的に検出します",
            url: "開始URL",
            url_placeholder: "https://example.com/",
            max_depth: "最大深度",
            max_concurrent: "同時リクエスト数",
            start: "クロール開始",
            stop: "クロール停止",
            progress: {
                title: "クロール進捗",
                current: "チェック中",
                found: "検出ページ数",
                errors: "エラー",
            },
        },

        // Page List
        pageList: {
            title: "ページ一覧",
            description: "チェック対象のページを選択してください",
            select_all: "全選択",
            deselect_all: "全解除",
            selected: "選択中",
            export_csv: "CSVエクスポート",
            no_pages: "ページがありません。まずサイトをクロールしてください。",
            run_check: "チェック実行",
        },

        // Language
        language: {
            title: "Language",
            english: "English",
            japanese: "日本語",
        },
    },
};
