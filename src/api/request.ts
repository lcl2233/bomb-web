import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'
import type { Result } from '@/types'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const res = response.data as Result<unknown>
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      if (res.code === 401) {
        removeToken()
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
      return Promise.reject(new Error(res.message))
    }
    return response.data
  },
  (error) => {
    const status = error.response?.status
    const res = error.response?.data as Result<unknown> | undefined
    if (status === 401 || res?.code === 401) {
      removeToken()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    }
    ElMessage.error(res?.message || error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
