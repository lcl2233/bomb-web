import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/UserLayout.vue'),
      children: [
        { path: '', name: 'Home', component: () => import('@/views/user/Home.vue') },
        { path: 'products/:id', name: 'ProductDetail', component: () => import('@/views/user/ProductDetail.vue') },
        { path: 'checkout/:productId', name: 'Checkout', component: () => import('@/views/user/Checkout.vue'), meta: { requiresAuth: true } },
        { path: 'pay/result', name: 'PayResult', component: () => import('@/views/user/PayResult.vue'), meta: { requiresAuth: true } },
        { path: 'my/orders', name: 'MyOrders', component: () => import('@/views/user/MyOrders.vue'), meta: { requiresAuth: true } },
        { path: 'my/entitlement', name: 'MyEntitlement', component: () => import('@/views/user/MyEntitlement.vue'), meta: { requiresAuth: true } },
      ],
    },
    { path: '/login', name: 'Login', component: () => import('@/views/user/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/user/Register.vue') },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/products' },
        { path: 'products', name: 'AdminProducts', component: () => import('@/views/admin/ProductManage.vue'), meta: { requiresAdmin: true } },
        { path: 'orders', name: 'AdminOrders', component: () => import('@/views/admin/OrderManage.vue'), meta: { requiresAdmin: true } },
        { path: 'entitlements', name: 'AdminEntitlements', component: () => import('@/views/admin/EntitlementManage.vue'), meta: { requiresAdmin: true } },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (getToken()) {
    await userStore.initUser()
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.matched.some((record) => record.meta.requiresAdmin) && !userStore.isAdmin) {
    if (userStore.isLoggedIn) {
      ElMessage.warning('需要管理员权限')
    }
    return { name: 'Home' }
  }
})

export default router
