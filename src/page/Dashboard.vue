<template lang="pug">

div
    div.hero.is-primary
        div.hero-body
            div.container
                h1.title Dashboard
                h2.subtitle Checking support tools

    section.section
        div.container
            div.columns
                div.column
                    router-link(
                        :to="{name: 'alt'}"
                    )
                        div.card
                            header.card-header
                                p.card-header-title Check Alt
                            div.card-content
                                div.content Checking Alt attribute is empty or not



</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
})
</script>

