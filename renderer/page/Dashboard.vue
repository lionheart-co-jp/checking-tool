<template>
    <common-hero
        :title="t('dashboard.title')"
        :subtitle="t('dashboard.subtitle')"
    ></common-hero>

    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <router-link :to="{ name: 'title' }">
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">
                                    {{ t("title.title") }}
                                </p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    {{ t("title.subtitle") }}
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>

                <div class="column">
                    <router-link :to="{ name: 'alt' }">
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">
                                    {{ t("alt.title") }}
                                </p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    {{ t("alt.subtitle") }}
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>

                <div class="column">
                    <router-link :to="{ name: 'headline' }">
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">
                                    {{ t("headline.title") }}
                                </p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    {{ t("headline.subtitle") }}
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>

                <!-- <div class="column">
                    <router-link :to="{ name: 'link' }">
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">
                                    {{ t("link.title") }}
                                </p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    {{ t("link.subtitle") }}
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div> -->
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
    name: "PageDashboard",
    setup() {
        return useI18n();
    },
});
</script>
