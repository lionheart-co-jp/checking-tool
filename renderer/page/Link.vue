<template>
    <common-hero
        title="Check Link"
        subtitle="Check Link target function"
    ></common-hero>

    <section class="section">
        <div class="container">
            <common-form
                :loading="loading"
                @submit="submitHandler"
            ></common-form>

            <template v-if="linkStore.result.length">
                <div class="notification is-primary">
                    {{ linkStore.url }}
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
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from "vue";

// Components
import LinkRow from "../components/Link/Row.vue";

// Store
import { Key as FormKey, Store as FormStore } from "../use/form";
import { Key as LinkKey, Store as LinkStore } from "../use/link";

const useSubmitHandler = (
    formStore: FormStore,
    linkStore: LinkStore,
    loading: Ref<boolean>
) => {
    return async () => {
        linkStore.url = "";
        linkStore.user = "";
        linkStore.pass = "";
        linkStore.result = [];

        loading.value = true;
        const result = await (window as any).link_request(formStore);
        loading.value = false;

        if (!result) {
            window.alert("Failed to get specified URL");
            return;
        }

        linkStore.url = formStore.url;
        linkStore.user = formStore.user;
        linkStore.pass = formStore.pass;
        linkStore.result = result;
    };
};

export default defineComponent({
    name: "PageAlt",

    components: {
        LinkRow,
    },

    setup() {
        const formStore = inject(FormKey);
        if (!formStore) {
            throw new Error("FormKey is not provided yet");
        }

        const linkStore = inject(LinkKey);
        if (!linkStore) {
            throw new Error("LinkKey is not provided yet");
        }

        const loading = ref<boolean>(false);
        const modal_image = ref<string>("");
        const submitHandler = useSubmitHandler(formStore, linkStore, loading);

        return {
            linkStore,
            loading,
            modal_image,
            submitHandler,
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
