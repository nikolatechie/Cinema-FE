import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

Vue.use(VueRouter)

const routes = [
  {
      path: '/login',
      component: Login
  },
  {
      path: '/register',
      component: Register
  },
  {
      path: '/',
      component: Home
  },
  {
      path: '/settings',
      component: () => import('../components/AccountSettings'),
      meta: {
          requiresAuth: true
      }
  },
  {
      path: '/visits',
      component: () => import('../components/Visits'),
      meta: {
          requiresAuth: true
      }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem("token") == null)
          next({ path: '/login' });
      else next();
  }
  else next();
})

export default router