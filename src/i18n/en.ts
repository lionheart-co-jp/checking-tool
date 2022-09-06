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
        },

        // Application
        apply: {
            title: "Checker support tools",
        },

        // Form
        form: {
            warning:
                "If you access to Authorised page, please input USER and PASS fields.",
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

        // Language
        language: {
            title: "Language",
            english: "English",
            japanese: "日本語",
        },
    },
};
