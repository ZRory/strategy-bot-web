import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'client/machine/plot/config/add',
    method: 'post',
    data
  })
}

export function del(id) {
  const params = {
    id: id
  }
  return request({
    url: 'client/machine/plot/config/delete',
    method: 'post',
    data: params
  })
}

export function modify(data) {
  return request({
    url: 'client/machine/plot/config/modify',
    method: 'post',
    data
  })
}

export function delAll(clientId) {
  const data = {
    clientId: clientId
  }
  return request({
    url: '/client/machine/plot/config/deleteAll',
    method: 'post',
    data
  })
}

export function startBatch(ids, clientId, minutes) {
  const data = {
    ids: ids,
    clientId: clientId,
    minutes: minutes
  }
  return request({
    url: '/client/draw/startBatch',
    method: 'post',
    data
  })
}

export function stopBatch(ids, clientId) {
  const data = {
    ids: ids,
    clientId: clientId
  }
  return request({
    url: '/client/draw/stopBatch',
    method: 'post',
    data
  })
}

export function queryLog(id) {
  const params = {
    id
  }
  return request({
    url: '/client/draw/log',
    method: 'get',
    params
  })
}

export default { add, del, modify, delAll, startBatch, stopBatch, queryLog }
