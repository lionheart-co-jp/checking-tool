import { reactive, InjectionKey, provide, inject } from "vue";

export const StoreName = "Link";

export type ResultType = {
    key: number;
    label: string;
    href: string;
    target: string;
    url: string;
};

const prepareStore = () => {
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

export type Store = ReturnType<typeof prepareStore>;
export const StoreKey: InjectionKey<Store> = Symbol(`${StoreName}Store`);

export const useStore = () => {
    const store = inject(StoreKey);
    if (!store) {
        throw new Error(`${StoreName} is not provided yet`);
    }
    return store;
};

export const provideStore = () => {
    provide(StoreKey, prepareStore());
};
