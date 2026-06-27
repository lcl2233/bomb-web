import request from './request'
import type { OrderVO, PageResult, Result } from '@/types'

export function createOrder(productId: number) {
  return request.post<any, Result<OrderVO>>('/orders', { productId })
}

export function listMyOrders(page = 1, size = 10) {
  return request.get<any, Result<PageResult<OrderVO>>>('/orders', { params: { page, size } })
}

export function getOrder(orderNo: string) {
  return request.get<any, Result<OrderVO>>(`/orders/${orderNo}`)
}

export function cancelOrder(orderNo: string) {
  return request.post<any, Result<OrderVO>>(`/orders/${orderNo}/cancel`)
}

export function adminListOrders(page = 1, size = 10) {
  return request.get<any, Result<PageResult<OrderVO>>>('/admin/orders', { params: { page, size } })
}
