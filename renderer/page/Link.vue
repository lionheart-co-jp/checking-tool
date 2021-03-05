<template>
    <common-hero
        :title="t('link.title')"
        :subtitle="t('link.subtitle')"
    ></common-hero>

    <section class="section">
        <div class="notification is-danger">
            <strong>{{ t("notification.label") }}</strong>
            <p>{{ t("notification.body") }}</p>
        </div>

        <template v-if="linkStore.result.length">
            <div class="notification is-primary">
                {{ formStore.url }}
            </div>
            <table class="table is-bordered is-fullwidth is-narrow">
                <colgroup>
                    <col width="auto" />
                    <col width="25%" />
                    <col width="25%" />
                    <col width="25%" />
                    <col width="25%" />
                </colgroup>
                <thead>
                    <tr>
                        <th></th>
                        <th>Content</th>
                        <th>Href</th>
                        <th>Target</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>
                    <link-row
                        v-for="anchor in linkStore.result"
                        :key="anchor.key"
                        :anchor="anchor"
                    ></link-row>
                </tbody>
            </table>
        </template>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

// Components
import LinkRow from "../components/Link/Row.vue";

// Store
import { useStore as useForm } from "../store/form";
import { useStore as useLink } from "../store/link";

export default defineComponent({
    name: "PageAlt",

    components: {
        LinkRow,
    },

    setup() {
        const formStore = useForm();
        const linkStore = useLink();

        const loading = ref<boolean>(false);
        const modal_image = ref<string>("");

        return {
            formStore,
            linkStore,
            loading,
            modal_image,
            ...useI18n({
                messages: {
                    en: {
                        notification: {
                            label: "Warning",
                            body:
                                "This function will access to the all the links in the target URL. so, you must NOT run this function multiple times in a short time.",
                        },
                    },
                    ja: {
                        notification: {
                            label: "注意",
                            body:
                                "この機能は指定されたURLのページ内のリンク全てにアクセスを試みます。そのため、短時間に複数回実行しないようにしてください。",
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
