import { ipcRenderer } from "electron";
import fetch, { RequestInit } from "node-fetch";
import { JSDOM } from "jsdom";

import { RequestParam, ResultType } from "./type";

import { getTitleInformation } from "./get/title";
import { getAltInformation } from "./get/alt";
import { getHeadlineInformation } from "./get/headline";
import { getLinkInformation } from "./get/link";

declare global {
    interface Window {
        check_page?: (param: RequestParam) => Promise<ResultType | false>;
        link_exists?: (param: RequestParam) => Promise<boolean>;
        util_url_to_base64?: (url: string) => Promise<string | false>;
        screen_shot?: () => Promise<void>;
        get_locale?: () => string;
    }
}

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
                Buffer.from(option.user + ":" + option.pass, "ascii").toString(
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

window.check_page = async (params: RequestParam) => {
    const result: ResultType = {
        title: {},
        alt: [],
        headline: [],
        link: [],
    };
    const response = await request(params.url, {
        user: params.user,
        pass: params.pass,
    });

    if (!response || !response.ok) {
        return false;
    }

    const dom = new JSDOM(await response.textConverted());

    if (!dom) {
        return false;
    }

    result.title = getTitleInformation(dom, params);
    result.alt = getAltInformation(dom, params);
    result.headline = getHeadlineInformation(dom);
    result.link = getLinkInformation(dom, params);

    return result;
};

window.link_exists = async ({ url, user, pass }: RequestParam) => {
    const response = await request(url, { user, pass });

    return response && response.ok;
};

window.util_url_to_base64 = async (url: string) => {
    const response = await request(url);

    if (!response || !response.ok) {
        return false;
    }

    const base64 = (await response.buffer()).toString("base64");
    const encode = response.headers.get("content-type");

    return `data:${encode};base64,${base64}`;
};

window.screen_shot = async () => {
    ipcRenderer.send("start:screen_shot");
};

window.get_locale = () => {
    return ipcRenderer.sendSync("get:locale");
};
