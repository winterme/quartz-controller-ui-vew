import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ElementUi from 'element-ui'
import '@/theme-et/index.css'
import axios from "axios";
Vue.prototype.$axios = axios
Vue.use(ElementUi)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorldCopy',
      component: HelloWorld
    }
  ]
})
