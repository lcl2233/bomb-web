<template>
  <div>
    <div class="toolbar">
      <h2>商品管理</h2>
      <el-button type="primary" @click="openDialog()">新增商品</el-button>
    </div>
    <el-table v-loading="loading" :data="products" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" min-width="120" />
      <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip />
      <el-table-column label="价格" width="100">
        <template #default="{ row }">{{ formatMoney(row.price) }}</template>
      </el-table-column>
      <el-table-column prop="durationDays" label="天数" width="80" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '上架' : '下架' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button link @click="toggleStatus(row)">{{ row.status === 1 ? '下架' : '上架' }}</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑商品' : '新增商品'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0.01" :precision="2" :step="1" />
        </el-form-item>
        <el-form-item label="有效天数" prop="durationDays">
          <el-input-number v-model="form.durationDays" :min="1" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct,
  adminUpdateProductStatus,
} from '@/api/product'
import { formatMoney } from '@/utils/format'
import type { ProductVO } from '@/types'

const loading = ref(false)
const saving = ref(false)
const products = ref<ProductVO[]>([])
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  description: '',
  price: 19.9,
  durationDays: 30,
  sortOrder: 0,
})
const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  durationDays: [{ required: true, message: '请输入有效天数', trigger: 'blur' }],
}

async function loadProducts() {
  loading.value = true
  try {
    const res = await adminListProducts(1, 50)
    products.value = res.data.records
  } finally {
    loading.value = false
  }
}

function openDialog(row?: ProductVO) {
  editingId.value = row?.id ?? null
  form.name = row?.name ?? ''
  form.description = row?.description ?? ''
  form.price = row?.price ?? 19.9
  form.durationDays = row?.durationDays ?? 30
  form.sortOrder = row?.sortOrder ?? 0
  dialogVisible.value = true
}

async function handleSave() {
  await formRef.value?.validate()
  saving.value = true
  try {
    const payload = { ...form }
    if (editingId.value) {
      await adminUpdateProduct(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await adminCreateProduct(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadProducts()
  } finally {
    saving.value = false
  }
}

async function toggleStatus(row: ProductVO) {
  const status = row.status === 1 ? 0 : 1
  await adminUpdateProductStatus(row.id, status)
  ElMessage.success('状态已更新')
  loadProducts()
}

async function handleDelete(id: number) {
  await ElMessageBox.confirm('确定删除该商品吗？', '提示', { type: 'warning' })
  await adminDeleteProduct(id)
  ElMessage.success('删除成功')
  loadProducts()
}

onMounted(loadProducts)
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
