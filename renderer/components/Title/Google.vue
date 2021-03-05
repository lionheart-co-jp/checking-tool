<template>
    <div class="card mb-5">
        <header class="card-header">
            <h2 class="card-header-title">{{ t("label") }}</h2>
            <a
                href="#"
                class="card-header-icon"
                aria-label="more options"
                @click.prevent="togglePanel"
            >
                <span class="icon">
                    <font-awesome-icon
                        :icon="isPanelOpen ? 'angle-up' : 'angle-down'"
                    ></font-awesome-icon>
                </span>
            </a>
        </header>

        <div class="card-content" v-if="isPanelOpen">
            <h3>PC</h3>

            <div class="box google-preview">
                <p class="google-preview__title">
                    {{ substr(titleStore.result.title, 56, "…") }}
                </p>
                <p class="google-preview__description">
                    {{ substr(titleStore.result.description, 240, "…") }}
                </p>
            </div>

            <h3>SP</h3>

            <div class="box google-preview is-sp">
                <p class="google-preview__title">
                    {{ substr(titleStore.result.title, 64, "…") }}
                </p>
                <p class="google-preview__description">
                    {{ substr(titleStore.result.description, 240, "…") }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

// Store
import { useStore as useTitle } from "../../store/title";

// Util
import substr from "../../util/substr";

export default defineComponent({
    name: "PageTitleGoogle",

    setup() {
        const titleStore = useTitle();

        const isPanelOpen = ref<boolean>(false);
        const togglePanel = () => {
            isPanelOpen.value = !isPanelOpen.value;
        };

        return {
            substr,
            titleStore,
            isPanelOpen,
            togglePanel,
            ...useI18n({
                messages: {
                    en: {
                        label: "Google Preview",
                    },
                    ja: {
                        label: "Googleプレビュー",
                    },
                },
            }),
        };
    },
});
</script>

<style scoped>
.google-preview {
    font-family: arial, sans-serif;
    width: 600px;
    box-sizing: content-box;
}
.google-preview.is-sp {
    font-family: Roboto, HelveticaNeue, Arial, sans-serif;
    width: 360px;
}
.google-preview__title {
    font-size: 20px;
    line-height: 1.3;
    margin-bottom: 3px;
    color: #1a0dab;
}
.google-preview.is-sp .google-preview__title {
    font-size: 18px;
}
.google-preview__description {
    font-size: 14px;
    color: #4d5156;
    line-height: 1.58;
}
.google-preview.is-sp .google-preview__description {
    line-height: 20px;
}
</style>
