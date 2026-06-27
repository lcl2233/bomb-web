import request from './request'
import type { Result, TokenResponse, UserVO } from '@/types'

export function register(data: { username: string; password: string; email?: string }) {
  return request.post<any, Result<TokenResponse>>('/auth/register', data)
}

export function login(data: { username: string; password: string }) {
  return request.post<any, Result<TokenResponse>>('/auth/login', data)
}

export function getMe() {
  return request.get<any, Result<UserVO>>('/auth/me')
}
