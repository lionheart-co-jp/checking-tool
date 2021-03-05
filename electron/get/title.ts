import { JSDOM } from "jsdom";

import { RequestParam, TitleResult } from "../type";

export const getTitleInformation = (
    dom: JSDOM,
    { user, pass }: RequestParam
) => {
    const result: TitleResult = {};

    result.title =
        dom.window.document.querySelector("title")?.textContent || null;

    const metaList = dom.window.document.querySelectorAll("meta");
    metaList.forEach((meta) => {
        const name = (() => {
            if (meta.hasAttribute("name")) {
                return meta.getAttribute("name");
            } else if (meta.hasAttribute("property")) {
                return meta.getAttribute("property");
            }
            return null;
        })();

        if (name) {
            const content = meta.getAttribute("content");

            if (name === "og:image" && content) {
                const imgUrl = new URL(content);

                if (user && pass) {
                    imgUrl.username = user;
                    imgUrl.password = pass;
                }

                result["og:image_preview"] = imgUrl.toString();
            }

            result[name] = content;
        }
    });

    return result;
};
