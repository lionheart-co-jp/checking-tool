import { reactive, InjectionKey } from "vue";

const useAlt = () => {
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

export type Store = ReturnType<typeof useAlt>;
export const Key: InjectionKey<Store> = Symbol("AltStore");
export default useAlt;
