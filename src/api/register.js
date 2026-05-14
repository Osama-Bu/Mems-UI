import request from '@/utils/request'

// 注册
export function resgister(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data: data,
  })
}
// 获取组织列表
export function getDeptlist(data) {
  return request({
    url: '/auth/dept/list',
    method: 'get',
    data: data,
  })
}

// 密码加密：获取公钥
export function getPublicKey() {
  return request({
    url: '/auth/rsa/public/key',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

// 获取验证码
export function getCodeImg () {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
