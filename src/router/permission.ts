import router from '@/router/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { useUserStore } from '@/stores/user'
import { Storage } from '@/utils/storage'

const routesWhiteList = ['/login']

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {

  NProgress.start()

  const token = Storage.get('token')

  const store = useUserStore()

  if (token) {
    if (!store.userInfo.token) {
      store.userInfo = Storage.get('userInfo')
    }
    to.path === '/login' ? next({ path: '/' }) : next()
  } else {
    routesWhiteList.includes(to.path) ? next() : next({ path: '/login', replace: true })
  }

})

router.afterEach((to) => {
  NProgress.done()
})