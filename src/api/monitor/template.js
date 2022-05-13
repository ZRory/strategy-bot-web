import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'client/plot/template/add',
    method: 'post',
    data
  })
}

export function del(id) {
  const data = {
    id: id
  }
  return request({
    url: 'client/plot/template/delete',
    method: 'post',
    data
  })
}

export function modify(data) {
  return request({
    url: 'client/plot/template/modify',
    method: 'post',
    data
  })
}

export function page(params) {
  return request({
    url: 'client/plot/template/page',
    method: 'post',
    params
  })
}

export function listTemplate() {
  return request({
    url: 'client/plot/template/list',
    method: 'post'
  })
}

export function uploadTemplate(clientId) {
  const data = {
    clientId: clientId
  }
  return request({
    url: 'client/plot/template/upload',
    method: 'post',
    data
  })
}

