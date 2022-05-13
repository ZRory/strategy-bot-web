import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    meta: {title: '登录', noCache: true},
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: (resolve) => require(['@/views/machineManage/machines/index'], resolve),
  //       name: 'Dashboard'
  //       // meta: { title: '首页', icon: 'index', affix: true, noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    hidden: false,
    // icon: 'monitor',
    // title: '矿机管理',
    meta: {
      title: '策略管理',
      icon: 'monitor'
    },
    redirect: 'strategy',
    children: [
      {
        path: 'strategy',
        component: (resolve) => require(['@/views/machineManage/machines/index'], resolve),
        name: '策略列表',
        meta: {title: '策略列表', icon: 'tree'}
      },
      {
        path: 'create',
        component: (resolve) => require(['@/views/machineManage/machines/create'], resolve),
        name: '创建策略',
        meta: {title: '创建策略', icon: 'tools'}
      }, {
        path: 'share',
        component: (resolve) => require(['@/views/machineManage/machines/share'], resolve),
        name: '策略广场',
        meta: {title: '策略广场', icon: 'develop'}
      },
      {
        path: '/strategy/detail',
        component: (resolve) => require(['@/views/machineManage/machines/detail/'], resolve),
        props: route => ({query: route.query.clientId}),
        name: '策略详情',
        meta: {title: '策略详情'},
        hidden: true
      }
    ]
  },
  {
    path: '/backTest',
    component: Layout,
    hidden: false,
    meta: {
      title: '回测管理',
      icon: 'timing'
    },
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: (resolve) => require(['@/views/backTest/index'], resolve),
        name: '回测列表',
        meta: {title: '回测列表', icon: 'database'}
      },
      {
        path: 'create',
        component: (resolve) => require(['@/views/backTest/create'], resolve),
        name: '创建回测',
        meta: {title: '创建回测', icon: 'tools'}
      }, {
        path: '/backTest/detail',
        component: (resolve) => require(['@/views/backTest/detail/'], resolve),
        props: route => ({query: route.query.backTestId}),
        name: '回测详情',
        meta: {title: '回测详情'},
        hidden: true
      }
    ]
  },
  {
    path: '/infoCenter',
    component: Layout,
    hidden: false,
    meta: {
      title: '信息中心',
      icon: 'international'
    },
    alwaysShow: true,
    children: [
      {
        path: 'help',
        component: (resolve) => require(['@/views/machineManage/machines/help'], resolve),
        name: '使用帮助',
        meta: {title: '使用帮助', icon: 'swagger'}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: {title: '个人中心'}
      }
    ]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
