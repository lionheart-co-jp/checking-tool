import { reactive, InjectionKey } from "vue";

const useApp = () => {
    const state = reactive<{
        url: string;
        user: string;
        pass: string;
    }>({
        url: "",
        user: "",
        pass: "",
    });

    return {
        get url() {
            return state.url;
        },
        set url(url) {
            state.url = url;
        },
        get user() {
            return state.url;
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
    };
};

export type Store = ReturnType<typeof useApp>;
export const Key: InjectionKey<Store> = Symbol("AppStore");
export default useApp;
