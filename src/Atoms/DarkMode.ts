import { atom, useRecoilState, useRecoilValue } from "recoil";

export const state = atom({
    key: "dark_mode",
    default: (() => {
        if (typeof window === "undefined") {
            return false;
        }

        switch (window.sessionStorage.getItem("checktool-darkmode")) {
            case "true":
                return true;
            case "false":
                return false;
            default:
                return window.matchMedia("(prefers-color-scheme: dark)")
                    .matches;
        }
    })(),
});

export const useState = () => {
    return useRecoilState(state);
};

export const useValue = () => {
    return useRecoilValue(state);
};
