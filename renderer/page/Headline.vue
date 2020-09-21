<template>
    <common-hero
        :title="t('headline.title')"
        :subtitle="t('headline.subtitle')"
    ></common-hero>

    <section class="section">
        <common-form :loading="loading" @submit="submitHandler"></common-form>

        <div class="notification">
            <strong>{{ t("label") }}</strong>
            <ul>
                <li>{{ t("dont_skip") }}</li>
                <li>{{ t("h1_only_one") }}</li>
            </ul>
        </div>

        <template v-if="headlineStore.result.length"
            ><div class="notification is-primary">
                {{ headlineStore.url }}
            </div>
            <ul class="headline-list">
                <li
                    :class="`level-${head.level}`"
                    v-for="head in headlineStore.result"
                >
                    <template v-if="!head.flag"
                        ><span class="tag is-danger">{{
                            t(head.message)
                        }}</span></template
                    >
                    <div>
                        <span
                            class="icon"
                            :class="{
                                'has-text-danger': !head.flag,
                                'has-text-success': head.flag,
                            }"
                            ><font-awesome-icon
                                :icon="head.flag ? 'check-square' : 'ban'"
                            ></font-awesome-icon></span
                        ><span class="list-level">{{ head.level + "." }}</span
                        ><span class="list-label">{{ head.label }}</span>
                    </div>
                </li>
            </ul>
        </template>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { useI18n } from "vue-i18n";

// Store
import { useStore as useForm, Store as FormStore } from "../store/form";
import {
    useStore as useHeadline,
    Store as HeadlineStore,
} from "../store/headline";

const useSubmitHandler = (
    formStore: FormStore,
    headlineStore: HeadlineStore,
    loading: Ref<boolean>
) => {
    return async () => {
        headlineStore.url = "";
        headlineStore.result = [];

        loading.value = true;
        const result = await (window as any).headline_request(formStore);
        loading.value = false;

        if (!result) {
            window.alert("Failed to get specified URL");
            return;
        }

        headlineStore.url = formStore.url;
        headlineStore.result = result;
    };
};

export default defineComponent({
    name: "PageHeadline",

    setup() {
        const formStore = useForm();
        const headlineStore = useHeadline();

        const loading = ref<boolean>(false);
        const submitHandler = useSubmitHandler(
            formStore,
            headlineStore,
            loading
        );

        return {
            headlineStore,
            loading,
            submitHandler,
            ...useI18n({
                messages: {
                    en: {
                        label: "Remarks when you prepare the headlines",
                        dont_skip:
                            "Don't skip headline level (e.g. <h1> -> <h3> is Not Good)",
                        h1_only_one: "<h1> tag must be only one in the page",
                        skipped: "Headline level was skipped",
                        duplicated: "<h1> tag wes duplicated",
                    },
                    ja: {
                        label: "見出し設定時の注意点",
                        dont_skip:
                            "見出しレベルはスキップしないようにしてください。（例 : <h1>の次が<h3>にならないようにする）",
                        h1_only_one:
                            "<h1>タグはページ内に一つだけ存在するようにしてください。",
                        skipped: "見出しレベルが飛んでいます",
                        duplicated: "<h1>タグが重複しています",
                    },
                },
            }),
        };
    },
});
</script>

<style scoped>
.notification.is-info ul li {
    list-style: disc;
    margin-left: 1.6em;
}

.headline-list li ~ li {
    margin-top: 0.5rem;
}

.headline-list li.level-1 {
}
.headline-list li.level-2 {
    margin-left: 2em;
}
.headline-list li.level-3 {
    margin-left: 4em;
}
.headline-list li.level-4 {
    margin-left: 6em;
}
.headline-list li.level-5 {
    margin-left: 8em;
}
.headline-list li.level-6 {
    margin-left: 10em;
}

.headline-list li div {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}

.headline-list li .icon {
    flex-shrink: 0;
}
.headline-list li .list-level {
    text-align: center;
    width: 1.5em;
    flex-shrink: 0;
}
.headline-list li .list-label {
    font-weight: bold;
}
</style>
