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
                        :to="{name: 'title'}"
                    )
                        div.card
                            header.card-header
                                p.card-header-title Check Title/Meta
                            div.card-content
                                div.content Checking Title and Meta informations
                div.column
                    router-link(
                        :to="{name: 'alt'}"
                    )
                        div.card
                            header.card-header
                                p.card-header-title Check Alt
                            div.card-content
                                div.content Checking Alt attribute is empty or not
            div.columns
                div.column
                    router-link(
                        :to="{name: 'headline'}"
                    )
                        div.card
                            header.card-header
                                p.card-header-title Check Headline
                            div.card-content
                                div.content Checking Headline structure

                div.column


</template>

<script lang="ts">
import Vue from 'vue'

import types from '../store/types'

export default Vue.extend({
    beforeCreate() {
        this.$store.commit(types.mutations.APP_MODE, 'Dashboard')
    },
})
</script>

