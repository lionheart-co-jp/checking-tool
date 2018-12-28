<template lang="pug">
    tr(
        :class="{'is-danger': isError > 0, 'is-success': isError < 0}"
    )
        td.status
            template(
                v-if="isError === 0"
            )
                span.button.is-loading.is-static.is-outlined
            template(
                v-else
            )
                span.icon(
                    :class="{'has-text-danger': isError > 0, 'has-text-success': isError < 0}"
                )
                    font-awesome-icon(
                        :icon="isError > 0 ? 'ban' : 'check-square'"
                    )
        th {{ anchor.label }}
        td.break-all {{ anchor.href }}
        td {{ anchor.target }}
        td.break-all
            a(
                :href="anchor.url"
                target="_blank"
            ) {{ anchor.url }}
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        anchor: Object,
    },

    data(): {
        isError: number
    } {
        return {
            isError: 0
        }
    },

    mounted() {
        if (
            this.$props.anchor &&
            this.$props.anchor.hasOwnProperty('url')
        ) {
            this.checkUrl(
                this.$props.anchor.url,
                this.$props.anchor.user,
                this.$props.anchor.pass
            )
        }
    },

    watch: {
        anchor(val: any) {
            if (
                val &&
                val.hasOwnProperty('url')
            ) {
                this.checkUrl(val.url, val.user, val.pass)
            }
        }
    },

    methods: {
        async checkUrl(url: string, user: string, pass: string) {
            let res

            if (
                url.match('^javascript:') ||
                url.match('^tel:')
            ) {
                this.isError = -1
                return
            }

            try {
                res = await (window as any).link_exists({url, user, pass})
            } catch(e) {
                console.error(e)
                this.isError = 1
                return
            }

            if (res.statusCode >= 300) {
                console.error(res)
                this.isError = 1
                return
            }

            this.isError = -1
        }
    }
})
</script>

<style lang="scss" scoped>
.break-all {
    word-break: break-all;
}

table.table {
    .is-danger {
        background: lighten(hsl(348, 100%, 61%), 30%);
    }
    .is-success {
        background: lighten(hsl(141, 71%, 48%), 50%);
    }
}

</style>