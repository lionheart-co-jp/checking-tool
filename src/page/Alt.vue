<template lang="pug">

div
    div.hero.is-primary
        div.hero-body
            div.container
                h1.title Check Alt
                h2.subtitle Check Alt attribute function

    section.section
        div.container
            base-form(
                :loading="loading"
                @submit="startCrawling"
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
            const url = this.$store.state.App.url
            const user = this.$store.state.App.user
            const pass = this.$store.state.App.pass

            if (! isUrl(url)) {
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
                res = await (window as any).alt_request({url, user, pass})
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

</style>
