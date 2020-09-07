import { createApp } from "vue";
import router from "./router";

// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faBan,
    faExclamationTriangle,
    faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
library.add(faBan, faExclamationTriangle, faCheckSquare);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Base Component
import App from "./App.vue";

// Common Component
import CommonHero from "./components/Hero.vue";
import CommonForm from "./components/Form.vue";
import CommonImage from "./components/Image.vue";
import CommonModal from "./components/Modal.vue";

import "./assets/bulma/bulma.min.css";

const app = createApp(App).use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("common-hero", CommonHero);
app.component("common-form", CommonForm);
app.component("common-image", CommonImage);
app.component("common-modal", CommonModal);
app.mount("#app");
