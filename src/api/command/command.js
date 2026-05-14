import request from '@/utils/request'

//发送指令，参数为指令列表
export function sendCmd(data) {
  return request({
    url: '/command/cmd/send',
    method: 'post',
    data: data
  })
}

//获取所有指令的指令id
export function getCmds() {
  return request({
    url: '/command/cmd/all',
    method: 'get',
  })
}
//获取所有指令的发送历史
export function history() {
  return request({
    url: '/command/cmdHistory/all',
    method: 'get',
  })
}

//获取指定设备的发送历史
export function getHistoryById(id) {
  return request({
    url: '/command/cmdHistory/device/'+id,
    method: 'get',
  })
}
//添加自定义指令
export function addCmd(data) {
  return request({
    url: '/command/cmdCustom/add',
    method: 'post',
    data: data
  })
}

//修改自定义指令
export function setCmd(data) {
  return request({
    url: '/command/cmdCustom/modify/'+data.id,
    method: 'put',
    data: data
  })
}

//获取所有自定义指令
export function getCustomizeCmd(  ) {
  return request({
    url: '/command/cmdCustom/all',
    method: 'get',
  })
}
//删除指定id的自定义指令
export function delCustomizeCmd(id) {
  return request({
    url: '/command/cmdCustom/del/'+ id,
    method: 'delete',
  })
}

//新增定时指令
export function addTimingTask(data) {
  return request({
    url: '/command/cmdSchedule/add',
    method: 'post',
    data: data
  })
}

//查询当前未执行的定时任务和循环任务，或正在执行还未结束的循环任务,分页版本
export function getCurrentTimingTaskPages(data) {
  return request({
    url: '/command/cmdSchedule/current',
    method: 'post',
    data: data
  })
}

//查询已执行完的定时任务和循环任务，分页版本
export function getTimingTaskHistoryPages(data) {
  return request({
    url: '/command/cmdSchedule/history',
    method: 'post',
    data: data
  })
}

//查询当前未执行的定时任务和循环任务，或正在执行还未结束的循环任务的id和名称
export function getCurrentTimingTaskID() {
  return request({
    url: '/command/cmdSchedule/going',
    method: 'get',
  })
}

//添加指令列表到某个任务（根据任务id）
export function addCmdToTask(taskid,data) {
  return request({
    url: '/command/cmdSchedule/cmd/add/'+taskid,
    method: 'post',
    data: data
  })
}
//根据指令id删除任务中的一条待发送指令(如果该条指令不想让它发送了，可从任务中移除，任务到时候依然会准时发送剩余的指令)
export function deleteTaskCmd(id) {
  return request({
    url: '/command/cmdSchedule/cmd/del/'+id,
    method: 'delete',
  })
}

//撤销指令任务（撤销后该指令不会再执行，同时从当前任务列表中移除，但可在指令历史中查看）
export function cancelTask(taskid) {
  return request({
    url: '/command/cmdSchedule/cancel/'+taskid,
    method: 'post',
  })
}

