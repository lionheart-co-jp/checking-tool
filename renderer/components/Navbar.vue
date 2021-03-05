<template>
    <aside class="menu">
        <ul class="menu-list">
            <li>
                <router-link :to="{ name: 'title' }" @click="isOpen = false">{{
                    t("title.title")
                }}</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'alt' }" @click="isOpen = false">{{
                    t("alt.title")
                }}</router-link>
            </li>
            <li>
                <router-link
                    :to="{ name: 'headline' }"
                    @click="isOpen = false"
                    >{{ t("headline.title") }}</router-link
                >
            </li>
            <li>
                <router-link :to="{ name: 'link' }" @click="isOpen = false">{{
                    t("link.title")
                }}</router-link>
            </li>
        </ul>
    </aside>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
    name: "Navbar",

    setup() {
        const isOpen = ref<boolean>(false);

        const screenShotHandler = () => {
            (window as any).screen_shot();
        };

        return { isOpen, screenShotHandler, ...useI18n() };
    },
});
</script>

<style scoped>
.menu {
    position: fixed;
    left: 0;
    top: var(--nh);
    bottom: 0;
    width: 200px;
    background: rgb(0, 209, 178);
}
.menu a {
    color: #fff;
    padding: 0.75em 0.75em;
    border-radius: 0;
}
.menu a:hover {
    color: #fff;
    background: rgb(0, 184, 156);
}
.menu a.is-active {
    color: #fff;
    background: rgb(0, 184, 156);
}
</style>
