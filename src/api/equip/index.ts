import { requestInstance as request } from '@/axios'
import type { BizResponse } from '#/axios'

// 设备列表
export const getEquipList: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/device/lists', data)
}

// 添加设备
export const addEquip: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/device/add', data)
}

// 修改设备
export const editEquip: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/device/update', data)
}

// 设备详情
export const equipDetail: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/device/info', data)
}

// 设置设备管理员
export const addManager: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/device/addManager', data)
}

// 删除设备管理员
export const delManager: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/device/delManager', data)
}

// 我的设备列表
export const myDeviceList: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/device/myDeviceList', data)
}

// 文件上传
export const fileUpload: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/files/uploadSingleFile', data, {headers: {'Content-Type': 'multipart/form-data'}})
}
