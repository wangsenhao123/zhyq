import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

const server: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})

// 添加请求拦截器
server.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  function (error: AxiosError) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
server.interceptors.response.use(
  function (response: AxiosResponse) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  function (error: AxiosError) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 防止接口重复请求
const history: string[] = []
const prevent = (config: AxiosRequestConfig): boolean => {
  const url = config.url
  if (history.includes(url!)) {
    return false
  }
  history.push(url!)
  return true
}

const remove = (url: string) => {
  const index = history.indexOf(url!)
  history.splice(index, 1)
}

type DataType<T = any> = {
  code: number
  msg: string
  data: T
}
const request = async <T = any>(options: AxiosRequestConfig): Promise<DataType<T>> => {
  if (!prevent(options)) {
    return Promise.reject(new Error('Duplicate request detected'))
  }

  try {
    const response = await server.request<T, AxiosResponse<DataType<T>>>({
      [options.method === 'GET' ? 'params' : 'data']: options.data,
      ...options
    })
    return response.data
  } finally {
    remove(options.url!)
  }
}

export const get = <T = any>(url: string, data?: Object) => {
  return request<T>({
    method: 'GET',
    url,
    data
  })
}
export const post = <T = any>(url: string, data?: Object) => {
  return request<T>({
    method: 'POST',
    url,
    data
  })
}
export const put = <T = any>(url: string, data?: Object) => {
  return request<T>({
    method: 'PUT',
    url,
    data
  })
}
export const del = <T = any>(url: string, data?: Object) => {
  return request<T>({
    method: 'DELETE',
    url,
    data
  })
}

export default request
