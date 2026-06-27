import request from './request'
import type { EntitlementVO, PageResult, Result } from '@/types'

export function getMyEntitlement() {
  return request.get<any, Result<EntitlementVO | null>>('/entitlements/me')
}

export function listMyEntitlementHistory(page = 1, size = 10) {
  return request.get<any, Result<PageResult<EntitlementVO>>>('/entitlements/history', { params: { page, size } })
}

export function adminListEntitlements(userId?: number, page = 1, size = 10) {
  return request.get<any, Result<PageResult<EntitlementVO>>>('/admin/entitlements', {
    params: { userId, page, size },
  })
}
