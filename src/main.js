import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import { apolloProvider } from './graphql/client'
import globalAlert from './mixins/globalAlert'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Vuex)
Vue.mixin(globalAlert)

new Vue({
  store,
  router,
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app')
