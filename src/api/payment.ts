import request from './request'
import type { AlipayPayResponse, Result } from '@/types'

export function createAlipayPay(orderNo: string) {
  return request.post<any, Result<AlipayPayResponse>>(`/payments/alipay/${orderNo}`)
}
