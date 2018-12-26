import Vue from 'vue'
import Router from 'vue-router'
import fireman from '@/components/fireman'
import firemanTest from '@/components/firemanTest'
import firemanExpand from '@/components/firemanExpand'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'fireman',
      component: fireman
    },
    {
      path: '/firemanTest',
      name: 'firemanTest',
      component: firemanTest
    },
    {
      path: '/firemanExpand',
      name: 'firemanExpand',
      component: firemanExpand
    }
  ]
})
