import request from '@/utils/request'

//分页查询设备基本信息(不包含通信方式),pageNum=-1为查找全部
export function getDeviceInfo(data) {
  return request({
    url: '/ms_system/device/list/page',
    method: 'post',
    data: data
  })
}

//分页查询设备基本信息(包含通信方式),pageNum=-1为查找全部
export function getDeviceInfoAndCommWay(data) {
  return request({
    url: '/ms_system/device/list/pageAndCommWay',
    method: 'post',
    data: data
  })
}


//删除设备信息
export function deleteDeviceInfo(id){
  return request({
    url: '/ms_system/device/delBatch',
    method: 'delete',
    data: id
  })
}

//修改设备信息
export function updateDeviceInfo(data){
  return request({
    url: '/ms_system/device/update',
    method: 'put',
    data: data
  })
}

//添加设备信息
export function addDeviceInfo(data){
  return request({
    url: '/ms_system/device/add',
    method: 'post',
    data: data
  })
}

// 报警开关
export function alarmSwitch(data) {
  return request({
    url: '/ms_system/device/alarmSwitch',
    method: 'post',
    data: data
  })
}

// 查询用户所属设备
export function getUserDevices(data) {
  return request({
    url: '/ms_system/device/list/pageUserDevices',
    method: 'post',
    data: data
  })
}

//分页查询设备id绑定的协议列表
export function getDeviceInfoWithMessage(data){
  return request({
    url: '/message/msg-device/page',
    method: 'post',
    data: data
  })
}

//新增设备与协议关系
export function addDeviceInfoWithMessage(data){
  return request({
    url: '/message/msg-device/add',
    method: 'post',
    data: data
  })
}

//批量删除设备与协议的关系
export function deleteDeviceInfoWithMessage(data){
  return request({
    url: '/message/msg-device/delBatch',
    method: 'post',
    data: data
  })
}

export function msgParseFind(data){
  return request({
    url: '/parse/msg-parse/find',
    method: 'post',
    data: data
  })
}

// 设备类型及型号树查询接口
export function getDeviceTypeTree() {
  return request({
    url: '/ms_system/device-type/tree',
    method: 'get'
  })
}
