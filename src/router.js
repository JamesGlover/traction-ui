import Vue from 'vue'
import Router from 'vue-router'
import Reception from './views/Reception'
import Samples from './views/Samples'
import Libraries from './views/Libraries'
import Runs from './views/Runs'
import ScanBarcodes from './views/ScanBarcodes'
import Run from '@/views/Run'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'Samples' },
      component: Samples
    },
    {
      path: '/reception',
      name: 'Reception',
      component: Reception
    },
    {
      path: '/samples',
      name: 'Samples',
      component: Samples
    },
    {
      path: '/libraries',
      name: 'Libraries',
      component: Libraries
    },
    {
      path: '/runs',
      name: 'Runs',
      component: Runs
    },
    {
      path: '/scanbarcodes',
      name: 'ScanBarcodes',
      component: ScanBarcodes
    },
    {
      path: '/run',
      name: 'Run',
      component: Run,
      props: true
    }
  ]
})
