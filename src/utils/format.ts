export function formatMoney(amount: number | string) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  return `¥${value.toFixed(2)}`
}

export function formatDateTime(value?: string) {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 19)
}

export function orderStatusText(status: string) {
  const map: Record<string, string> = {
    PENDING: '待支付',
    PAID: '已支付',
    CANCELLED: '已取消',
    REFUNDED: '已退款',
  }
  return map[status] || status
}

export function orderStatusType(status: string): 'warning' | 'success' | 'info' | 'danger' {
  const map: Record<string, 'warning' | 'success' | 'info' | 'danger'> = {
    PENDING: 'warning',
    PAID: 'success',
    CANCELLED: 'info',
    REFUNDED: 'danger',
  }
  return map[status] || 'info'
}

export function entitlementStatusText(status: string) {
  const map: Record<string, string> = {
    ACTIVE: '生效中',
    EXPIRED: '已过期',
    REVOKED: '已撤销',
  }
  return map[status] || status
}

export function submitAlipayForm(payForm: string) {
  const container = document.createElement('div')
  container.innerHTML = payForm
  document.body.appendChild(container)
  const form = container.querySelector('form')
  if (form) {
    form.setAttribute('target', '_self')
    form.submit()
  }
  document.body.removeChild(container)
}
