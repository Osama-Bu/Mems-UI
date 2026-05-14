import request from '@/utils/request'

//导航状态
export function Navigation(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getDHStatus',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}

//动力状态
export function Power(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getDLStatus',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}
//湿度状态
export function humidity(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getCNSDStatus',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}
//温度状态
export function temperature(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getCNWDStatus',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}

//续航状态
export function Endurance(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getXHStatus',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}

//牵引状态
export function Drag(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getQYStatus',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}

//能源状态
export function Energy(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getNYStatus',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}

//浮船状态
export function FloatingShip(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getFCStatus',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}

//下载excel
export function detailExcel(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/excelExport',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}

// 螺旋桨转速
export function getPropeller(data) {
  return request({
    url: '/report/chart/getPropellerRotationSpeed',
    method: 'post',
    data: data
  })
}


//扭转圈数
export function getTwistangle(deviceId, startTimeStamp, endTimeStamp) {
  return request({
    url: '/report/chart/getTwistAngle',
    method: 'post',
    data: {
      deviceId: Number(deviceId),
      startTimeStamp: Number(startTimeStamp),
      endTimeStamp: Number(endTimeStamp)
    },
  })
}
