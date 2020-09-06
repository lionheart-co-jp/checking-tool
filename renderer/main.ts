import { createApp } from "vue";
import router from "./router";

// Base Component
import App from "./App.vue";

// Common Component
import CommonHero from "./components/Hero.vue";
import CommonForm from "./components/Form.vue";
import CommonImage from "./components/Image.vue";
import CommonModal from "./components/Modal.vue";

import "./assets/bulma/bulma.min.css";

const app = createApp(App).use(router);
app.component("common-hero", CommonHero);
app.component("common-form", CommonForm);
app.component("common-image", CommonImage);
app.component("common-modal", CommonModal);
app.mount("#app");
