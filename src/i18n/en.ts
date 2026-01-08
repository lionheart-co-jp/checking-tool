export default {
    translation: {
        // Common
        common: {
            user: "USER",
            pass: "PASS",
            basic: "Basic",
            result: "Result",
            not_found: "Not Found",
            warning: "Warning",
            more: "More",
            bulk: "Bulk",
            theme: {
                light: "Light theme",
                dark: "Dark theme",
            },
        },

        // Application
        apply: {
            title: "Checker support tools",
        },

        // Form
        form: {
            warning:
                "If you access to Authorised page, please input USER and PASS fields.",
            bulk_help: "You can input multiple URLs per line",
        },

        // Dashboard
        dashboard: {
            title: "Dashboard",
        },

        // Title
        title: {
            title: "Check Title/Meta",
            description: "Checking Title and Meta informations",
            remarks: {
                title: "Remarks when you prepare the title/meta informations",
                body1: "For the title, You should follow the director's instruction. If there is no instruction, please input as [Page name]｜[Site name]",
                body2: "Unless otherwise specified, You should input og:title same with title and og:description same with description.",
            },
            analytics: {
                title: "Analytics",
                ua_deprecated: "UA was deprecated in July 2023",
            },
            canonical: {
                mismatch: "Does not match current page URL",
            },
        },

        // Alt
        alt: {
            title: "Check Image Alt",
            description: "Checking Image Alt attribute function",
            remarks: {
                title: "Meaning of the mark of checking result",
                body1: "Alt attribute is missing. <strong>you must add alt attribute</strong> even if it's empty.",
                body2: "Alt attribute is empty. If this image is included text, please insert to alt attribute.",
                body3: "Alt attribute is filled. But, please check the alt attribute value is correct or not.",
            },
        },

        // Headline
        headline: {
            title: "Check Headline",
            description: "Checking Headline structure",
            remarks: {
                title: "Remarks when you prepare the headlines",
                body1: "Don't skip headline level (e.g. <h1> -> <h3> is Not Good)",
                body2: "<h1> tag must be only one in the page",
            },
        },

        // Link
        link: {
            title: "Check Link",
            description: "Check Link target available",
            warning:
                "This function will access to the all the links in the target URL. so, you must NOT run this function multiple times in a short time.",
        },

        // Crawl
        crawl: {
            title: "Crawl Website",
            description: "Discover pages from the specified URL",
            url: "Start URL",
            url_placeholder: "https://example.com/",
            max_depth: "Max Depth",
            max_concurrent: "Concurrent Requests",
            start: "Start Crawl",
            stop: "Stop Crawl",
            progress: {
                title: "Crawl Progress",
                current: "Checking",
                found: "Pages Found",
                errors: "Errors",
            },
            tab: {
                crawl: "Crawl",
                direct: "Direct URL Input",
            },
            direct: {
                urls: "URL List",
                urls_placeholder:
                    "https://example.com/page1\nhttps://example.com/page2\nhttps://example.com/page3",
                urls_help:
                    "Enter one URL per line. Only URLs from the same domain are allowed.",
                urls_required: "Please enter URLs",
                clear_existing: "Clear existing page list",
                submit: "Add Pages",
                error_empty: "No URLs entered",
                error_invalid_url: "Invalid URL: {{url}}",
                error_different_domain: "All URLs must be from the same domain",
            },
        },

        // Page List
        pageList: {
            title: "Page List",
            description: "Select pages to check",
            select_all: "Select All",
            deselect_all: "Deselect All",
            selected: "Selected",
            export_csv: "Export CSV",
            no_pages: "No pages found. Please crawl a website first.",
            run_check: "Run Check",
        },

        // Language
        language: {
            title: "Language",
            english: "English",
            japanese: "日本語",
        },
    },
};
