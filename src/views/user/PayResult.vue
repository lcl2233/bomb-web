<template>
  <div class="result-page" v-loading="loading">
    <el-result
      :icon="resultIcon"
      :title="resultTitle"
      :sub-title="resultSubTitle"
    >
      <template #extra>
        <p v-if="orderNo">订单号：{{ orderNo }}</p>
        <p v-if="tradeNo">支付宝交易号：{{ tradeNo }}</p>

        <VpnConfigPanel
          v-if="entitlement?.vpnConfig"
          :config="entitlement.vpnConfig"
          :client-name="entitlement.vpnClientName"
          class="vpn-panel"
        />

        <div class="actions">
          <el-button
            v-if="status === 'provisioning'"
            :loading="true"
            type="primary"
          >
            正在生成 VPN 配置...
          </el-button>
          <el-button
            v-else-if="!entitlement?.vpnConfig"
            type="primary"
            @click="fetchEntitlement"
          >
            刷新配置
          </el-button>
          <el-button type="primary" @click="$router.push('/my/entitlement')">
            查看我的权益
          </el-button>
          <el-button @click="$router.push('/my/orders')">查看我的订单</el-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMyEntitlement } from '@/api/entitlement'
import VpnConfigPanel from '@/components/VpnConfigPanel.vue'
import type { EntitlementVO } from '@/types'

const route = useRoute()
const orderNo = ref('')
const tradeNo = ref('')
const loading = ref(false)
const entitlement = ref<EntitlementVO | null>(null)
const status = ref<'provisioning' | 'ready' | 'timeout'>('provisioning')

let pollTimer: number | undefined
let pollCount = 0
const maxPollCount = 30

const resultIcon = computed(() => {
  if (status.value === 'ready') return 'success'
  if (status.value === 'timeout') return 'warning'
  return 'info'
})

const resultTitle = computed(() => {
  if (status.value === 'ready') return '支付成功'
  if (status.value === 'timeout') return '支付成功，配置生成中'
  return '支付处理中'
})

const resultSubTitle = computed(() => {
  if (status.value === 'ready') {
    return 'VPN 配置已生成，请复制下方配置导入 WireGuard 客户端'
  }
  if (status.value === 'timeout') {
    return '权益已生效，VPN 配置仍在生成，请稍后到「我的权益」查看'
  }
  return '如已完成支付，权益和 VPN 配置将在片刻后生效'
})

async function fetchEntitlement() {
  loading.value = true
  try {
    const res = await getMyEntitlement()
    entitlement.value = res.data
    if (res.data?.vpnConfig) {
      status.value = 'ready'
      stopPolling()
    }
  } finally {
    loading.value = false
  }
}

function stopPolling() {
  if (pollTimer !== undefined) {
    window.clearInterval(pollTimer)
    pollTimer = undefined
  }
}

function startPolling() {
  stopPolling()
  pollTimer = window.setInterval(async () => {
    pollCount += 1
    await fetchEntitlement()
    if (status.value === 'ready' || pollCount >= maxPollCount) {
      if (status.value !== 'ready') {
        status.value = 'timeout'
      }
      stopPolling()
    }
  }, 2000)
}

onMounted(async () => {
  orderNo.value = (route.query.orderNo as string) || (route.query.out_trade_no as string) || ''
  tradeNo.value = (route.query.tradeNo as string) || (route.query.trade_no as string) || ''
  await fetchEntitlement()
  if (status.value !== 'ready') {
    startPolling()
  }
})

onBeforeUnmount(stopPolling)
</script>

<style scoped>
.result-page {
  padding-top: 48px;
}

.vpn-panel {
  max-width: 720px;
  margin: 0 auto 16px;
  text-align: left;
}

.actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}
</style>
