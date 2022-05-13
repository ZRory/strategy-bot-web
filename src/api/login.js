import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function register(phone, password, authCode) {
  return request({
    url: 'user/register',
    method: 'post',
    data: {
      phone,
      password,
      authCode
    }
  })
}

export function login(phone, password, graphCode, uuid) {
  return request({
    url: 'user/login',
    method: 'post',
    data: {
      phone,
      password,
      graphCode,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: 'user/userInfo',
    method: 'post'
  })
}

export function getCodeImg() {
  return request({
    url: 'user/getGraphCode',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: 'user/logout',
    method: 'post'
  })
}

export function getSmsCode(phone, graphCode, uuid) {
  return request({
    url: 'user/getSmsCode',
    method: 'post',
    data: {
      phone,
      graphCode,
      uuid
    }
  })
}

export function modifyPassword(user) {
  const data = {
    phone: user.phone,
    oldPassword: encrypt(user.oldPassword),
    password: encrypt(user.password)
  }
  return request({
    url: 'user/modifyPassword',
    method: 'post',
    data
  })
}

export function findPassword(phone, password, authCode) {
  return request({
    url: 'user/findPassword',
    method: 'post',
    data: {
      phone,
      password,
      authCode
    }
  })
}

export function editUser(data) {
  return request({
    url: 'user/edit',
    method: 'post',
    data
  })
}
