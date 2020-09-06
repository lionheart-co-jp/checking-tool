import { ipcRenderer } from "electron";
import { URL } from "url";
import fetch, { RequestInit } from "node-fetch";
import { JSDOM } from "jsdom";

const request = async (
    url: string,
    option: { user?: string; pass?: string } = {}
) => {
    const options: RequestInit = {};

    if (
        option.hasOwnProperty("user") &&
        option.hasOwnProperty("pass") &&
        option.user !== "" &&
        option.pass !== ""
    ) {
        options.headers = {
            authorization:
                "Basic " +
                new Buffer(option.user + ":" + option.pass, "ascii").toString(
                    "base64"
                ),
        };
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const body = await response.textConverted();
        throw new Error(
            `Server responded with status code ${response.status}:\n ${body}`
        );
    }

    return response;
};

(window as any).title_request = async ({
    url,
    user,
    pass,
}: {
    url: string;
    user: string;
    pass: string;
}) => {
    const result: { [key: string]: string | null } = {};
    const response = await request(url, { user, pass });

    if (!response.ok) {
        return false;
    }

    const dom = new JSDOM(await response.textConverted());

    if (!dom) {
        return false;
    }

    result["title"] =
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

(window as any).util_url_to_base64 = async (url: string) => {
    const response = await request(url);

    if (!response.ok) {
        return false;
    }

    const base64 = (await response.buffer()).toString("base64");
    const encode = response.headers["content-type"];

    return `data:${encode};base64,${base64}`;
};

(window as any).screen_shot = async () => {
    ipcRenderer.send("start:screen_shot");
};
