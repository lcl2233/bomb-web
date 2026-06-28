<template>
  <div class="vpn-config-panel">
    <div class="panel-header">
      <span class="panel-title">WireGuard 配置</span>
      <el-tag v-if="clientName" type="info" size="small">{{ clientName }}</el-tag>
    </div>

    <el-alert
      type="info"
      :closable="false"
      show-icon
      title="导入步骤"
      description="复制下方配置 → 打开 WireGuard 客户端 → 导入隧道 → 连接即可使用。"
      class="tips"
    />

    <el-input
      :model-value="config"
      type="textarea"
      :rows="10"
      readonly
      class="config-input"
    />

    <div class="actions">
      <el-button type="primary" @click="copyConfig">复制配置</el-button>
      <el-button v-if="showDownload" @click="downloadConfig">下载 .conf</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const props = withDefaults(
  defineProps<{
    config: string
    clientName?: string
    showDownload?: boolean
  }>(),
  {
    showDownload: true,
  },
)

async function copyConfig() {
  try {
    await navigator.clipboard.writeText(props.config)
    ElMessage.success('配置已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}

function downloadConfig() {
  const filename = `${props.clientName || 'wireguard'}.conf`
  const blob = new Blob([props.config], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('配置文件已开始下载')
}
</script>

<style scoped>
.vpn-config-panel {
  margin-top: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
}

.tips {
  margin-bottom: 12px;
}

.config-input :deep(textarea) {
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 13px;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 12px;
}
</style>
