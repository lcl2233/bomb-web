import request from './request'
import type { PageResult, ProductVO, Result } from '@/types'

export function listProducts(page = 1, size = 10) {
  return request.get<any, Result<PageResult<ProductVO>>>('/products', { params: { page, size } })
}

export function getProduct(id: number) {
  return request.get<any, Result<ProductVO>>(`/products/${id}`)
}

export function adminListProducts(page = 1, size = 10) {
  return request.get<any, Result<PageResult<ProductVO>>>('/admin/products', { params: { page, size } })
}

export function adminCreateProduct(data: {
  name: string
  description?: string
  price: number
  durationDays: number
  sortOrder?: number
}) {
  return request.post<any, Result<ProductVO>>('/admin/products', data)
}

export function adminUpdateProduct(id: number, data: {
  name: string
  description?: string
  price: number
  durationDays: number
  sortOrder?: number
}) {
  return request.put<any, Result<ProductVO>>(`/admin/products/${id}`, data)
}

export function adminUpdateProductStatus(id: number, status: number) {
  return request.put<any, Result<ProductVO>>(`/admin/products/${id}/status`, { status })
}

export function adminDeleteProduct(id: number) {
  return request.delete<any, Result<void>>(`/admin/products/${id}`)
}
