import request from '@/utils/request'

// 查询除分压外的数据 通用接口
export function getCommonValue(data) {
  return request({
    url: 'report/flux/getCommonValue',
    method: 'post',
    data: data
  })
}

// 查询分压的数据
export function getDPMValue(data) {
  return request({
    url: 'report/flux/getCalculateValue',
    method: 'post',
    data: data
  })
}

export function getRose(data) {
  return request({
    url: 'report/flux/getRose',
    method: 'post',
    data: data
  })
}

