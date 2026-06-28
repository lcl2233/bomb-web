const TOKEN_KEY = 'bomb_token'
const PAY_TOKEN_KEY = 'bomb_pay_token'
const PAY_USERNAME_KEY = 'bomb_pay_username'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/** 跳转支付宝前保存当前登录态，防止回跳时被其它标签页的登录覆盖 */
export function savePaySession() {
  const token = getToken()
  if (token) {
    sessionStorage.setItem(PAY_TOKEN_KEY, token)
  }
}

export function clearPaySession() {
  sessionStorage.removeItem(PAY_TOKEN_KEY)
  sessionStorage.removeItem(PAY_USERNAME_KEY)
}

export function savePayUsername(username: string) {
  sessionStorage.setItem(PAY_USERNAME_KEY, username)
}

export function getPayToken(): string | null {
  return sessionStorage.getItem(PAY_TOKEN_KEY)
}

export function getPayUsername(): string | null {
  return sessionStorage.getItem(PAY_USERNAME_KEY)
}

/** 支付回跳时若 token 被切换，恢复支付时的账号 */
export function restorePaySessionIfNeeded(): boolean {
  const payToken = getPayToken()
  if (!payToken) {
    return false
  }
  const currentToken = getToken()
  if (currentToken === payToken) {
    clearPaySession()
    return false
  }
  setToken(payToken)
  clearPaySession()
  return true
}
