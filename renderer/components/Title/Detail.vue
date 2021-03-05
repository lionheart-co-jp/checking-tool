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
            <h3 class="title is-4">{{ t("basic") }}</h3>

            <table class="table is-bordered is-fullwidth">
                <tbody>
                    <tr>
                        <th>Title</th>
                        <td>{{ titleStore.result.title }}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>{{ titleStore.result.description }}</td>
                    </tr>
                    <tr>
                        <th>Keyword</th>
                        <td>{{ titleStore.result.keywords }}</td>
                    </tr>
                    <tr>
                        <th>Vieport</th>
                        <td>{{ titleStore.result.viewport }}</td>
                    </tr>
                </tbody>
            </table>

            <h3 class="title is-4">OGP</h3>
            <table class="table is-bordered is-fullwidth">
                <tbody>
                    <tr>
                        <th>og:title</th>
                        <td>{{ titleStore.result["og:title"] }}</td>
                    </tr>
                    <tr>
                        <th>og:type</th>
                        <td>{{ titleStore.result["og:type"] }}</td>
                    </tr>
                    <tr>
                        <th>og:url</th>
                        <td>{{ titleStore.result["og:url"] }}</td>
                    </tr>
                    <tr>
                        <th>og:description</th>
                        <td>
                            {{ titleStore.result["og:description"] }}
                        </td>
                    </tr>
                    <tr>
                        <th>og:site_name</th>
                        <td>{{ titleStore.result["og:site_name"] }}</td>
                    </tr>
                    <tr>
                        <th>og:image</th>
                        <td>
                            {{ titleStore.result["og:image"] }}

                            <template
                                v-if="titleStore.result['og:image_preview']"
                                ><common-image
                                    :src="titleStore.result['og:image_preview']"
                                    @click="modal_image = $event"
                                    :max-width="600"
                                    :max-height="400"
                                ></common-image
                            ></template>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3 class="title is-4">SNS</h3>
            <table class="table is-bordered is-fullwidth">
                <tbody>
                    <tr>
                        <th>fb:app_id</th>
                        <td>{{ titleStore.result["fb:app_id"] }}</td>
                    </tr>
                    <tr>
                        <th>twitter:card</th>
                        <td>{{ titleStore.result["twitter:card"] }}</td>
                    </tr>
                    <tr>
                        <th>twitter:site</th>
                        <td>{{ titleStore.result["twitter:site"] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <common-modal
        :modal-image="modal_image"
        @close="modal_image = ''"
    ></common-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

// Store
import { useStore as useTitle } from "../../store/title";

// Util
import substr from "../../util/substr";

export default defineComponent({
    name: "PageTitleDetail",

    setup() {
        const titleStore = useTitle();

        const isPanelOpen = ref<boolean>(false);
        const togglePanel = () => {
            isPanelOpen.value = !isPanelOpen.value;
        };

        const modal_image = ref<string>("");

        return {
            substr,
            titleStore,
            isPanelOpen,
            togglePanel,
            modal_image,
            ...useI18n({
                messages: {
                    en: {
                        label: "Detail Information",
                        basic: "Basic",
                    },
                    ja: {
                        label: "詳細確認",
                        basic: "基本情報",
                    },
                },
            }),
        };
    },
});
</script>
