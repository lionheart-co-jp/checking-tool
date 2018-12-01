<template lang="pug">

div
    div.hero.is-primary
        div.hero-body
            div.container
                h1.title Check Title/Meta
                h2.subtitle Check Title and Meta information function

    section.section
        div.container
            div.field.has-addons
                p.control
                    a.button.is-static.is-large URL
                p.control.is-expanded
                    input.input.is-large(
                        type="text"
                        v-model="url"
                        placeholder="http://example.com"
                    )
                p.control
                    button.button.is-info.is-large(
                        @click="startCrawling"
                        :class="{'is-loading': loading}"
                    ) Check

            div.columns
                div.column
                    div.notification.is-warning If you access to Authorised page
                div.column
                    div.field.has-addons
                        p.control
                            a.button.is-static USER
                        p.control.is-expanded
                            input.input(
                                type="text"
                                v-model="user"
                            )
                div.column
                    div.field.has-addons
                        p.control
                            a.button.is-static PASS
                        p.control.is-expanded
                            input.input(
                                type="text"
                                v-model="pass"
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

    div.modal(
        :class="{'is-active': modal_image !== ''}"
    )
        div.modal-background(
            @click="modal_image = ''"
        )
        div.modal-content(
            @click="modal_image = ''"
        )
            p.image
                img(
                    :src="modal_image"
                )
        button.modal-close.is-large(
            aria-label="close"
            @click="modal_image = ''"
        )
</template>

<script lang="ts">
import Vue from 'vue'
import isUrl from 'is-url'

import types from '../store/types'
import BaseImage from '../component/Image.vue'

export default Vue.extend({
    components: {
        BaseImage,
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
        url: {
            get(): string {
                return this.$store.state.App.url
            },
            set(url: string) {
                this.$store.commit(types.mutations.APP_URL, url)
            }
        },
        user: {
            get(): string {
                return this.$store.state.App.user
            },
            set(user: string) {
                this.$store.commit(types.mutations.APP_USER, user)
            }
        },
        pass: {
            get(): string {
                return this.$store.state.App.pass
            },
            set(pass: string) {
                this.$store.commit(types.mutations.APP_PASS, pass)
            }
        },
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

    methods: {
        async startCrawling() {
            if (! isUrl(this.url)) {
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
                res = await (window as any).title_request({url: this.url, user: this.user, pass: this.pass})
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

            this.target_url = this.url

            console.log(res)

            this.response = res.response
            this.loading = false
        },
    },
})
</script>

<style lang="scss" scoped>

.notification.is-warning {
    padding: .5rem 2.5rem .5rem 1.5rem;
}

.modal {

    .modal-content {
        height: calc(100vh - 40px);
    }

    .image {
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
        }
    }
}
</style>
