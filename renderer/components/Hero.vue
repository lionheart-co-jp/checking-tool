<template>
    <div class="hero is-primary">
        <div class="hero-body">
            <h1 class="title">{{ title }}</h1>
            <h2 class="subtitle">{{ subtitle }}</h2>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "CommonHero",

    props: {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
    },
});
</script>
