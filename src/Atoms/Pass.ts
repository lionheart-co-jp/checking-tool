import { atom, useRecoilState, useRecoilValue } from "recoil";

export const state = atom({
    key: "pass",
    default: "",
});

export const useState = () => {
    return useRecoilState(state);
};

export const useValue = () => {
    return useRecoilValue(state);
};
