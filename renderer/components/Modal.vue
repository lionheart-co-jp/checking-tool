<template>
    <div class="modal" :class="{ 'is-active': modalImage !== '' }">
        <div class="modal-background" @click="$emit('close')"></div>
        <div class="modal-content" @click="$emit('close')">
            <p class="image"><img :src="modalImage" /></p>
        </div>
        <button
            class="modal-close is-large"
            aria-label="close"
            @click="$emit('close')"
        ></button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        modalImage: { type: String, default: "" },
    },
});
</script>

<style scoped>
.modal .modal-content {
    height: calc(100vh - 40px);
}

.modal .image {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal .image img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
}
</style>
