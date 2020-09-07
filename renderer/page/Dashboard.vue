<template>
    <common-hero
        title="Dashboard"
        subtitle="Checking support tools"
    ></common-hero>

    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <router-link :to="{ name: 'title' }">
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">
                                    Check Title/Meta
                                </p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    Checking Title and Meta informations
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>

                <div class="column">
                    <router-link :to="{ name: 'alt' }">
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">Check Alt</p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    Checking Alt attribute is empty or not
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>

                <div class="column">
                    <router-link :to="{ name: 'headline' }">
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">Check Headline</p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    Checking Headline structure
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>

                <div class="column">
                    <router-link :to="{ name: 'link' }">
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">Check Link</p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    Check Link target function
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "PageDashboard",
});
</script>
