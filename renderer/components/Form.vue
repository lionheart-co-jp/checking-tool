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
                Check
            </button>
        </p>
    </div>

    <div class="columns">
        <div class="column">
            <div class="notification is-warning">
                If you access to Authorised page
            </div>
        </div>

        <div class="column">
            <div class="field has-addons">
                <p class="control">
                    <a class="button is-static">USER</a>
                </p>
                <p class="control is-expanded">
                    <input type="text" class="input" v-model="formStore.user" />
                </p>
            </div>
        </div>

        <div class="column">
            <div class="field has-addons">
                <p class="control">
                    <a class="button is-static">PASS</a>
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

        return { formStore };
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
