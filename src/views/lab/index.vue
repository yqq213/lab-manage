<template>
  <div class="wrapper">
    <div class="filter">
      <span class="title">实验室管理</span>
      <a-button type="primary" @click="modalVisible = true, editObj = {}">
        <template #icon>
          <PlusOutlined />
        </template>
        添加实验室
      </a-button>
    </div>
    <a-table size="middle" :dataSource="tableList" :columns="columns" :loading="loading" :pagination="pagination" @change="handleSizeChange">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-button size="small" @click="handleEdit(record)">修改</a-button>
          <a-button size="small" type="primary" danger style="margin: 0 10px;" @click="handleDelete(record)">删除</a-button>
          <a-button size="small" type="primary" @click="handleEquip(record)">设备</a-button>
        </template>
      </template>
    </a-table>
    <!-- 添加/修改 -->
    <a-modal
      v-model:open="modalVisible"
      :title="editObj.id ? '修改实验室' : '添加实验室'"
      :afterClose="handleClose"
      @ok="handleOk">
      <a-form :model="formState" :rules="rules" ref="formRef" autocomplete="off" style="padding: 20px 0 10px 0;">
        <a-form-item name="name" label="实验室名称">
          <a-input v-model:value="formState.name" placeholder="输入实验室名称" />
        </a-form-item>
        <a-form-item name="address" label="实验室地址">
          <a-input v-model:value="formState.address" placeholder="输入实验室地址" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 设备列表modal -->
    <equip-list v-model:open="equipModalVisible" :labRoomId="currentLabId"></equip-list>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { ref, createVNode, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { getLabList, addLab, updateLab } from '@/api/lab/index'
import EquipList from './EquipList.vue'

const modalVisible = ref(false)

const loading = ref(false)

// 编辑对象
const editObj = ref({})

// 当前点击的实验室id
const currentLabId = ref()

// form
const formState = ref({})
const formRef = ref()
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '实验室名称不能为空！', trigger: 'blur' }],
  address: [{ required: true, message: '实验室地址不能为空！', trigger: 'blur' }]
}

const tableList = ref([])

const columns = [
  {
    title: '实验室名称',
    align: 'center',
    width: '33.3%',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '实验室地址',
    align: 'center',
    width: '33.3%',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '操作',
    align: 'center',
    width: '33.3%',
    dataIndex: 'action',
    key: 'action'
  }
]

// 分页
const pagination = ref({
  current: 1,
  total: 0,
  pageSize: 10,
  size: 'middle'
})

// 设备列表弹框
const equipModalVisible = ref(false)

// 列表
function getList() {
  loading.value = true
  getLabList({ order: '0', page: pagination.value.current, pageSize: pagination.value.pageSize }).then(res => {
    loading.value = false
    tableList.value = res.data.list
    pagination.value.total = Number(res.data.pageTotal)
  }).catch(() => { loading.value = false })
}

function handleSizeChange(page) {
  pagination.value = page
  getList()
}

// 编辑
function handleEdit(record) {
  modalVisible.value = true
  editObj.value = record
  formState.value.address = record.address
  formState.value.name = record.name
}

// 删除
function handleDelete(record) {
  Modal.confirm({
    title: '确定删除该项吗？',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      updateLab({...record, isDelete: 1}).then(() => {
        message.success('删除成功')
        getList()
      })
    },
  })
}

// 确定
function handleOk() {
  formRef.value.validate().then(() => {
    const isEditMode = !!editObj.value.id
    const api = isEditMode ? updateLab : addLab
    const param = formState.value
    if (isEditMode) param.id = editObj.value.id
    api(param).then(() => {
      isEditMode ? message.success('修改成功') : message.success('添加成功')
      modalVisible.value = false
      getList()
    })
  })
}

// 弹窗关闭
function handleClose() {
  formRef.value.resetFields()
  formState.value = {}
}

// 点击设备
function handleEquip(record) {
  currentLabId.value = record.id
  equipModalVisible.value = true
}

onMounted(() => {
  getList()
})

</script>

<style lang="less" scoped>
.wrapper {
  padding: 20px;
  .filter {
    .flex(space-between);
    margin-bottom: 20px;
    .title {
      font-size: 18px;
      color: @main-font-color;
      font-weight: bold;
    }
  }
}
</style>