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
        result: ResultType[];
    }>({
        result: [],
    });

    return {
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
