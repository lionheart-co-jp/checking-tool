<template lang="pug">
    div
        template(
            v-if="imgsrc !== ''"
        )
            img(
                :src="imgsrc"
                :style="{'max-width': $props.maxWidth + 'px', 'max-height': $props.maxHeight + 'px'}"
                @click="$emit('click', imgsrc)"
            )
        template(
            v-else
        )
            span.button.is-loading.is-static.is-outlined
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        src: String,
        maxWidth: Number,
        maxHeight: Number,
    },

    data(): {
        imgsrc: string,
    } {
        return {
            imgsrc: ''
        }
    },

    created () {
        this.getImage()
    },

    watch: {
        src() {
            this.getImage()
        }
    },

    methods: {
        async getImage() {
            if (! this.$props.src) {
                this.imgsrc = ''
                return
            }
            try {
                this.imgsrc = await (window as any).util_url_to_base64(this.$props.src)
            } catch(e) {
                console.error(e)
            }
        }
    }
})
</script>

<style lang="scss" scoped>
img {
    cursor: pointer;
}
</style>
