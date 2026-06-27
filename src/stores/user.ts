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
    if (!token.value) {
      user.value = null
      return
    }
    const res = await getMe()
    user.value = res.data
  }

  async function initUser() {
    if (token.value && !user.value) {
      await fetchUser()
    }
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
    initUser,
    login,
    register,
    logout,
  }
})
