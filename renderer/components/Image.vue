<template>
    <div>
        <template v-if="imgsrc">
            <img
                :src="imgsrc"
                :style="{
                    'max-width': `${maxWidth}px`,
                    'max-height': `${maxHeight}px`,
                }"
                @click.prevent.stop="$emit('click', imgsrc)"
            />
        </template>
        <template v-else>
            <span class="button is-loading is-static is-outlined"></span>
        </template>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";

type Props = {
    src: string;
    maxWidth: number;
    maxHeight: number;
};

export default defineComponent({
    props: {
        src: { type: String, required: true },
        maxWidth: { type: Number, required: true },
        maxHeight: { type: Number, required: true },
    },

    setup(props: Props) {
        const imgsrc = ref<string>("");
        const propSrc = computed(() => props.src);

        const getImage = async (src: string) => {
            imgsrc.value = "";
            if (!src) {
                return;
            }

            try {
                imgsrc.value = await (window as any).util_url_to_base64(src);
            } catch (e) {
                console.error(e);
            }
        };

        onMounted(() => {
            getImage(propSrc.value);
        });
        watch(propSrc, (newVal) => {
            getImage(newVal);
        });

        return { imgsrc };
    },
});
</script>

<style scoped>
img {
    cursor: pointer;
}
</style>
