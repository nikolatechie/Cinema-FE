import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import MainNavbar from './components/MainNavbar'
import LoginRegNavbar from "./components/LoginRegNavbar";
import router from './router'
import store from './store'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// Register components
Vue.component('MainNavbar', MainNavbar)
Vue.component('LoginRegNavbar', LoginRegNavbar)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')