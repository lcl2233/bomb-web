<template>
  <div
    v-loading="loading || paying"
    :element-loading-text="paying ? '正在创建订单，即将跳转支付宝...' : '加载中...'"
    class="checkout-page"
  >
    <h2>确认订单</h2>
    <el-card v-if="product">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="商品">{{ product.name }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ product.description }}</el-descriptions-item>
        <el-descriptions-item label="有效时长">{{ product.durationDays }} 天</el-descriptions-item>
        <el-descriptions-item label="应付金额">
          <span class="price">{{ formatMoney(product.price) }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <div class="actions">
        <el-button :disabled="paying" @click="$router.back()">返回</el-button>
        <el-button type="primary" :loading="paying" :disabled="paying" @click="handlePay">
          {{ paying ? '跳转中...' : '去支付' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProduct } from '@/api/product'
import { createOrder } from '@/api/order'
import { createAlipayPay } from '@/api/payment'
import { useUserStore } from '@/stores/user'
import { formatMoney, submitAlipayForm } from '@/utils/format'
import { savePaySession, savePayUsername } from '@/utils/auth'
import type { ProductVO } from '@/types'

const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
const paying = ref(false)
const product = ref<ProductVO | null>(null)

async function loadProduct() {
  loading.value = true
  try {
    const res = await getProduct(Number(route.params.productId))
    product.value = res.data
  } finally {
    loading.value = false
  }
}

async function handlePay() {
  if (!product.value || paying.value) return
  paying.value = true
  try {
    const orderRes = await createOrder(product.value.id)
    const payRes = await createAlipayPay(orderRes.data.orderNo)
    savePaySession()
    if (userStore.user?.username) {
      savePayUsername(userStore.user.username)
    }
    submitAlipayForm(payRes.data.payForm)
    // 跳转支付宝前保持 loading，防止重复点击
  } catch {
    paying.value = false
    ElMessage.error('创建支付失败，请检查支付宝配置')
  }
}

onMounted(loadProduct)
</script>

<style scoped>
.checkout-page {
  padding-top: 16px;
}
.price {
  color: #f56c6c;
  font-size: 22px;
  font-weight: 700;
}
.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
