import axios from "axios"
import qs from 'qs'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import type { BizResponse } from '#/axios'
import { message as Message } from 'ant-design-vue'
import { Storage } from '@/utils/storage'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { des_encrypt, des_decrypt } from '@/utils/index'

const store = useUserStore()

let showMessageFlag = false   // 页面是否正在展示提示

const enableEncrypt = import.meta.env.VITE_ENABLE_ENCRYPT === 'true'

class Request {
  // axios 实例
  instance: AxiosInstance
  // 基础配置
  baseConfig: AxiosRequestConfig = {
    // baseURL: import.meta.env.VITE_BASIC_API_URL,
    baseURL: import.meta.env.DEV ? undefined : window.globalVar.requestUrl,
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
    }
  }
  constructor(config: AxiosRequestConfig) {
    // 创建实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))
    // request 拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('url：', config.url, '请求入参：', config.data)
        config.headers['X-Access-Token'] = Storage.get('token')
        // 加密入参
        if (!config.noCrypto && enableEncrypt) {
          config.data = {
            sign: des_encrypt(config.data)
          }
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
    // response 拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 解密出参
        if (enableEncrypt && response.data?.sign) {
          const decryptStr = des_decrypt(response.data.sign ?? '')
          response.data = JSON.parse(decryptStr)
        }
        console.log('url：', response.request.responseURL, '响应参数：', response.data)
        if (response?.data?.code == 200) {
          return response.data
        } else {
          if (response?.data?.msg && !showMessageFlag) {
            Message.error(response.data.msg)
            showMessageFlag = true
            setTimeout(() => {
              showMessageFlag = false
            }, 3000)
          }
          // 未登录
          if (response.data.code == '1001001107') {
            store.clearUserInfo()
            router.push('/login')
          }
          return Promise.reject(new Error(response?.data?.msg))
        }
      },
      (error) => {
        const { message, status } = error.toJSON();
        console.log(message)
        if (status === 401 && !showMessageFlag) {
          Message.error('登录信息已过期，请回到管理后台重新登录')
        }
        showMessageFlag = true
        setTimeout(() => {
          showMessageFlag = false
        }, 3000)
      }
    )
  }
  // 定义get方法
  public get<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BizResponse<T>> {  
    if (data && Object.keys(data).length) {
      return this.instance.get(`${url}?${qs.stringify(data, {indices: false})}`, config);
    } else {
      return this.instance.get(url, config);
    }
  }
  // 定义post方法
  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BizResponse<T>> {
    return this.instance.post(url, data, config);
  }
}

export const requestInstance = new Request({})

export default Request