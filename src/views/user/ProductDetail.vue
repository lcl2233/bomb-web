<template>
  <div v-loading="loading" class="detail-page">
    <el-page-header @back="$router.push('/')" content="商品详情" />
    <el-card v-if="product" class="detail-card">
      <h2>{{ product.name }}</h2>
      <p class="desc">{{ product.description }}</p>
      <div class="info">
        <span class="price">{{ formatMoney(product.price) }}</span>
        <span>有效时长：{{ product.durationDays }} 天</span>
      </div>
      <el-button type="primary" size="large" @click="handleBuy">立即购买</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct } from '@/api/product'
import { useUserStore } from '@/stores/user'
import { formatMoney } from '@/utils/format'
import type { ProductVO } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const product = ref<ProductVO | null>(null)

async function loadProduct() {
  loading.value = true
  try {
    const res = await getProduct(Number(route.params.id))
    product.value = res.data
  } finally {
    loading.value = false
  }
}

function handleBuy() {
  if (!product.value) return
  if (!userStore.isLoggedIn) {
    router.push({ name: 'Login', query: { redirect: `/checkout/${product.value.id}` } })
    return
  }
  router.push(`/checkout/${product.value.id}`)
}

onMounted(loadProduct)
</script>

<style scoped>
.detail-page {
  padding-top: 16px;
}
.detail-card {
  margin-top: 24px;
}
.desc {
  color: #606266;
  line-height: 1.8;
  margin: 16px 0 24px;
}
.info {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}
.price {
  color: #f56c6c;
  font-size: 28px;
  font-weight: 700;
}
</style>
