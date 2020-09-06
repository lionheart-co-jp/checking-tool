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

export default defineComponent({
    name: "App",
    components: { Navbar },
    setup() {
        provide(FormKey, useForm());
        provide(TitleKey, useTitle());
        return {};
    },
});
</script>
