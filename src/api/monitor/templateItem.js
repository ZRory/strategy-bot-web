import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'client/plot/template/item/add',
    method: 'post',
    data
  })
}

export function del(id, templateId) {
  const data = {
    id: id,
    templateId: templateId
  }
  return request({
    url: 'client/plot/template/item/delete',
    method: 'post',
    data
  })
}

export function modify(data) {
  return request({
    url: 'client/plot/template/item/modify',
    method: 'post',
    data
  })
}

export function page(params) {
  return request({
    url: 'client/plot/template/item/page',
    method: 'get',
    params
  })
}

