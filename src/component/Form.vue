<template lang="pug">
div
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
                @click="$emit('submit')"
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
</template>

<script lang="ts">
import Vue from 'vue'

import types from '../store/types'

export default Vue.extend({
    props: {
        loading: Boolean,
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
    },
})
</script>


<style lang="scss" scoped>

.notification.is-warning {
    padding: .35rem 2.5rem .35rem 1.5rem;
}

.columns:last-child {
    margin-bottom: 0;
}

</style>
