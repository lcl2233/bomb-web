<template>
  <div v-loading="loading">
    <div class="page-header">
      <h2 class="page-title">我的权益</h2>
      <el-button :loading="loading" @click="handleRefresh">刷新</el-button>
    </div>
    <EntitlementCard v-if="activeEntitlement" :entitlement="activeEntitlement" />
    <el-empty v-else description="暂无有效权益">
      <el-button type="primary" @click="$router.push('/')">去购买</el-button>
    </el-empty>

    <h3 class="section-title">权益历史</h3>
    <el-table :data="history" stripe>
      <el-table-column prop="productName" label="套餐" />
      <el-table-column label="开始时间">
        <template #default="{ row }">{{ formatDateTime(row.startAt) }}</template>
      </el-table-column>
      <el-table-column label="到期时间">
        <template #default="{ row }">{{ formatDateTime(row.expireAt) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">{{ entitlementStatusText(row.status) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyEntitlement, listMyEntitlementHistory } from '@/api/entitlement'
import EntitlementCard from '@/components/EntitlementCard.vue'
import { entitlementStatusText, formatDateTime } from '@/utils/format'
import type { EntitlementVO } from '@/types'

const loading = ref(false)
const activeEntitlement = ref<EntitlementVO | null>(null)
const history = ref<EntitlementVO[]>([])

async function loadData() {
  loading.value = true
  try {
    const [activeRes, historyRes] = await Promise.all([
      getMyEntitlement(),
      listMyEntitlementHistory(1, 20),
    ])
    activeEntitlement.value = activeRes.data
    history.value = historyRes.data.records
  } finally {
    loading.value = false
  }
}

async function handleRefresh() {
  await loadData()
  if (activeEntitlement.value?.vpnConfig) {
    ElMessage.success('VPN 配置已更新')
  } else if (activeEntitlement.value) {
    ElMessage.info('权益已刷新，VPN 配置仍在生成中')
  } else {
    ElMessage.info('暂无有效权益')
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
}
.section-title {
  margin: 32px 0 16px;
}
</style>
