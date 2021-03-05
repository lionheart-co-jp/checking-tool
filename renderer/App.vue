<template>
    <component-header></component-header>

    <component-navbar></component-navbar>

    <div class="main">
        <router-view></router-view>
    </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import ComponentHeader from "./components/Header.vue";
import ComponentNavbar from "./components/Navbar.vue";

// Store
import { provideStore as provideForm } from "./store/form";
import { provideStore as provideTitle } from "./store/title";
import { provideStore as provideAlt } from "./store/alt";
import { provideStore as provideHeadline } from "./store/headline";
import { provideStore as provideLink } from "./store/link";

export default defineComponent({
    name: "App",

    components: { ComponentHeader, ComponentNavbar },

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

<style>
body {
    padding-top: var(--nh);
}
</style>

<style scoped>
.main {
    margin-left: 200px;
}
</style>
