import request from '@/utils/request'

//分页查询设备种类,pageNum=-1为查找全部
export function pageDeviceType(data) {
  return request({
    url: '/ms_system/device-type/list/page',
    method: 'post',
    data: data
  })
}

// 根据id查询设备种类
export function getTypeById(typeId) {
  return request({
    url: '/ms_system/device-type/getById',
    method: 'get',
    params: {
      typeId: typeId
    }
  })
}

// 新增设备种类
export function addDeviceType(data) {
  return request({
    url: '/ms_system/device-type/add',
    method: 'post',
    data: data
  })
}


// 修改设备种类
export function updateDeviceType(data) {
  return request({
    url: '/ms_system/device-type/update',
    method: 'put',
    data: data
  })
}

// 删除设备种类
export function delDeviceType(typeId) {
  return request({
    url: '/ms_system/device-type/delete',
    method: 'delete',
    params: {
      typeId: typeId
    }
  })
}
