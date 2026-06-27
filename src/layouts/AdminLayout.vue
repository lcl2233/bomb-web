<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="brand">管理后台</div>
      <el-menu router :default-active="$route.path">
        <el-menu-item index="/admin/products">商品管理</el-menu-item>
        <el-menu-item index="/admin/orders">订单管理</el-menu-item>
        <el-menu-item index="/admin/entitlements">权益管理</el-menu-item>
      </el-menu>
      <el-button class="back-btn" @click="$router.push('/')">返回商城</el-button>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span>{{ userStore.user?.username }}（管理员）</span>
        <el-button link type="primary" @click="handleLogout">退出</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  await userStore.initUser()
  if (!userStore.isAdmin) {
    ElMessage.warning('需要管理员权限')
    router.replace('/')
  }
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
.aside {
  background: #fff;
  border-right: 1px solid #eee;
  padding-top: 16px;
}
.brand {
  font-size: 18px;
  font-weight: 700;
  padding: 0 20px 16px;
  color: #409eff;
}
.back-btn {
  margin: 16px 20px 0;
  width: calc(100% - 40px);
}
.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  border-bottom: 1px solid #eee;
  background: #fff;
}
</style>
