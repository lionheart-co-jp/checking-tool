<template>
    <header id="header" class="navbar is-primary is-fixed-top">
        <div class="navbar-brand">
            <router-link class="navbar-item" :to="{ name: 'dashboard' }">
                <strong>Checker Support Tool</strong>
            </router-link>
            <a
                class="navbar-burger burger"
                role="button"
                aria-label="menu"
                aria-expanded="false"
                data-target="mainNavBar"
                :class="{ 'is-active': isOpen }"
                @click="isOpen = !isOpen"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div
            id="mainNavBar"
            class="navbar-menu"
            :class="{ 'is-active': isOpen }"
        >
            <div class="navbar-start glow">
                <div class="navbar-item glow">
                    <div class="field has-addons glow">
                        <p class="control">
                            <a class="button is-static">URL</a>
                        </p>
                        <p class="control is-expanded">
                            <input
                                type="text"
                                class="input"
                                v-model="url"
                                placeholder="http://example.com"
                                size="20"
                            />
                        </p>
                    </div>
                </div>
                <div class="navbar-item">
                    <div class="field has-addons">
                        <p class="control">
                            <a class="button is-static">{{ t("user") }}</a>
                        </p>
                        <p class="control is-expanded">
                            <input
                                type="text"
                                class="input"
                                v-model="user"
                                size="8"
                            />
                        </p>
                    </div>
                </div>
                <div class="navbar-item">
                    <div class="field has-addons">
                        <p class="control">
                            <a class="button is-static">{{ t("pass") }}</a>
                        </p>
                        <p class="control is-expanded">
                            <input
                                type="text"
                                class="input"
                                v-model="pass"
                                size="8"
                            />
                        </p>
                    </div>
                </div>
                <div class="navbar-item">
                    <button
                        class="button is-info"
                        :class="{ 'is-loading': isLoading }"
                        @click="submitHandler"
                    >
                        {{ t("check") }}
                    </button>
                </div>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="select is-primary">
                        <select v-model="locale">
                            <option value="en">English</option>
                            <option value="ja">Japanese</option>
                        </select>
                    </div>
                </div>
                <!-- <div class="navbar-item">
                    <div class="buttons">
                        <button
                            class="button is-info"
                            @click="screenShotHandler"
                        >
                            Capture
                        </button>
                    </div>
                </div> -->
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

// Store
import { useStore as useForm } from "../store/form";
import { useStore as useTitle } from "../store/title";
import { useStore as useAlt } from "../store/alt";
import { useStore as useHeadline } from "../store/headline";
import { useStore as useLink } from "../store/link";

// Util
import setViewportProperty from "../util/setViewportProperty";

// Type
import { RequestParam, ResultType } from "../type";

// Debug
import debugCheckPage from "../debug/check_page";

declare global {
    interface Window {
        check_page?: (param: RequestParam) => Promise<ResultType | false>;
    }
}

export default defineComponent({
    name: "Header",

    setup() {
        const isOpen = ref<boolean>(false);
        const isLoading = ref<boolean>(false);

        const url = ref<string>("");
        const user = ref<string>("");
        const pass = ref<string>("");

        const formStore = useForm();
        const titleStore = useTitle();
        const altStore = useAlt();
        const headlineStore = useHeadline();
        const linkStore = useLink();

        const submitHandler = async () => {
            titleStore.result = null;
            altStore.result = [];
            headlineStore.result = [];
            linkStore.result = [];

            const result = await (async () => {
                if (typeof window.check_page === "function") {
                    isLoading.value = true;
                    const result = await window.check_page({
                        url: url.value,
                        user: user.value,
                        pass: pass.value,
                    });
                    isLoading.value = false;
                    return result;
                } else {
                    return debugCheckPage;
                }
            })();

            if (!result) {
                window.alert("Failed to get specified URL");
                return;
            }

            formStore.url = url.value;
            formStore.user = user.value;
            formStore.pass = pass.value;

            titleStore.result = result.title;
            altStore.result = result.alt;
            headlineStore.result = result.headline;
            linkStore.result = result.link;
        };
        const screenShotHandler = () => {
            (window as any).screen_shot();
        };
        setViewportProperty();

        return {
            isOpen,
            isLoading,
            url,
            user,
            pass,
            submitHandler,
            screenShotHandler,
            ...useI18n(),
        };
    },
});
</script>

<style scoped>
.navbar-brand {
}
.navbar-brand .navbar-item {
    width: 200px;
}
.glow {
    flex-grow: 1;
}
</style>
