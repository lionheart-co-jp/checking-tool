<template lang="pug">

div
    div.hero.is-primary
        div.hero-body
            div.container
                h1.title Check Link
                h2.subtitle Check Link target function

    section.section
        div.container
            base-form(
                :loading="loading"
                @submit="startCrawling"
            )

            template(
                v-if="anchors.length"
            )
                div.notification.is-primary {{ target_url }}

                table.table.is-bordered.is-fullwidth.is-narrow
                    thead
                        tr
                            th
                            th Content
                            th Href
                            th Target
                            th URL
                    tbody
                        link-row(
                            v-for="anchor in anchors"
                            :anchor="anchor"
                        )

</template>

<script lang="ts">
import Vue from 'vue'
import isUrl from 'is-url'

import types from '../store/types'
import BaseForm from '../component/Form.vue'
import LinkRow from '../component/Link/Row.vue'

export default Vue.extend({
    components: {
        BaseForm,
        LinkRow,
    },

    data(): {
        loading: boolean,
    } {
        return {
            loading: false,
        }
    },

    computed: {
        target_url: {
            get(): string {
                return this.$store.state.Link.url
            },
            set(url: string) {
                this.$store.commit(types.mutations.LINK_URL, url)
            },
        },
        anchors: {
            get(): any {
                return this.$store.state.Link.anchors
            },
            set(anchors: any[]) {
                this.$store.commit(types.mutations.LINK_ANCHORS, anchors)
            },
        },
    },

    beforeCreate() {
        this.$store.commit(types.mutations.APP_MODE, 'Headline')
    },

    methods: {
        async startCrawling() {
            const url = this.$store.state.App.url
            const user = this.$store.state.App.user
            const pass = this.$store.state.App.pass

            if (! isUrl(url)) {
                window.alert('Not valid url')
                return
            }

            // Initialize
            this.target_url = ''
            this.anchors = []

            // Start loading
            this.loading = true

            let res
            try {
                res = await (window as any).link_request({url, user, pass})
            } catch(e) {
                window.alert('Failed to access target url')
                console.error(e)
                this.loading = false
                return
            }

            if (res.statusCode >= 300) {
                window.alert('Failed to access target url')
                console.error(res)
                this.loading = false
                return
            }

            this.target_url = url

            console.log(res)

            this.anchors = res.anchors
            this.loading = false
        },
    },
})
</script>

<style lang="scss" scoped>
</style>
