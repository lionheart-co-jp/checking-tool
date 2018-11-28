import Vue from 'vue'
import Router from 'vue-router'

import DashboardRoute from './Dashboard'
import AltRoute from './Alt'

Vue.use(Router)

export default new Router({
    routes: [
        DashboardRoute,
        AltRoute,
    ],
})
