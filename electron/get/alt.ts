import { JSDOM } from "jsdom";

import { RequestParam, AltResult } from "../type";

export const getAltInformation = (
    dom: JSDOM,
    { url, user, pass }: RequestParam
) => {
    const result: AltResult = [];

    const images = dom.window.document.querySelectorAll("img");
    images.forEach((img, key) => {
        const src = img.getAttribute("src") || "";
        const alt = img.getAttribute("alt") || "";
        const imgUrl = new URL(src || "", url);

        if (user && pass) {
            imgUrl.username = user;
            imgUrl.password = pass;
        }

        const flag = (() => {
            if (!img.hasAttribute("alt")) {
                return -1;
            } else {
                if (alt && alt !== "") {
                    return 1;
                }
                return 0;
            }
        })();

        result.push({
            key,
            url: imgUrl.toString(),
            src,
            alt,
            flag,
        });
    });

    return result;
};
