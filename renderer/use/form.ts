import { reactive, InjectionKey } from "vue";

const useForm = () => {
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

export type Store = ReturnType<typeof useForm>;
export const Key: InjectionKey<Store> = Symbol("FormStore");
export default useForm;
