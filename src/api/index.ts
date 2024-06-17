import request from './request'

export type LoginParams = {
  username: string
  password: string
}
export const postLogin = (data: LoginParams) => {
  return request<LoginParams>({ url: '/park/login', method: 'POST', data })
}
