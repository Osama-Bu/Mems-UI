import request from '@/utils/request'

// 分页查找协议信息,pageNum=-1为查找全部
export function getMessageInfo(data) {
  return request({
    url: '/message/msg/page',
    method: 'post',
    data: data
  })
}

// 根据msg_id查询协议及其协议项内容
export function getMsgItemsByMsgId(msgId) {
  return request({
    url: '/message/msg/getMsgItemsByMsgId',
    method: 'get',
    params: {
      msgId: msgId
    }
  })
}

// 分页查询协议绑定的设备id列表
export function getDeviceBanding(data) {
  return request({
    url: '/message/msg-device/reversePage',
    method: 'post',
    data: data
  })
}

//删除协议信息
export function deleteMessageInfo(data) {
  return request({
    url: '/message/msg/delete',
    method: 'delete',
    data: data
  })
}

//添加协议信息
export function addMessageInfo(data) {
  return request({
    url: '/message/msg/add',
    method: 'post',
    data: data
  })
}

//修改协议信息
export function updateMessageInfo(data) {
  return request({
    url: '/message/msg/update',
    method: 'post',
    data: data
  })
}

//多所属协议
export function getMultiple(data) {
  return request({
    url: '/message/msg/pageMultiple',
    method: 'post',
    data: data
  })
}

//获取数据类型
export function getMessageDataType(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get',
  })
}

//天通图片获取
export function getTTImg(data) {
  return request({
    url: '/parse/geturl/images',
    method: 'post',
    data: data
  })
}

