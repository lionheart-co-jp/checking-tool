<template lang="pug">
    nav.navbar.is-primary.is-fixed-top(
        role="navigation"
        aria-label="main navigation"
    )
        div.navbar-brand
            router-link.navbar-item(
                :to="{name: 'dashboard'}"
                @click="isOpen = false"
                active-class=""
            )
                strong Checker Support Tool
            a.navbar-burger.burger(
                role="button"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                :class="{'is-active': isOpen}"
                @click="isOpen = !isOpen"
            )
                span(aria-hidden="true")
                span(aria-hidden="true")
                span(aria-hidden="true")

        #navbarBasicExample.navbar-menu(
            :class="{'is-active': isOpen}"
        )
            .navbar-start
                router-link.navbar-item(
                    :to="{name: 'title'}"
                    @click="isOpen = false"
                ) Title/Meta
                router-link.navbar-item(
                    :to="{name: 'alt'}"
                    @click="isOpen = false"
                ) Alt
                router-link.navbar-item(
                    :to="{name: 'headline'}"
                    @click="isOpen = false"
                ) Headline
            .navbar-end
                div.navbar-item
                    div.buttons
                        button.button.is-info(
                            @click="capturePage"
                        ) Capture

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data(): {
        isOpen: boolean
    } {
        return {
            isOpen: false
        }
    },

    methods: {
        async capturePage() {
            const captured = await (window as any).util_screen_shot()
            const mode = this.$store.state.App.mode

            const a = document.createElement('a')
            a.href = 'data:image/jpeg;base64,' + captured
            a.download = mode + '-captured'

            a.click()
        }
    }
})
</script>

