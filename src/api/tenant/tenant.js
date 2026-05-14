import request from '@/utils/request'

// 查询租户信息列表
export function getTenantInfo(data) {
  return request({
    url: '/system/tenant/list',
    method: 'get',
    params: data
  })
}

// 获取租户信息详细信息
export function getTenantInfoDetail(TenantId) {
  return request({
    url: '/tenant/'+ TenantId,
    method: 'get',
  })
}

// 新增租户信息
export function AddTenantInfo(data){
  return request({
    url: '/system/tenant/',
    method: 'post',
    data: data
  })
}
// 修改租户信息
export function UpdateTenantInfo(data){
  return request({
    url: '/system/tenant/',
    method: 'put',
    data: data
  })
}
// 导出租户信息
export function ExportTenantInfo(data){
  return request({
    url: '/tenant/export',
    method: 'put',
    data: data
  })
}
// 删除租户信息
export function DeleteTenantInfo(TenantId){
  return request({
    url: '/tenant/' + TenantId,
    method: 'delete',
  })
}


