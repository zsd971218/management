import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


//导入组件
const Login = () => import('views/login/Login');
const Home = () => import('views/home/Home');
const Users = () => import('views/home/child/users/Users.vue');
const Rights = () => import('views/home/child/rights/Rights.vue')
const Roles = () => import('views/home/child/rights/Roles.vue')
const Cate = () => import('views/home/child/goods/Cate.vue')
const Params = () => import('views/home/child/goods/Params.vue')
const GoodsList = () => import('views/home/child/goods/GoodsList.vue')
const AddGoods = () => import('views/home/child/goods/AddGoods.vue')
const Orders = () => import('views/home/child/orders/Orders.vue')
const Reports = () => import('views/home/child/reports/Reports.vue')
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/users',
    children: [{
      path: '/users',
      component: Users
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    },
    {
      path: '/params',
      component: Params
    }, {
      path: '/goods',
      component: GoodsList
    }, {
      path: '/addgoods',
      component: AddGoods
    }, {
      path: '/orders',
      component: Orders
    }, {
      path: '/reports',
      component: Reports
    }
    ],
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes
})
router.beforeEach((to, from, next) => {
  //console.log(to.path);
  if (to.path === '/login') {
    next()
  } else {
    const tokenStr = window.sessionStorage.getItem('token');
    //console.log(!tokenStr);
    if (!tokenStr) {
      next('/login')
      return
    } else {
      next()
    }
  }
})
export default router