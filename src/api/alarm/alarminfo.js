import request from '@/utils/request'

// 获取报警内容
export function getAlarmInfo(data) {
  return request({
    url: '/monitor/watchAlarmInfo/page',
    method: 'post',
    data: data
  })
}

// 更新报警内容
export function UpdateAlarmInfo(data) {
  return request({
    url: '/monitor/watchAlarmInfo/update',
    method: 'post',
    data: data
  })
}
