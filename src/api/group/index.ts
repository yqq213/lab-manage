import { requestInstance as request } from '@/axios'
import type { BizResponse } from '#/axios'

// 分组列表
export const getGroupList: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/topic/lists', data)
}

// 新建分组
export const addGroup: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/topic/add', data)
}

// 编辑分组
export const editGroup: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/topic/update', data)
}

// 分组信息
export const groupInfo: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/topic/info', data)
}