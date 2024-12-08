import { requestInstance as request } from '@/axios'
import type { BizResponse } from '#/axios'

// 实验室列表
export const getLabList: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/labroom/lists', data)
}

// 添加实验室
export const addLab: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/labroom/add', data)
}

// 修改实验室
export const updateLab: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/labroom/update', data)
}

// 获取实验室信息
export const labInfo: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/labroom/info', data)
}