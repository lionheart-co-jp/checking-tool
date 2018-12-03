<template lang="pug">

div
    div.hero.is-primary
        div.hero-body
            div.container
                h1.title Check Headline
                h2.subtitle Check Headline structure function

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

            div.notification.is-info
                ul
                    li Don't skip headline level (e.g. &lt;h1&gt; -> &lt;h3&gt; is No Good)
                    li &lt;h1&gt; tag must be only one in the page

            template(
                v-if="headlines.length"
            )
                div.notification.is-primary {{ target_url }}

                ul.headline-list
                    li(
                        :class="'level-' + head.level"
                        v-for="head in headlines"
                    )
                        template(
                            v-if="! head.flag"
                        )
                            span.tag.is-danger {{ head.message }}
                        div
                            span.icon(
                                :class="{'has-text-danger': ! head.flag, 'has-text-success': head.flag}"
                            )
                                font-awesome-icon(
                                    :icon="head.flag ? 'check-square' : 'ban'"
                                )
                            span.list-level {{ head.level + '.' }}
                            span.list-label {{ head.label }}

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
        headlines: {
            get(): any {
                return this.$store.state.Headline.list
            },
            set(headlines: any[]) {
                this.$store.commit(types.mutations.HEADLINE_LIST, headlines)
            },
        },
    },

    beforeCreate() {
        this.$store.commit(types.mutations.APP_MODE, 'Headline')
    },

    methods: {
        async startCrawling() {
            if (! isUrl(this.url)) {
                window.alert('Not valid url')
                return
            }

            // Initialize
            this.target_url = ''
            this.headlines = []

            // Start loading
            this.loading = true

            let res
            try {
                res = await (window as any).headline_request({url: this.url, user: this.user, pass: this.pass})
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

            this.headlines = res.headlines
            this.loading = false
        },
    },
})
</script>

<style lang="scss" scoped>

.notification.is-warning {
    padding: .5rem 2.5rem .5rem 1.5rem;
}

.notification.is-info {
    ul {
        li {
            list-style: disc;
            margin-left: 1.6em;
        }
    }
}

.headline-list {
    li {
        & ~ li {
            margin-top: .5rem;
        }

        &.level-1 {
        }
        &.level-2 {
            margin-left: 2em;
        }
        &.level-3 {
            margin-left: 4em;
        }
        &.level-4 {
            margin-left: 6em;
        }
        &.level-5 {
            margin-left: 8em;
        }
        &.level-6 {
            margin-left: 10em;
        }

        div {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
        }

        .list-level {
            text-align: center;
            width: 1.5em;
            flex-shrink: 0;
        }
        .list-label {
            font-weight: bold;
        }
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
