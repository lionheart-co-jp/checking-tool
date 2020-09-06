<template>
    <nav
        class="navbar is-primary is-fixed-top"
        role="navigation"
        aria-label="main navigation"
    >
        <div class="navbar-brand">
            <router-link class="navbar-item" :to="{ name: 'dashboard' }">
                <strong>Checket Support Tool</strong>
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
                    >Title/Meta</router-link
                >
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <button
                            class="button is-info"
                            @click="screenShotHandler"
                        >
                            Capture
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    setup() {
        const isOpen = ref<boolean>(false);
        const screenShotHandler = () => {
            (window as any).screen_shot();
        };

        return { isOpen, screenShotHandler };
    },
});
</script>
