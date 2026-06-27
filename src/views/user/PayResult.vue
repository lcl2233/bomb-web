<template>
  <div class="result-page">
    <el-result icon="success" title="支付处理中" sub-title="如已完成支付，权益将在片刻后生效">
      <template #extra>
        <p v-if="orderNo">订单号：{{ orderNo }}</p>
        <p v-if="tradeNo">支付宝交易号：{{ tradeNo }}</p>
        <el-button type="primary" @click="$router.push('/my/entitlement')">查看我的权益</el-button>
        <el-button @click="$router.push('/my/orders')">查看我的订单</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderNo = ref('')
const tradeNo = ref('')

onMounted(() => {
  orderNo.value = (route.query.orderNo as string) || (route.query.out_trade_no as string) || ''
  tradeNo.value = (route.query.tradeNo as string) || (route.query.trade_no as string) || ''
})
</script>

<style scoped>
.result-page {
  padding-top: 48px;
}
</style>
