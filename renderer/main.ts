import { createApp } from "vue";
import router from "./router";

// Bulma
import "bulma/css/bulma.css";

// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faBan,
    faExclamationTriangle,
    faCheckSquare,
    faAngleDown,
    faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
library.add(
    faBan,
    faExclamationTriangle,
    faCheckSquare,
    faAngleDown,
    faAngleUp
);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Vue i18n
const availableLocale = ["en", "ja"];
const locale = (() => {
    const electronLocale = (() => {
        if (typeof (window as any).get_locale === "function") {
            return (window as any).get_locale() as string;
        } else {
            return "en";
        }
    })();

    if (availableLocale.some((l) => l === electronLocale)) {
        return electronLocale;
    } else {
        return "en";
    }
})();
import { createI18n } from "vue-i18n";
import messages from "./messages";
const i18n = createI18n({
    locale,
    fallbackLocale: "en",
    messages,
});

// Base Component
import App from "./App.vue";

// Common Component
import CommonHero from "./components/Hero.vue";
import CommonForm from "./components/Form.vue";
import CommonImage from "./components/Image.vue";
import CommonModal from "./components/Modal.vue";

const app = createApp(App).use(router).use(i18n);
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("common-hero", CommonHero);
app.component("common-form", CommonForm);
app.component("common-image", CommonImage);
app.component("common-modal", CommonModal);
app.mount("#app");
