import request from '@/utils/request'

// 查询可显示的滑翔器
export function getDeviceAll(data) {
  return request({
    url: '/map/map/getDeviceAll',
    method: 'post',
    data: data
  })
}

// 获取地图界面概要信息
export function getOverInfo() {
  return request({
    url: '/map/map/getOverInfo',
    method: 'post',
    //data: data
  })
}

//定位滑翔器
export function getLocationByCode(data) {
  return request({
    url: '/map/map/getLocation',
    method: 'post',
    data: data
  })
}


// 查询滑翔器目标点
export function getTarget(data) {
  return request({
    url: '/map/map/getTarget',
    method: 'post',
    data: data
  })
}

//查询设备运行速度
export function getSpeedById(data) {
  return request({
    url: '/parse/msg-parse/getSpeedById',
    method: 'post',
    data: data
  })
}


// 查询规定时间内的滑翔器轨迹
export function getTrail(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/map/map/getTrail',
    method: 'post',
    data: {
      deviceId,
      startTimeStamp,
      endTimeStamp
    }
  })
}

// 显示滑翔器n个目标点
export function getNTargets(data) {
  return request({
    url: '/map/map/getNTargets',
    method: 'post',
    data: data
  })
}

//查询Ais信息
export function getAisInfo(deviceId) {
  return request({
    url: '/map/map/getAisInfo',
    method: 'post',
    params: {
      deviceId: deviceId
    }
  })
}

export function getAisTrail(endAisTimeStamp, deviceId, mmsi, startAisTimeStamp) {
  return request({
    url: '/map/map/getAisTrail',
    method: 'post',
    data: {
      endAisTimeStamp,
      deviceId,
      mmsi,
      startAisTimeStamp
    }
  })
}

// 获取区域船讯网船只信息
export function getShipByMmsi(mmsi) {
  return request({
    baseURL: process.env.VUE_APP_SHIPXY_API,
    url: 'https://api.shipxy.com/apicall/QueryShip?v=2&k=44c27da791b044ec96a5e5e087025ddb&enc=1&scode=0&xy=119000000，21000000-117000000，21000000-117000000，19000000-119000000，19000000',
    method: 'post',
    data: {
      mmsi,
    }
  })
}

// 获取区域船讯网船只信息
export function getAreaShipInfo() {
  return request({
    baseURL: process.env.VUE_APP_SHIPXY_API,
    url: 'https://api.shipxy.com/apicall/QueryShip?v=2&k=44c27da791b044ec96a5e5e087025ddb&enc=1&scode=0&xy=119000000，21000000-117000000，21000000-117000000，19000000-119000000，19000000',
    method: 'get'
  })
}
