import request from '@/utils/request'

// 根据设备种类id查询设备型号
export function listByTypeId(typeId) {
  return request({
    url: '/ms_system/device-model/listByTypeId',
    method: 'get',
    params: {
      typeId: typeId
    }
  })
}


// 根据id查询设备型号
export function getModelById(modelId) {
  return request({
    url: '/ms_system/device-model/getById',
    method: 'get',
    params: {
      modelId: modelId
    }
  })
}

// 新增设备型号
export function addDeviceModel(data) {
  return request({
    url: '/ms_system/device-model/add',
    method: 'post',
    data: data
  })
}


// 修改设备型号
export function updateDeviceModel(data) {
  return request({
    url: '/ms_system/device-model/update',
    method: 'put',
    data: data
  })
}

// 删除设备型号
export function delDeviceModel(modelId) {
  return request({
    url: '/ms_system/device-model/delete',
    method: 'delete',
    params: {
      modelId: modelId
    }
  })
}
