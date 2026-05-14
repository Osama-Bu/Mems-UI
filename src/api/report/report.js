import request from '@/utils/request'


export function getReport(deviceId, startTimeStamp, endTimeStamp) {
    return request({
        url: '/report/report/get',
        method: 'post',
        data: {
            "deviceId": deviceId,
            "startTimeStamp": startTimeStamp,
            "endTimeStamp": endTimeStamp
        }
    });
}

// lofar图
export function getLofar(data) {
    return request({
      url: '/report/chart/getLofar',
      method: 'post',
      data: data
    })
}

// 能量检测
export function getPowerCheck(data) {
  return request({
    url: '/report/chart/getPowerCheck',
    method: 'post',
    data: data
  })
}
