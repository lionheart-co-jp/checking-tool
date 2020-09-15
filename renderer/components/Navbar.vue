<template>
    <nav
        class="navbar is-primary is-fixed-top"
        role="navigation"
        aria-label="main navigation"
    >
        <div class="navbar-brand">
            <router-link class="navbar-item" :to="{ name: 'dashboard' }">
                <strong>Checker Support Tool</strong>
            </router-link>
            <a
                class="navbar-burger burger"
                role="button"
                aria-label="menu"
                aria-expanded="false"
                data-target="mainNavBar"
                :class="{ 'is-active': isOpen }"
                @click="isOpen = !isOpen"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div
            id="mainNavBar"
            class="navbar-menu"
            :class="{ 'is-active': isOpen }"
        >
            <div class="navbar-start">
                <router-link
                    class="navbar-item"
                    :to="{ name: 'title' }"
                    @click="isOpen = false"
                    >{{ t("title.title") }}</router-link
                >
                <router-link
                    class="navbar-item"
                    :to="{ name: 'alt' }"
                    @click="isOpen = false"
                    >{{ t("alt.title") }}</router-link
                >
                <router-link
                    class="navbar-item"
                    :to="{ name: 'headline' }"
                    @click="isOpen = false"
                    >{{ t("headline.title") }}</router-link
                >
                <!-- <router-link
                    class="navbar-item"
                    :to="{ name: 'link' }"
                    @click="isOpen = false"
                    >{{ t("link.title") }}</router-link
                > -->
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="select is-primary">
                        <select v-model="locale">
                            <option value="en">English</option>
                            <option value="ja">Japanese</option>
                        </select>
                    </div>
                </div>
                <!-- <div class="navbar-item">
                    <div class="buttons">
                        <button
                            class="button is-info"
                            @click="screenShotHandler"
                        >
                            Capture
                        </button>
                    </div>
                </div> -->
            </div>
        </div>
    </nav>
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
