import { requestInstance as request } from '@/axios'
import type { BizResponse } from '#/axios'

// 数据列表
export const getDataList: (data) => Promise<BizResponse<any>> = (data) => {
  return request.post('/api/v1.0.0/record/lists', data)
}