<template>
    <common-hero
        title="Check Headline"
        subtitle="Checking Headline structure"
    ></common-hero>

    <section class="section">
        <div class="container">
            <common-form
                :loading="loading"
                @submit="submitHandler"
            ></common-form>

            <div class="notification is-info">
                <ul>
                    <li>
                        Don't skip headline level (e.g. &lt;h1&gt; -> &lt;h3&gt;
                        is No Good)
                    </li>
                    <li>&lt;h1&gt; tag must be only one in the page</li>
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
                                head.message
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
                            ><span class="list-level">{{
                                head.level + "."
                            }}</span
                            ><span class="list-label">{{ head.label }}</span>
                        </div>
                    </li>
                </ul>
            </template>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from "vue";

// Store
import { Key as FormKey, Store as FormStore } from "../use/form";
import { Key as HeadlineKey, Store as HeadlineStore } from "../use/headline";

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
        const formStore = inject(FormKey);
        if (!formStore) {
            throw new Error("FormKey is not provided yet");
        }

        const headlineStore = inject(HeadlineKey);
        if (!headlineStore) {
            throw new Error("HeadlineKey is not provided yet");
        }

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
