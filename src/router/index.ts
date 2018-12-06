import Vue from 'vue'
import Router from 'vue-router'

import DashboardRoute from './Dashboard'
import AltRoute from './Alt'
import TitleRoute from './Title'
import HeadlineRoute from './Headline'
import LinkRoute from './Link'

Vue.use(Router)

export default new Router({
    routes: [
        DashboardRoute,
        AltRoute,
        TitleRoute,
        HeadlineRoute,
        LinkRoute,
    ],
    linkActiveClass: 'is-active',
})
