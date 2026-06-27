<template>
  <div>
    <h2 class="page-title">订单管理</h2>
    <el-table v-loading="loading" :data="orders" stripe>
      <el-table-column prop="orderNo" label="订单号" min-width="180" />
      <el-table-column prop="userId" label="用户ID" width="90" />
      <el-table-column prop="productName" label="商品" min-width="120" />
      <el-table-column label="金额" width="100">
        <template #default="{ row }">{{ formatMoney(row.amount) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><OrderStatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="支付时间" min-width="160">
        <template #default="{ row }">{{ formatDateTime(row.paidAt) }}</template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="160">
        <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminListOrders } from '@/api/order'
import OrderStatusTag from '@/components/OrderStatusTag.vue'
import { formatDateTime, formatMoney } from '@/utils/format'
import type { OrderVO } from '@/types'

const loading = ref(false)
const orders = ref<OrderVO[]>([])

async function loadOrders() {
  loading.value = true
  try {
    const res = await adminListOrders(1, 50)
    orders.value = res.data.records
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
</script>

<style scoped>
.page-title {
  margin-bottom: 16px;
}
</style>
