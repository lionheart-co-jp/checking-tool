import { reactive, InjectionKey } from "vue";

const useTitle = () => {
    const state = reactive<{
        url: string;
        result: { [key: string]: string | null } | null;
    }>({
        url: "",
        result: null,
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
                state.result = { ...result };
            } else {
                state.result = null;
            }
        },
    };
};

export type Store = ReturnType<typeof useTitle>;
export const Key: InjectionKey<Store> = Symbol("TitleStore");
export default useTitle;
