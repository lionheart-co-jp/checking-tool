<template>
    <navbar></navbar>

    <router-view></router-view>
</template>

<script>
import { defineComponent, provide } from "vue";

// Components
import Navbar from "./components/Navbar.vue";

// Store
import useForm, { Key as FormKey } from "./use/form";
import useTitle, { Key as TitleKey } from "./use/title";
import useAlt, { Key as AltKey } from "./use/alt";
import useHeadline, { Key as HeadlineKey } from "./use/headline";
import useLink, { Key as LinkKey } from "./use/link";

export default defineComponent({
    name: "App",

    components: { Navbar },

    setup() {
        provide(FormKey, useForm());
        provide(TitleKey, useTitle());
        provide(AltKey, useAlt());
        provide(HeadlineKey, useHeadline());
        provide(LinkKey, useLink());

        return {};
    },
});
</script>
