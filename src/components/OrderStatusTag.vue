<template>
  <el-tag :type="orderStatusType(status)">{{ orderStatusText(status) }}</el-tag>
</template>

<script setup lang="ts">
import { orderStatusText, orderStatusType } from '@/utils/format'

defineProps<{ status: string }>()
</script>
