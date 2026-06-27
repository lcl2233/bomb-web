<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="brand" @click="$router.push('/')">VPN 商城</div>
      <el-menu mode="horizontal" :ellipsis="false" router class="nav-menu">
        <el-menu-item index="/">商品</el-menu-item>
        <el-menu-item v-if="userStore.isLoggedIn" index="/my/entitlement">我的权益</el-menu-item>
        <el-menu-item v-if="userStore.isLoggedIn" index="/my/orders">我的订单</el-menu-item>
        <el-menu-item v-if="showAdminEntry" index="/admin/products">管理后台</el-menu-item>
      </el-menu>
      <div class="user-area">
        <template v-if="userStore.isLoggedIn">
          <span class="username">{{ userStore.user?.username }}</span>
          <el-tag v-if="userStore.isAdmin" size="small" type="warning">管理员</el-tag>
          <el-button link type="primary" @click="handleLogout">退出</el-button>
        </template>
        <template v-else>
          <el-button link type="primary" @click="$router.push('/login')">登录</el-button>
          <el-button type="primary" @click="$router.push('/register')">注册</el-button>
        </template>
      </div>
    </el-header>
    <el-main class="main">
      <router-view />
    </el-main>
    <el-footer class="footer">VPN 商品购买平台</el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const showAdminEntry = computed(() => userStore.isLoggedIn && userStore.isAdmin)

onMounted(() => {
  userStore.initUser()
})

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid #eee;
  background: #fff;
}
.brand {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
  cursor: pointer;
  white-space: nowrap;
}
.nav-menu {
  flex: 1;
  border-bottom: none;
}
.user-area {
  display: flex;
  align-items: center;
  gap: 8px;
}
.username {
  color: #606266;
  margin-right: 4px;
}
.main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.footer {
  text-align: center;
  color: #909399;
  border-top: 1px solid #eee;
}
</style>
