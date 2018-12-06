<template lang="pug">
div.modal(
    :class="{'is-active': modalImage !== ''}"
)
    div.modal-background(
        @click="$emit('close')"
    )
    div.modal-content(
        @click="$emit('close')"
    )
        p.image
            img(
                :src="modalImage"
            )
    button.modal-close.is-large(
        aria-label="close"
        @click="$emit('close')"
    )
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

    props: {
        modalImage: String
    },

})
</script>

<style lang="scss" scoped>
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