import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faBan, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCheckSquare, faBan, faExclamationTriangle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import './assets/bulma/bulma.min.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
