import request from '@/utils/request'

// 新增报警规则
export function AddAlarmRule(data) {
  return request({
    url: '/monitor/watchRule/add',
    method: 'post',
    data: data
  })
}

// 删除报警规则
export function DeleteAlarmRule(data) {
  return request({
    url: '/monitor/watchRule/del/',
    method: 'delete',
    data: data
  })
}

// 分页查询报警规则
export function getAlarmRule(data) {
  return request({
    url: '/monitor/watchRule/page',
    method: 'post',
    data: data
  })
}

// 更新报警规则
export function UpdateAlarmRule(data) {
  return request({
    url: '/monitor/watchRule/update',
    method: 'post',
    data: data
  })
}

