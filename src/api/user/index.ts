import { requestInstance as request } from '@/axios'
import type { BizResponse } from '#/axios'

// 登录
export const login: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/auth/login', data)
}

// 注册
export const regist: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/auth/regist', data)
}

// 退出
export const logout: () => Promise<BizResponse<any>> = () => {
  return request.post('/api/v1.0.0/auth/logout')
}

// 用户列表
export const userList: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/user/lists', data)
}

// 用户更新
export const updateUser: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/user/update', data)
}

// 重置密码
export const resetPwd: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/auth/resetPwd', data)
}