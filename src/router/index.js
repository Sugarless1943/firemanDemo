import Vue from 'vue'
import Router from 'vue-router'
import fireman from '@/components/智能司炉'

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
