import { ipcRenderer } from "electron";
import { URL } from "url";
import fetch, { RequestInit } from "node-fetch";
import { JSDOM } from "jsdom";

type RequestParam = {
    url: string;
    user: string;
    pass: string;
};

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

    const response = await (async () => {
        try {
            return await fetch(url, options);
        } catch (e) {
            console.error(e);
            return false;
        }
    })();

    if (!response) {
        return false;
    }

    if (!response.ok) {
        const body = await response.textConverted();
        console.error(
            `Server responded with status code ${response.status}:\n ${body}`
        );
        return response;
    }

    return response;
};

(window as any).title_request = async ({ url, user, pass }: RequestParam) => {
    const result: { [key: string]: string | null } = {};
    const response = await request(url, { user, pass });

    if (!response || !response.ok) {
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

(window as any).alt_request = async ({ url, user, pass }: RequestParam) => {
    const result: {
        key: number;
        flag: number;
        url: string;
        src: string;
        alt: string;
    }[] = [];
    const response = await request(url, { user, pass });

    if (!response || !response.ok) {
        return false;
    }

    const dom = new JSDOM(await response.textConverted());
    if (!dom) {
        return false;
    }

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

(window as any).headline_request = async ({
    url,
    user,
    pass,
}: RequestParam) => {
    const result: {
        key: number;
        flag: boolean;
        message: string;
        level: number;
        label: string;
    }[] = [];
    const response = await request(url, { user, pass });

    if (!response || !response.ok) {
        return false;
    }

    const dom = new JSDOM(await response.textConverted());
    if (!dom) {
        return false;
    }

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
        let message = flag ? "" : "Headline skipped";
        if (flag && level === 1 && h1Available) {
            flag = false;
            message = "Duplicated <h1>";
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

(window as any).link_request = async ({ url, user, pass }: RequestParam) => {
    const result: {
        key: number;
        label: string;
        href: string;
        target: string;
        url: string;
    }[] = [];
    const response = await request(url, { user, pass });

    if (!response || !response.ok) {
        return false;
    }

    const dom = new JSDOM(await response.textConverted());
    if (!dom) {
        return false;
    }

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

(window as any).link_exists = async ({ url, user, pass }: RequestParam) => {
    const response = await request(url, { user, pass });

    return response && !response.ok;
};

(window as any).util_url_to_base64 = async (url: string) => {
    const response = await request(url);

    if (!response || !response.ok) {
        return false;
    }

    const base64 = (await response.buffer()).toString("base64");
    const encode = response.headers.get("content-type");

    return `data:${encode};base64,${base64}`;
};

(window as any).screen_shot = async () => {
    ipcRenderer.send("start:screen_shot");
};
