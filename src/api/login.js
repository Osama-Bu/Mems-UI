import request from '@/utils/request'

// 登录方法
export function login (username, password, code, uuid) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: { username, password, code, uuid }
  })
}

// 注册方法
export function register (data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 刷新方法
export function refreshToken () {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo () {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout () {
  return request({
    url: '/auth/logout',
    method: 'delete'
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

// 获取公钥
export function getPublicKey () {
  return request({
    url: '/auth/rsa/public/key',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

//忘记密码 确认用户信息
export function sendUser(data) {
  return request({
    url: 'auth/pwd/forget/code',
    method: 'post',
    data:data,
  })
}
//修改密码
export function modify(data) {
  return request({
    url: 'auth/pwd/reset',
    method: 'post',
    data:data,
  })
}

// todo 修改语言,国际化
export function changeLanguage(lang){
  return request({
    url: '/changeLanguage',
    method: 'get',
    headers: {
      isToken: false,
    },
    params: {
      lang: lang
    }
  })
}
