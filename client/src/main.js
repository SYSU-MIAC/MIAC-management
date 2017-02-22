import Vue from 'vue'
import VueResource from 'vue-resource' // http client
import MuseUI from 'muse-ui' // doc: https://museui.github.io
import App from './App'
import Router from './router'

import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'

import 'animate.css'

Vue.use(MuseUI)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  router: Router,
  components: { App }
})
