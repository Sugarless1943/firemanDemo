import Vue from 'vue'
import Router from 'vue-router'
import fireman from '@/components/fireman'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'fireman',
      component: fireman
    }
  ]
})
