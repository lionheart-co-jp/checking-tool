<template>
    <common-hero
        title="Check Title/Meta"
        subtitle="Check Title and Meta information function"
    ></common-hero>

    <section class="section">
        <div class="container">
            <common-form
                :loading="loading"
                @submit="submitHandler"
            ></common-form>

            <template v-if="titleStore.result">
                <div class="notification is-primary">{{ titleStore.url }}</div>

                <h3 class="title is-4">Basic</h3>

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
                            <td>{{ titleStore.result["og:description"] }}</td>
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
                                        :src="
                                            titleStore.result[
                                                'og:image_preview'
                                            ]
                                        "
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
            </template>
        </div>
    </section>

    <common-modal
        :modal-image="modal_image"
        @close="modal_image = ''"
    ></common-modal>
</template>

<script lang="ts">
import { defineComponent, inject, Ref, ref } from "vue";

// Store
import { Key as FormKey, Store as FormStore } from "../use/form";
import { Key as TitleKey, Store as TitleStore } from "../use/title";

const useSubmitHandler = (
    formStore: FormStore,
    titleStore: TitleStore,
    loading: Ref<boolean>
) => {
    return async () => {
        titleStore.url = "";
        titleStore.result = null;

        loading.value = true;
        const result = await (window as any).title_request(formStore);
        loading.value = false;

        if (!result) {
            window.alert("Failed to get specified URL");
            return;
        }

        titleStore.url = formStore.url;
        titleStore.result = result;
    };
};

export default defineComponent({
    name: "PageTitle",

    setup() {
        const formStore = inject(FormKey);
        if (!formStore) {
            throw new Error("FormKey is not provided yet");
        }

        const titleStore = inject(TitleKey);
        if (!titleStore) {
            throw new Error("TitleKey is not provided yet");
        }

        const loading = ref<boolean>(false);
        const modal_image = ref<string>("");
        const submitHandler = useSubmitHandler(formStore, titleStore, loading);

        return {
            titleStore,
            loading,
            modal_image,
            submitHandler,
        };
    },
});
</script>
