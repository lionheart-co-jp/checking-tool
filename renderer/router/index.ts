import { createRouter, createWebHashHistory } from "vue-router";
import DashboardRoute from "./Dashboard";
import TitleRoute from "./Title";
import AltRoute from "./Alt";
import HeadlineRoute from "./Headline";
import LinkRoute from "./Link";

const history = createWebHashHistory();
const routes = [DashboardRoute, TitleRoute, AltRoute, HeadlineRoute, LinkRoute];

export default createRouter({
    history,
    routes,
    linkActiveClass: "is-active",
    linkExactActiveClass: "is-active",
});
