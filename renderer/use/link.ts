import { reactive, InjectionKey } from "vue";

export type ResultType = {
    key: number;
    label: string;
    href: string;
    target: string;
    url: string;
};

const useLink = () => {
    const state = reactive<{
        url: string;
        user: string;
        pass: string;
        result: ResultType[];
    }>({
        url: "",
        user: "",
        pass: "",
        result: [],
    });

    return {
        get url() {
            return state.url;
        },
        set url(url) {
            state.url = url;
        },
        get user() {
            return state.user;
        },
        set user(user) {
            state.user = user;
        },
        get pass() {
            return state.pass;
        },
        set pass(pass) {
            state.pass = pass;
        },
        get result() {
            return state.result;
        },
        set result(result) {
            if (result) {
                state.result = [...result];
            } else {
                state.result = [];
            }
        },
    };
};

export type Store = ReturnType<typeof useLink>;
export const Key: InjectionKey<Store> = Symbol("LinkStore");
export default useLink;
