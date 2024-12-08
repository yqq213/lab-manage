<template>
  <div class="wrapper" v-if="!editMode">
    <div class="filter">
      <a-input-search
        v-model:value="search"
        placeholder="输入设备名称"
        enter-button
        @search="pagination.current = 1, getList()"
        style="width: 300px;"
      />
      <a-button type="primary" @click="editMode = true, editObj = {}">
        <template #icon>
          <PlusOutlined />
        </template>
        添加设备
      </a-button>
    </div>
    <a-table size="middle" :dataSource="tableList" :columns="columns" :loading="loading" :pagination="pagination" @change="handleSizeChange">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-button size="small" @click="handleEdit(record)">修改</a-button>
          <a-button size="small" type="primary" danger style="margin: 0 10px;" @click="handleDelete(record)">删除</a-button>
          <a-button size="small" type="primary" @click="handleAssign(record)">管理人员</a-button>
        </template>
      </template>
    </a-table>
    <!-- 管理人员 -->
    <a-modal
      v-model:open="modalVisible"
      title="分配老师"
      :afterClose="handleClose"
      @ok="handleOk">
      <a-form :model="formState" ref="formRef" :rules="rules" autocomplete="off" style="padding: 20px 0 10px 0;">
        <a-form-item name="userId">
          <a-select allowClear v-model:value="formState.userId" placeholder="选择老师" size="large">
            <a-select-option v-for="item in allTeacher" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- 添加/修改 -->
  <Add v-else :editObj="editObj" @close="handleCloseAdd"></Add>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { reactive, ref, createVNode, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import Add from './Add.vue'
import { getEquipList, editEquip, addManager, delManager } from '@/api/equip/index'
import { userList } from '@/api/user/index'

const search = ref('')

const loading = ref(false)

// 是否新增/编辑状态
const editMode = ref(false)

// 编辑对象
const editObj = ref({})

const modalVisible = ref(false)

const formState = reactive({
  userId: null
})

const allTeacher = ref([])

const formRef = ref()
const rules: Record<string, Rule[]> = {
  userId: [{ required: true, message: '请选择老师', trigger: 'change' }],
}

const tableList = ref([])

const columns = [
  {
    title: '设备编号',
    align: 'center',
    width: '25%',
    dataIndex: 'ident',
    key: 'ident'
  },
  {
    title: '设备名称',
    align: 'center',
    width: '25%',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '收费标准（元/h）',
    align: 'center',
    width: '25%',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '操作',
    align: 'center',
    width: '25%',
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

function handleSizeChange(page) {
  pagination.value = page
  getList()
}

// 获取列表
function getList() {
  loading.value = true
  getEquipList({ order: '0', page: pagination.value.current, pageSize: pagination.value.pageSize, name: search.value }).then(res => {
    loading.value = false
    tableList.value = res.data.list
    pagination.value.total = Number(res.data.pageTotal)
  }).catch(() => { loading.value = false })
}

// 编辑
function handleEdit(record) {
  editMode.value = true
  editObj.value = record
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
      editEquip({ id: record.id, isDelete: 1 }).then(() => {
        message.success('删除成功')
        pagination.value.current = 1
        getList()
      })
    },
  })
}

// 确定
function handleOk() {
  formRef.value.validate().then(() => {
    // const api = formState.userId ? addManager : delManager

    addManager({ deviceId: editObj.value.id, userId: formState.userId }).then(() => {
      // formState.userId ? message.success('分配老师成功') : message.success('取消分配老师成功')
      message.success('分配老师成功')
      modalVisible.value = false
      getList()
    })
  })
}

// 弹窗关闭
function handleClose() {
  formRef.value.resetFields()
}

// 关闭新增、编辑页面
function handleCloseAdd() {
  editMode.value = false
  pagination.value.current = 1
  getList()
}

// 分配管理人员
function handleAssign(record) {
  editObj.value = record
  modalVisible.value = true
  // 确保老师状态及时更新
  getAllTeacher()
}

// 获取所有老师
function getAllTeacher() {
  userList({ order: '0', page: 1, pageSize: 10000, role: '1' }).then(({ data }) => {
    allTeacher.value = data.list
  })
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
    
  }
}
</style>