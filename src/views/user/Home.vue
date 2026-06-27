<template>
  <div v-loading="loading">
    <h2 class="page-title">VPN 套餐</h2>
    <el-row :gutter="20">
      <el-col v-for="item in products" :key="item.id" :xs="24" :sm="12" :md="8">
        <ProductCard :product="item" @buy="handleBuy" />
      </el-col>
    </el-row>
    <el-empty v-if="!loading && products.length === 0" description="暂无商品" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { listProducts } from '@/api/product'
import { useUserStore } from '@/stores/user'
import ProductCard from '@/components/ProductCard.vue'
import type { ProductVO } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const products = ref<ProductVO[]>([])

async function loadProducts() {
  loading.value = true
  try {
    const res = await listProducts(1, 20)
    products.value = res.data.records
  } finally {
    loading.value = false
  }
}

function handleBuy(productId: number) {
  if (!userStore.isLoggedIn) {
    router.push({ name: 'Login', query: { redirect: `/checkout/${productId}` } })
    return
  }
  router.push(`/checkout/${productId}`)
}

onMounted(loadProducts)
</script>

<style scoped>
.page-title {
  margin-bottom: 24px;
}
</style>
