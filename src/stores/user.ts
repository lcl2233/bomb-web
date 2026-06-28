import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getMe, login as loginApi, register as registerApi } from '@/api/auth'
import { getToken, removeToken, setToken } from '@/utils/auth'
import type { UserVO } from '@/types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(getToken())
  const user = ref<UserVO | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  async function fetchUser() {
    const latestToken = getToken()
    if (!latestToken) {
      user.value = null
      token.value = null
      return
    }
    token.value = latestToken
    try {
      const res = await getMe()
      user.value = res.data
    } catch {
      logout()
    }
  }

  /** 每次路由跳转时同步 localStorage 中的 token，并刷新用户信息 */
  async function syncUser() {
    const latestToken = getToken()
    if (!latestToken) {
      logout()
      return
    }
    token.value = latestToken
    await fetchUser()
  }

  async function initUser() {
    await syncUser()
  }

  async function login(username: string, password: string) {
    const res = await loginApi({ username, password })
    token.value = res.data.token
    user.value = res.data.user
    setToken(res.data.token)
  }

  async function register(username: string, password: string, email?: string) {
    const res = await registerApi({ username, password, email })
    token.value = res.data.token
    user.value = res.data.user
    setToken(res.data.token)
  }

  function logout() {
    token.value = null
    user.value = null
    removeToken()
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    fetchUser,
    syncUser,
    initUser,
    login,
    register,
    logout,
  }
})
