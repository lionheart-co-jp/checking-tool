import { atom, useRecoilState, useRecoilValue } from "recoil";

export const state = atom({
    key: "bulk_url",
    default: "",
});

export const useState = () => {
    return useRecoilState(state);
};

export const useValue = () => {
    return useRecoilValue(state);
};
