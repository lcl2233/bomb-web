<template>
  <div>
    <div class="toolbar">
      <h2>权益管理</h2>
      <el-input
        v-model="userId"
        placeholder="按用户ID筛选"
        style="width: 200px"
        clearable
        @clear="loadData"
        @keyup.enter="loadData"
      />
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="records" stripe>
      <el-table-column prop="userId" label="用户ID" width="90" />
      <el-table-column prop="productName" label="套餐" min-width="120" />
      <el-table-column prop="orderId" label="订单ID" width="90" />
      <el-table-column label="开始时间" min-width="160">
        <template #default="{ row }">{{ formatDateTime(row.startAt) }}</template>
      </el-table-column>
      <el-table-column label="到期时间" min-width="160">
        <template #default="{ row }">{{ formatDateTime(row.expireAt) }}</template>
      </el-table-column>
      <el-table-column label="剩余天数" width="100">
        <template #default="{ row }">{{ row.remainingDays }} 天</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">{{ entitlementStatusText(row.status) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminListEntitlements } from '@/api/entitlement'
import { entitlementStatusText, formatDateTime } from '@/utils/format'
import type { EntitlementVO } from '@/types'

const loading = ref(false)
const userId = ref('')
const records = ref<EntitlementVO[]>([])

async function loadData() {
  loading.value = true
  try {
    const uid = userId.value ? Number(userId.value) : undefined
    const res = await adminListEntitlements(uid, 1, 50)
    records.value = res.data.records
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.toolbar h2 {
  margin-right: auto;
}
</style>
