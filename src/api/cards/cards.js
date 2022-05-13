import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/client/card/getEquityCardPage',
    method: 'get',
    params: params
  })
}

export function exchange(params) {
  return request({
    url: 'client/card/generateEquityCard',
    method: 'post',
    data: params
  })
}

export function search(params) {
  return request({
    url: 'client/card/search',
    method: 'post',
    data: params
  })
}

export function getTestCard(params) {
  return request({
    url: 'client/card/getTestCard',
    method: 'get',
    params
  })
}

export default { list, exchange, search, getTestCard }
