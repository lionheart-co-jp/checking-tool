<template>
    <common-hero
        :title="t('title.title')"
        :subtitle="t('title.subtitle')"
    ></common-hero>

    <section class="section">
        <div class="notification">
            <strong>{{ t("label") }}</strong>
            <ul>
                <li>{{ t("title_structure") }}</li>
                <li>{{ t("ogp_structure") }}</li>
            </ul>
        </div>

        <template v-if="titleStore.result">
            <div class="notification is-primary">{{ formStore.url }}</div>

            <title-google></title-google>
            <title-detail></title-detail>
        </template>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

// Component
import TitleGoogle from "../components/Title/Google.vue";
import TitleDetail from "../components/Title/Detail.vue";

// Store
import { useStore as useForm } from "../store/form";
import { useStore as useTitle } from "../store/title";

// Util
import substr from "../util/substr";

export default defineComponent({
    name: "PageTitle",

    components: {
        TitleGoogle,
        TitleDetail,
    },

    setup() {
        const formStore = useForm();
        const titleStore = useTitle();

        return {
            substr,
            formStore,
            titleStore,
            ...useI18n({
                messages: {
                    en: {
                        label:
                            "Remarks when you prepare the title/meta informations",
                        title_structure:
                            'For the title, You should follow the director\'s instruction. If there is no instruction, please input as "[Page name]｜[Site name]"',
                        ogp_structure:
                            "Unless otherwise specified, You should input og:title same with title and og:description same with description.",
                    },
                    ja: {
                        label: "タイトル/メタタグ設定時の注意点",
                        title_structure:
                            "タイトルは原則ディレクター時指示に従ってください。指示がない場合は「ページ名｜サイト名」と指定してください",
                        ogp_structure:
                            "特に指定がない限り、og:titleはtitleと、og:descriptionにはdescriptionと同じ値を指定してください",
                    },
                },
            }),
        };
    },
});
</script>
