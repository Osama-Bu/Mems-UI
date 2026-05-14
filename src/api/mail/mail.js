import request from '@/utils/request'

//分页查找邮箱的表格信息  pageNum=-1为查找全部
export function getMailInfoCDWithNMsg(data) {
  return request({
    url: '/communicate/mailbox/page',
    method: 'post',
    data: JSON.stringify(data)
  })
}
//删除邮箱信息
export function deleteMailInfo(data){
  return request({
    url: "/communicate/mailbox/delete",
    method: 'delete',
    data:data
  })
}

//修改邮箱信息
export function updateMailInfo(data){
  return request({
    url: '/communicate/mailbox/update',
    method: 'put',
    data: data
  })
}

//增加邮箱信息
export function addMailInfo(data){
  return request({
    url: '/communicate/mailbox/add',
    method: 'post',
    data: data
  })
}

// 邮箱重解析
export function reparseMail(data){
  return request({
    url: '/communicate/mailbox/reparse',
    method: 'post',
    data: data
  })
}
