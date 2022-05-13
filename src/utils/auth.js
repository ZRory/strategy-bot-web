import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey
const UserKey = Config.UserKey

export function getUser() {
  return Cookies.get(UserKey)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(TokenKey, token)
}

export function setUser(user, rememberMe) {
  if (rememberMe) {
    return Cookies.set(UserKey, user, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(UserKey, user)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeUser() {
  return Cookies.remove(UserKey)
}
