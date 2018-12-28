<template lang="pug">

div
    div.hero.is-primary
        div.hero-body
            div.container
                h1.title Check Headline
                h2.subtitle Check Headline structure function

    section.section
        div.container
            base-form(
                :loading="loading"
                @submit="startCrawling"
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
</template>

<script lang="ts">
import Vue from 'vue'
import isUrl from 'is-url'

import types from '../store/types'
import BaseForm from '../component/Form.vue'
import BaseModal from '../component/Modal.vue'

export default Vue.extend({
    components: {
        BaseForm,
        BaseModal,
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
                return this.$store.state.Headline.url
            },
            set(url: string) {
                this.$store.commit(types.mutations.HEADLINE_URL, url)
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
            const url = this.$store.state.App.url
            const user = this.$store.state.App.user
            const pass = this.$store.state.App.pass

            if (! isUrl(url)) {
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
                res = await (window as any).headline_request({url, user, pass})
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

            this.headlines = res.headlines
            this.loading = false
        },
    },
})
</script>

<style lang="scss" scoped>

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

        .icon {
            flex-shrink: 0;
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

</style>
