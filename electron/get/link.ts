import { URL } from "url";
import { JSDOM } from "jsdom";

import { RequestParam, LinkResult } from "../type";

export const getLinkInformation = (dom: JSDOM, { url }: RequestParam) => {
    const result: LinkResult = [];

    const anchors = dom.window.document.querySelectorAll("a");
    anchors.forEach((anchor, key) => {
        const href = anchor.getAttribute("href") || "";
        const target = anchor.getAttribute("target") || "";
        const label = anchor.innerHTML;

        const actualUrl = (() => {
            if (href.match(/^https?:/)) {
                return new URL(href);
            } else {
                return new URL(href, url);
            }
        })();

        result.push({
            key,
            url: actualUrl.toString(),
            href,
            target,
            label,
        });
    });

    return result;
};
