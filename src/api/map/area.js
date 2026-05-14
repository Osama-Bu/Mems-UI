import request from '@/utils/request'
/**
 * google私有地图
 *
 * */
// 分页查询区域及所属点
export function getAllAreaInfo(data) {
  return request({
    url: '/ms_system/area/list/page',
    method: 'post',
    data: data
  })
}

// 新增区域及所属点
export function addAreaInfo(data) {
  return request({
    url: '/ms_system/area/add',
    method: 'post',
    data: data
  })
}

// 删除区域及所属点
export function deleteAreaInfo(data) {
  return request({
    url: '/ms_system/area/delete',
    method: 'delete',
    data: data
  })
}

// 修改区域及所属点
export function updateAreaInfo(data) {
  return request({
    url: '/ms_system/area/update',
    method: 'put',
    data: data
  })
}
