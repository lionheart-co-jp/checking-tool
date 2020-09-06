import { createRouter, createWebHashHistory } from "vue-router";
import DashboardRoute from "./Dashboard";
import TitleRoute from "./Title";

const history = createWebHashHistory();
const routes = [DashboardRoute, TitleRoute];

export default createRouter({ history, routes });
