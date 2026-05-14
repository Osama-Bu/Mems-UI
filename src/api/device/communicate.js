import request from '@/utils/request'

// 新增通信方式绑定
export function addCommWay(data) {
  return request({
    url: '/ms_system/device-communicate/add',
    method: 'post',
    data: data
  })
}

// 更新通信号码
export function updateCommWay(data){
  return request({
    url: '/ms_system/device-communicate/update',
    method: 'put',
    data: data
  })
}

//删除设备信息
export function deleteCommWay(id){
  return request({
    url: '/ms_system/device-communicate/delete',
    method: 'delete',
    params: {
      id: id
    }
  })
}

// 根据设备ID查询通信列表
export function getCommWaysByDeviceId(deviceId) {
  return request({
    url: '/ms_system/device-communicate/getByDeviceId',
    method: 'get',
    params: {
      deviceId: deviceId
    }
  })
}
