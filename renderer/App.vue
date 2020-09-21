<template>
    <navbar></navbar>

    <router-view></router-view>
</template>

<script>
import { defineComponent } from "vue";

// Components
import Navbar from "./components/Navbar.vue";

// Store
import { provideStore as provideForm } from "./store/form";
import { provideStore as provideTitle } from "./store/title";
import { provideStore as provideAlt } from "./store/alt";
import { provideStore as provideHeadline } from "./store/headline";
import { provideStore as provideLink } from "./store/link";

export default defineComponent({
    name: "App",

    components: { Navbar },

    setup() {
        provideForm();
        provideTitle();
        provideAlt();
        provideHeadline();
        provideLink();

        return {};
    },
});
</script>
