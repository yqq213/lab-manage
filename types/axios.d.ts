export interface BizResponse<T = Record<string, unknown> | Array<unknown>> {
  code?: string | number;
  message?: string;
  // data: T | { records?: T; pages?: number; size?: number; total?: number; };
  data: T;
  success?: boolean;
  [key: string]: any;
}

export interface Result<T = any> {
  code: number;
  success: 'true' | 'false';
  msg: string;
  data: T;
}


export interface PageResult<T> {
  /** 数据列表 */
  records: T;
  /** 总数 */
  total: number;
}