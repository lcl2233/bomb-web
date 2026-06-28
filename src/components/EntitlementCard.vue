<template>
  <el-card shadow="never" class="entitlement-card">
    <div class="header">
      <span class="title">{{ entitlement.productName }}</span>
      <el-tag :type="entitlement.status === 'ACTIVE' ? 'success' : 'info'">
        {{ entitlementStatusText(entitlement.status) }}
      </el-tag>
    </div>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="开始时间">{{ formatDateTime(entitlement.startAt) }}</el-descriptions-item>
      <el-descriptions-item label="到期时间">{{ formatDateTime(entitlement.expireAt) }}</el-descriptions-item>
      <el-descriptions-item label="剩余天数">
        <span class="remaining">{{ entitlement.remainingDays }} 天</span>
      </el-descriptions-item>
    </el-descriptions>

    <VpnConfigPanel
      v-if="entitlement.vpnConfig"
      :config="entitlement.vpnConfig"
      :client-name="entitlement.vpnClientName"
    />
    <el-alert
      v-else-if="entitlement.status === 'ACTIVE'"
      type="warning"
      :closable="false"
      show-icon
      title="VPN 配置生成中"
      description="支付成功后配置需要几秒钟生成，请稍后刷新本页。"
      class="vpn-pending"
    />
  </el-card>
</template>

<script setup lang="ts">
import type { EntitlementVO } from '@/types'
import VpnConfigPanel from '@/components/VpnConfigPanel.vue'
import { entitlementStatusText, formatDateTime } from '@/utils/format'

defineProps<{ entitlement: EntitlementVO }>()
</script>

<style scoped>
.entitlement-card {
  margin-bottom: 16px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
.remaining {
  color: #67c23a;
  font-weight: 700;
  font-size: 18px;
}
.vpn-pending {
  margin-top: 16px;
}
</style>
