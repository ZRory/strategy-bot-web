import { login, getInfo, logout } from '@/api/login'
import { setUser, getUser, removeUser } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getUser(),
    user: {},
    loadMenus: false
  }
}

// const state = getDefaultState()

const user = {
  state: {
    token: getUser(),
    user: {},
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.phone, userInfo.password, userInfo.graphCode, userInfo.uuid).then(res => {
          setUser(res.data, rememberMe)
          commit('SET_TOKEN', res.token)
          setUserInfo(res.data, commit)
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          console.log('登录失败', error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res.data, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    },

    // remove token
    ResetToken({ commit }) {
      return new Promise(resolve => {
        removeUser() // must remove  token  first
        commit('RESET_STATE')
        resolve()
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }

  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  removeUser()
}

export const setUserInfo = (user, commit) => {
  commit('SET_USER', user)
}

export default user
