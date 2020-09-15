<template>
    <div class="field has-addons">
        <p class="control">
            <a class="button is-static is-large">URL</a>
        </p>
        <p class="control is-expanded">
            <input
                type="text"
                class="input is-large"
                v-model="formStore.url"
                placeholder="http://example.com"
            />
        </p>
        <p class="control">
            <button
                class="button is-info is-large"
                :class="{ 'is-loading': loading }"
                @click="$emit('submit')"
            >
                {{ t("check") }}
            </button>
        </p>
    </div>

    <div class="columns">
        <div class="column">
            <div class="notification is-warning">{{ t("notice") }}</div>
        </div>

        <div class="column">
            <div class="field has-addons">
                <p class="control">
                    <a class="button is-static">{{ t("user") }}</a>
                </p>
                <p class="control is-expanded">
                    <input type="text" class="input" v-model="formStore.user" />
                </p>
            </div>
        </div>

        <div class="column">
            <div class="field has-addons">
                <p class="control">
                    <a class="button is-static">{{ t("pass") }}</a>
                </p>
                <p class="control is-expanded">
                    <input type="text" class="input" v-model="formStore.pass" />
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { useI18n } from "vue-i18n";

// Store
import { Key as FormKey } from "../use/form";

export default defineComponent({
    name: "CommonForm",

    props: {
        loading: { type: Boolean, default: false },
    },

    setup() {
        const formStore = inject(FormKey);
        if (!formStore) {
            throw new Error("FormKey is not provided yet");
        }

        return {
            formStore,
            ...useI18n({
                messages: {
                    en: {
                        check: "Check",
                        notice: "If you access to Authorised page",
                        user: "USER",
                        pass: "PASS",
                    },
                    ja: {
                        check: "確認",
                        notice: "認証が掛かっているページを確認する場合",
                        user: "ユーザ名",
                        pass: "パスワード",
                    },
                },
            }),
        };
    },
});
</script>

<style scoped>
.notification.is-warning {
    padding: 0.35rem 2.5rem 0.35rem 1.5rem;
}

.columns:last-child {
    margin-bottom: 0;
}
</style>
