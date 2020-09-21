import { reactive, InjectionKey, provide, inject } from "vue";

export const StoreName = "Headline";

const prepareStore = () => {
    const state = reactive<{
        url: string;
        result: {
            key: number;
            flag: boolean;
            message: string;
            level: number;
            label: string;
        }[];
    }>({
        url: "",
        result: [],
    });

    return {
        get url() {
            return state.url;
        },
        set url(url) {
            state.url = url;
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
