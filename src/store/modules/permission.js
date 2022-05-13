import { constantRouterMap } from '@/router/routers'

const state = {
  state: {
    routers: constantRouterMap,
    sidebarRouters: constantRouterMap
  }
  // mutations: {
  //   SET_ROUTERS: (state, routers) => {
  //     state.routers = constantRouterMap.concat(routers)
  //   },
  //   SET_SIDEBAR_ROUTERS: (state, routers) => {
  //     state.sidebarRouters = constantRouterMap.concat(routers)
  //   }
  // }
  // actions: {
  //   GenerateRoutes({ commit }, asyncRouter) {
  //     commit('SET_ROUTERS', asyncRouter)
  //   },
  //   SetSidebarRouters({ commit }, sidebarRouter) {
  //     commit('SET_SIDEBAR_ROUTERS', sidebarRouter)
  //   }
  // }
}

export default state
