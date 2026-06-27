<template>
  <el-card shadow="hover" class="product-card">
    <div class="name">{{ product.name }}</div>
    <div class="desc">{{ product.description || '暂无描述' }}</div>
    <div class="meta">
      <span class="price">{{ formatMoney(product.price) }}</span>
      <span class="days">{{ product.durationDays }} 天</span>
    </div>
    <div class="actions">
      <el-button @click="$router.push(`/products/${product.id}`)">查看详情</el-button>
      <el-button type="primary" @click="$emit('buy', product.id)">立即购买</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { ProductVO } from '@/types'
import { formatMoney } from '@/utils/format'

defineProps<{ product: ProductVO }>()
defineEmits<{ buy: [id: number] }>()
</script>

<style scoped>
.product-card {
  height: 100%;
}
.name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.desc {
  color: #909399;
  min-height: 40px;
  margin-bottom: 16px;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.price {
  color: #f56c6c;
  font-size: 22px;
  font-weight: 700;
}
.days {
  color: #606266;
}
.actions {
  display: flex;
  gap: 8px;
}
</style>
