import request from '@/utils/request'

// 分页查找北斗的表格信息  pageNum=-1为查找全部
export function getBeidouInfoCDWithNMsg(data) {
  return request({
    url: '/communicate/beidou/page',
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 删除北斗信息
export function deleteBeidouInfo(data){
  return request({
    url: "/communicate/beidou/deleteBatch",
    method: 'delete',
    data:data
  })
}

// 修改北斗信息
export function updateBeidouInfo(data){
  return request({
    url: '/communicate/beidou/update',
    method: 'put',
    data: data
  })
}

// 增加北斗信息
export function addBeidouInfo(data){
  return request({
    url: '/communicate/beidou/add',
    method: 'post',
    data: data
  })
}


