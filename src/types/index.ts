export interface Result<T> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  total: number
  page: number
  size: number
  records: T[]
}

export interface UserVO {
  id: number
  username: string
  email?: string
  phone?: string
  role: string
  createdAt?: string
}

export interface TokenResponse {
  token: string
  user: UserVO
}

export interface ProductVO {
  id: number
  name: string
  description?: string
  price: number
  durationDays: number
  status: number
  sortOrder: number
  createdAt?: string
}

export interface OrderVO {
  id: number
  orderNo: string
  userId: number
  productId: number
  productName: string
  amount: number
  status: string
  payType?: string
  paidAt?: string
  createdAt?: string
}

export interface EntitlementVO {
  id: number
  userId: number
  productId: number
  orderId: number
  productName: string
  startAt: string
  expireAt: string
  status: string
  remainingDays: number
}

export interface AlipayPayResponse {
  payForm: string
  orderNo: string
}
