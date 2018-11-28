<template lang="pug">
div
    navbar

    router-view

</template>

<script lang="ts">
import Vue from 'vue'

import Navbar from './component/Navbar.vue'

export default Vue.extend({
    components: {
        Navbar,
    }
})
</script>

<style lang="scss" scoped>
main {
    padding: 20px;
}
</style>
