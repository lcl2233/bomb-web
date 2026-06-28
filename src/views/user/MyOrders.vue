<template>
  <div
    v-loading="loading || !!payingOrderNo"
    :element-loading-text="payingOrderNo ? '正在跳转支付宝...' : '加载中...'"
  >
    <h2 class="page-title">我的订单</h2>
    <el-table :data="orders" stripe>
      <el-table-column prop="orderNo" label="订单号" min-width="180" />
      <el-table-column prop="productName" label="商品" min-width="120" />
      <el-table-column label="金额" width="100">
        <template #default="{ row }">{{ formatMoney(row.amount) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><OrderStatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="160">
        <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'PENDING'"
            link
            type="primary"
            :loading="payingOrderNo === row.orderNo"
            :disabled="!!payingOrderNo"
            @click="handlePay(row.orderNo)"
          >
            去支付
          </el-button>
          <el-button
            v-if="row.status === 'PENDING'"
            link
            type="danger"
            :disabled="!!payingOrderNo"
            @click="handleCancel(row.orderNo)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total > pageSize"
      class="pager"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listMyOrders, cancelOrder } from '@/api/order'
import { createAlipayPay } from '@/api/payment'
import { useUserStore } from '@/stores/user'
import OrderStatusTag from '@/components/OrderStatusTag.vue'
import { formatDateTime, formatMoney, submitAlipayForm } from '@/utils/format'
import { savePaySession, savePayUsername } from '@/utils/auth'
import type { OrderVO } from '@/types'

const userStore = useUserStore()
const loading = ref(false)
const payingOrderNo = ref<string | null>(null)
const orders = ref<OrderVO[]>([])
const page = ref(1)
const pageSize = 10
const total = ref(0)

async function loadOrders() {
  loading.value = true
  try {
    const res = await listMyOrders(page.value, pageSize)
    orders.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function handlePay(orderNo: string) {
  if (payingOrderNo.value) return
  payingOrderNo.value = orderNo
  try {
    const payRes = await createAlipayPay(orderNo)
    savePaySession()
    if (userStore.user?.username) {
      savePayUsername(userStore.user.username)
    }
    submitAlipayForm(payRes.data.payForm)
  } catch {
    payingOrderNo.value = null
    ElMessage.error('创建支付失败，请稍后重试')
  }
}

async function handleCancel(orderNo: string) {
  await ElMessageBox.confirm('确定取消该订单吗？', '提示', { type: 'warning' })
  await cancelOrder(orderNo)
  ElMessage.success('订单已取消')
  loadOrders()
}

function handlePageChange(p: number) {
  page.value = p
  loadOrders()
}

onMounted(loadOrders)
</script>

<style scoped>
.page-title {
  margin-bottom: 24px;
}
.pager {
  margin-top: 16px;
  justify-content: center;
}
</style>
