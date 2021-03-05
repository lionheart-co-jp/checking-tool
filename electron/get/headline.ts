import { JSDOM } from "jsdom";

import { HeadlineResult } from "../type";

export const getHeadlineInformation = (dom: JSDOM) => {
    const result: HeadlineResult = [];

    const headlines = dom.window.document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
    );
    let prev = 0;
    let h1Available = false;

    headlines.forEach((headline, key) => {
        const level = parseInt(headline.nodeName.replace("H", ""));
        const label = headline.innerHTML;

        // Check Headline Error
        let flag = level - prev <= 1;
        let message = flag ? "" : "skipped";
        if (flag && level === 1 && h1Available) {
            flag = false;
            message = "duplicated";
        }

        if (level === 1) {
            h1Available = true;
        }
        prev = level;

        result.push({
            key,
            level,
            label,
            flag,
            message,
        });
    });

    return result;
};
