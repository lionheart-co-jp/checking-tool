import { reactive, InjectionKey, provide, inject } from "vue";

export const StoreName = "Form";

const prepareStore = () => {
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
