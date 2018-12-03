<template lang="pug">

div
    div.hero.is-primary
        div.hero-body
            div.container
                h1.title Check Alt
                h2.subtitle Check Alt attribute function

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

            div.notification
                ul
                    li
                        span.icon.has-text-danger
                            font-awesome-icon(
                                icon="ban"
                            )
                        | Alt attribute is missing. <span class="has-text-danger">you must add alt attribute</span> even if it's empty
                    li
                        span.icon.has-text-warning
                            font-awesome-icon(
                                icon="exclamation-triangle"
                            )
                        | Alt attribute is empty. If this image is included text, please insert to alt attribute.
                    li
                        span.icon.has-text-success
                            font-awesome-icon(
                                icon="check-square"
                            )
                        | Alt attribute is filled. But, please check the alt attribute value is correct or not.

            template(
                v-if="images.length"
            )
                div.notification.is-primary {{ target_url }}

                table.table.is-bordered.is-fullwidth.is-narrow
                    thead
                        tr
                            th
                            th view
                            th src
                            td alt
                    tbody
                        tr(
                            v-for="img in images"
                            :class="{'is-danger': img.flag < 0, 'is-warning': img.flag === 0, 'is-success': img.flag > 0}"
                        )
                            td.has-text-centered
                                span.icon(
                                    :class="{'has-text-danger': img.flag < 0, 'has-text-warning': img.flag === 0, 'has-text-success': img.flag > 0}"
                                )
                                    font-awesome-icon(
                                        :icon="img.flag < 0 ? 'ban' : img.flag === 0 ? 'exclamation-triangle' : 'check-square'"
                                    )
                            th.has-text-centered
                                base-image(
                                    :src="img.url"
                                    @click="modal_image = $event"
                                    :max-width=200
                                    :max-height=200
                                )
                            td {{ img.src }}
                            td {{ img.alt }}

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
            },
        },
        user: {
            get(): string {
                return this.$store.state.App.user
            },
            set(user: string) {
                this.$store.commit(types.mutations.APP_USER, user)
            },
        },
        pass: {
            get(): string {
                return this.$store.state.App.pass
            },
            set(pass: string) {
                this.$store.commit(types.mutations.APP_PASS, pass)
            },
        },
        target_url: {
            get(): string {
                return this.$store.state.Alt.url
            },
            set(url: string) {
                this.$store.commit(types.mutations.ALT_URL, url)
            },
        },
        images: {
            get(): any[] {
                return this.$store.state.Alt.images
            },
            set(images: any[]) {
                this.$store.commit(types.mutations.ALT_IMAGES, images)
            },
        },
    },

    beforeCreate() {
        this.$store.commit(types.mutations.APP_MODE, 'Alt')
    },

    methods: {
        async startCrawling() {
            if (! isUrl(this.url)) {
                window.alert('Not valid url')
                return
            }

            // Initialize image list
            this.target_url = ''
            this.images = []

            // Start loading
            this.loading = true

            let res
            try {
                res = await (window as any).alt_request({url: this.url, user: this.user, pass: this.pass})
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
            res.images.forEach((v: any, i: number) => {
                let flag: number = 0
                if (! v.flag) {
                    flag = -1
                } else {
                    if (v.alt !== '') {
                        flag = 1
                    }
                }

                this.images.push({
                    url: v.url,
                    src: v.src,
                    alt: v.alt,
                    flag,
                })
            })

            this.loading = false
        },
    },
})
</script>

<style lang="scss" scoped>

.notification.is-warning {
    padding: .5rem 2.5rem .5rem 1.5rem;
}

table.table {
    .is-danger {
        background: lighten(hsl(348, 100%, 61%), 30%);
    }
    .is-warning {
        background: lighten(hsl(48, 100%, 67%), 30%);
    }
    .is-success {
        background: lighten(hsl(141, 71%, 48%), 50%);
    }
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
