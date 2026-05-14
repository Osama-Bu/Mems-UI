import request from '@/utils/request'

// 新增报警邮箱
export function AddAlarmEmail(data) {
  return request({
    url: '/monitor/watchMailBox/addWatchMailBox',
    method: 'post',
    data: data
  })
}

// 删除报警邮箱
export function DeleteAlarmEmail(data) {
  return request({
    url: '/monitor/watchMailBox/del',
    method: 'delete',
    data: data
  })
}

// 分页查询报警邮箱
export function getAlarmEmail(data) {
  return request({
    url: '/monitor/watchMailBox/pageWatchMailBox',
    method: 'post',
    data: data
  })
}

// 更新报警邮箱
export function UpdateAlarmEmail(data) {
  return request({
    url: '/monitor/watchMailBox/updateWatchMailBox',
    method: 'post',
    data: data
  })
}
