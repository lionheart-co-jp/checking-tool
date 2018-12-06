<template lang="pug">

div
    div.hero.is-primary
        div.hero-body
            div.container
                h1.title Check Title/Meta
                h2.subtitle Check Title and Meta information function

    section.section
        div.container
            base-form(
                :loading="loading"
                @submit="startCrawling"
            )

            template(
                v-if="response"
            )
                div.notification.is-primary {{ target_url }}

                h3.title.is-4 Basic

                table.table.is-bordered.is-fullwidth
                    tbody
                        tr
                            th Title
                            td {{ response.title }}
                        tr
                            th Description
                            td {{ response.description }}
                        tr
                            th Keyword
                            td {{ response.keywords }}
                        tr
                            th Vieport
                            td {{ response.viewport }}

                h3.title.is-4 OGP

                table.table.is-bordered.is-fullwidth
                    tbody
                        tr
                            th og:title
                            td {{ response["og:title"] }}
                        tr
                            th og:type
                            td {{ response["og:type"] }}
                        tr
                            th og:url
                            td {{ response["og:url"] }}
                        tr
                            th og:description
                            td {{ response["og:description"] }}
                        tr
                            th og:site_name
                            td {{ response["og:site_name"] }}
                        tr
                            th og:image
                            td {{ response["og:image"] }}
                                template(
                                    v-if="response['og:image_preview']"
                                )
                                    base-image(
                                        :src="response['og:image_preview']"
                                        @click="modal_image = $event"
                                        :max-width=600
                                        :max-height=400
                                    )

                h3.title.is-4 SNS

                table.table.is-bordered.is-fullwidth
                    tbody
                        tr
                            th fb:app_id
                            td {{ response["fb:app_id"] }}
                        tr
                            th twitter:card
                            td {{ response["twitter:card"] }}
                        tr
                            th twitter:site
                            td {{ response["twitter:site"] }}

    base-modal(
        :modal-image="modal_image"
        @close="modal_image = ''"
    )
</template>

<script lang="ts">
import Vue from 'vue'
import isUrl from 'is-url'

import types from '../store/types'
import BaseForm from '../component/Form.vue'
import BaseImage from '../component/Image.vue'
import BaseModal from '../component/Modal.vue'

export default Vue.extend({
    components: {
        BaseForm,
        BaseImage,
        BaseModal,
    },

    data(): {
        modal_image: string,
        loading: boolean,
    } {
        return {
            modal_image: '',
            loading: false,
        }
    },

    computed: {
        target_url: {
            get(): string {
                return this.$store.state.Title.url
            },
            set(url: string) {
                this.$store.commit(types.mutations.TITLE_URL, url)
            },
        },
        response: {
            get(): any {
                return this.$store.state.Title.response
            },
            set(response: any | null) {
                this.$store.commit(types.mutations.TITLE_RESPONSE, response)
            },
        },
    },

    beforeCreate() {
        this.$store.commit(types.mutations.APP_MODE, 'Title')
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
            this.response = null

            // Start loading
            this.loading = true

            let res
            try {
                res = await (window as any).title_request({url, user, pass})
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

            this.response = res.response
            this.loading = false
        },
    },
})
</script>

<style lang="scss" scoped>

.table {
    th {
        width: 10em;
    }
}

</style>
