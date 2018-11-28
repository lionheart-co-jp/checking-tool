<template lang="pug">
    nav.navbar(
        role="navigation"
        aria-label="main navigation"
    )
        div.navbar-brand
            router-link.navbar-item(
                :to="{name: 'dashboard'}"
                @click="isOpen = false"
            ) Checker Support Tool
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
                    :to="{name: 'dashboard'}"
                    @click="isOpen = false"
                ) Home
                router-link.navbar-item(
                    :to="{name: 'alt'}"
                    @click="isOpen = false"
                ) Alt

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
    }
})
</script>

