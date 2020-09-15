<template>
    <common-hero
        :title="t('alt.title')"
        :subtitle="t('alt.subtitle')"
    ></common-hero>

    <section class="section">
        <div class="container">
            <common-form
                :loading="loading"
                @submit="submitHandler"
            ></common-form>

            <div class="notification">
                <ul>
                    <li>
                        <span class="icon has-text-danger"
                            ><font-awesome-icon icon="ban"></font-awesome-icon
                        ></span>
                        <i18n-t keypath="missing.base">
                            <template #danger>
                                <span class="has-text-danger">{{
                                    t("missing.danger")
                                }}</span>
                            </template>
                        </i18n-t>
                    </li>
                    <li>
                        <span class="icon has-text-warning"
                            ><font-awesome-icon
                                icon="exclamation-triangle"
                            ></font-awesome-icon
                        ></span>
                        <i18n-t keypath="empty.base"></i18n-t>
                    </li>
                    <li>
                        <span class="icon has-text-success"
                            ><font-awesome-icon
                                icon="check-square"
                            ></font-awesome-icon
                        ></span>
                        <i18n-t keypath="filled.base"></i18n-t>
                    </li>
                </ul>
            </div>

            <template v-if="altStore.result.length">
                <div class="notification is-primary">
                    {{ altStore.url }}
                </div>
                <table class="table is-bordered is-fullwidth is-narrow">
                    <thead>
                        <tr>
                            <th></th>
                            <th>{{ t("table.preview") }}</th>
                            <th>src</th>
                            <td>alt</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="img in altStore.result"
                            :key="img.key"
                            :class="{
                                'is-danger': img.flag < 0,
                                'is-warning': img.flag === 0,
                                'is-success': img.flag > 0,
                            }"
                        >
                            <td class="has-text-centered">
                                <span
                                    class="icon"
                                    :class="{
                                        'has-text-danger': img.flag < 0,
                                        'has-text-warning': img.flag === 0,
                                        'has-text-success': img.flag > 0,
                                    }"
                                    ><font-awesome-icon
                                        :icon="
                                            img.flag < 0
                                                ? 'ban'
                                                : img.flag === 0
                                                ? 'exclamation-triangle'
                                                : 'check-square'
                                        "
                                    ></font-awesome-icon
                                ></span>
                            </td>
                            <th class="has-text-centered">
                                <common-image
                                    :src="img.url"
                                    @click="modal_image = $event"
                                    :max-width="200"
                                    :max-height="200"
                                ></common-image>
                            </th>
                            <td>{{ img.src }}</td>
                            <td>{{ img.alt }}</td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>
    </section>

    <common-modal
        :modal-image="modal_image"
        @close="modal_image = ''"
    ></common-modal>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from "vue";
import { useI18n } from "vue-i18n";

// Store
import { Key as FormKey, Store as FormStore } from "../use/form";
import { Key as AltKey, Store as AltStore } from "../use/alt";

const useSubmitHandler = (
    formStore: FormStore,
    altStore: AltStore,
    loading: Ref<boolean>
) => {
    return async () => {
        altStore.url = "";
        altStore.result = [];

        loading.value = true;
        const result = await (window as any).alt_request(formStore);
        loading.value = false;

        if (!result) {
            window.alert("Failed to get specified URL");
            return;
        }

        altStore.url = formStore.url;
        altStore.result = result;
    };
};

export default defineComponent({
    name: "PageAlt",

    setup() {
        const formStore = inject(FormKey);
        if (!formStore) {
            throw new Error("FormKey is not provided yet");
        }

        const altStore = inject(AltKey);
        if (!altStore) {
            throw new Error("AltKey is not provided yet");
        }

        const loading = ref<boolean>(false);
        const modal_image = ref<string>("");
        const submitHandler = useSubmitHandler(formStore, altStore, loading);

        return {
            altStore,
            loading,
            modal_image,
            submitHandler,
            ...useI18n({
                messages: {
                    en: {
                        missing: {
                            base:
                                "Alt attribute is missing. {danger} even if it's empty",
                            danger: "you must add alt attribute",
                        },
                        empty: {
                            base:
                                "Alt attribute is empty. If this image is included text, please insert to alt attribute.",
                        },
                        filled: {
                            base:
                                "Alt attribute is filled. But, please check the alt attribute value is correct or not.",
                        },
                        table: {
                            preview: "Preview",
                        },
                    },
                    ja: {
                        missing: {
                            base:
                                "Alt属性が存在しません。指定するテキストが存在しなくても、{danger}",
                            danger: "必ずAlt属性を追加してください。",
                        },
                        empty: {
                            base:
                                "Alt属性が空欄です。もし画像にテキストが含まれている場合はAlt属性に挿入してください。",
                        },
                        filled: {
                            base:
                                "Alt属性が指定されています。挿入されているテキストが画像と一致しているか確認してください。",
                        },
                        table: {
                            preview: "プレビュー",
                        },
                    },
                },
            }),
        };
    },
});
</script>

<style scoped>
table.table .is-danger {
    background: #ffd1da;
}
table.table .is-warning {
    background: #fffcf0;
}
table.table .is-success {
    background: #f6fef9;
}
</style>
