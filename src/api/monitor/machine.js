import request from '@/utils/request'

export function binding(data) {
  return request({
    url: 'user/updateAPI',
    method: 'post',
    data
  })
}

export function closePosition(positionId) {
  const params = {
    positionId: positionId
  }
  return request({
    url: 'strategy/closePosition',
    method: 'post',
    data: params
  })
}

export function bindEquityCardAuto() {
  return request({
    url: 'client/machine/bindEquityCardAuto',
    method: 'post'
  })
}

export function bindEquityCard(data) {
  return request({
    url: 'strategy/status',
    method: 'post',
    data
  })
}

export function list(params) {
  return request({
    url: 'strategy/list',
    method: 'get',
    params: params
  })
}

export function listBackTest(params) {
  return request({
    url: 'backTest/list',
    method: 'get',
    params: params
  })
}

export function listDiskInfo(clientId) {
  const params = {
    clientId: clientId
  }
  return request({
    url: 'client/machine/listDiskInfo',
    method: 'get',
    params
  })
}

export function listSymbols() {
  return request({
    url: 'strategy/symbols',
    method: 'get'
  })
}

export function listBackTestSymbols() {
  return request({
    url: 'backTest/symbols',
    method: 'get'
  })
}

export function monitor(clientId) {
  const params = {
    clientId: clientId
  }
  return request({
    url: 'client/machine/monitor',
    method: 'get',
    params
  })
}

export function createStrategy(data) {
  return request({
    url: 'strategy/create',
    method: 'post',
    data
  })
}

export function createBackTest(data) {
  return request({
    url: 'backTest/create',
    method: 'post',
    data
  })
}

export function listPlotsConfig(clientId) {
  const params = {
    clientId: clientId
  }
  return request({
    url: 'client/machine/plot/config/list',
    method: 'get',
    params
  })
}

export function generateConfigByTemplate(templateForm) {
  return request({
    url: 'client/machine/plot/config/generateConfigByTemplate',
    method: 'post',
    data: templateForm
  })
}

export function listPlotsHistory(params) {
  return request({
    url: 'strategy/positions',
    method: 'get',
    params
  })
}

export function listBackTestResult(params) {
  return request({
    url: 'backTest/detail',
    method: 'get',
    params
  })
}

export function checkEquity(clientId) {
  const params = {
    clientId: clientId
  }
  return request({
    url: 'client/machine/checkEquity',
    method: 'get',
    params
  })
}

export function updateRemark(data) {
  return request({
    url: 'strategy/update',
    method: 'post',
    data
  })
}

export function queryProfit(strategyId) {
  const params = {
    strategyId: strategyId
  }
  return request({
    url: 'strategy/profit',
    method: 'get',
    params
  })
}

export function balance() {
  return request({
    url: 'strategy/account',
    method: 'get'
  })
}
