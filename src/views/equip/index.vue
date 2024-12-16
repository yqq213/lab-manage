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
        <template v-if="column.dataIndex === 'managers'">
          <a-tooltip placement="top" v-if="record.managers">
            <template #title v-if="record.managers.length > 5">
              <span>{{ getManagers(record.managers, false) }}</span>
            </template>
            <div>{{ getManagers(record.managers, true) }}</div>
          </a-tooltip>
        </template>
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
      width="800px"
      :afterClose="handleClose"
      :footer="null">
      <div class="add-form">
        <a-select allowClear v-model:value="formState.userId" placeholder="请选择要分配的老师" style="width: 300px; margin-right: 20px;">
          <a-select-option v-for="item in allTeacher" :key="item.id" :value="item.id" :disabled="editObj.managers && editObj.managers.includes(item.id)">{{ item.name }}</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleAdd">添加</a-button>
      </div>
      <div class="add-list" v-if="editObj.managers">
        <li v-for="item in editObj.managers" :key="item">
          <div class="tag">{{ allTeacher.find(v => v.id === item)?.name }}</div>
          <MinusCircleOutlined class="del-icon" @click="handleDelManager(item)"/>
        </li>
      </div>
      <a-empty :image="simpleImage" v-else />
    </a-modal>
  </div>
  <!-- 添加/修改 -->
  <Add v-else :editObj="editObj" @close="handleCloseAdd"></Add>
</template>

<script setup lang="ts">
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
import { reactive, ref, createVNode, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { message, Modal, Empty } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import Add from './Add.vue'
import { getEquipList, editEquip, addManager, delManager } from '@/api/equip/index'
import { userList } from '@/api/user/index'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

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

const tableList = ref([])

const columns = [
  {
    title: '设备编号',
    align: 'center',
    dataIndex: 'ident',
    key: 'ident'
  },
  {
    title: '设备名称',
    align: 'center',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '收费标准（元/h）',
    align: 'center',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '管理人员',
    align: 'center',
    dataIndex: 'managers',
    key: 'managers'
  },
  {
    title: '操作',
    align: 'center',
    width: '220px',
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

// 获取管理人员
function getManagers(list, showEllipse) {
  const nameList = list.map(v => allTeacher.value.find(i => i.id === v)?.name)
  return showEllipse && list.length > 5 ? `${nameList.slice(0, 5)?.join('、')}...` : nameList.join('、')
}

function handleSizeChange(page) {
  pagination.value = page
  getList()
}

// 获取列表
function getList() {
  loading.value = true
  return getEquipList({ order: '0', page: pagination.value.current, pageSize: pagination.value.pageSize, name: search.value }).then(res => {
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

// 添加老师
function handleAdd() {
  if (!formState.userId) return message.error('请选择要分配的老师')
  addManager({ deviceId: editObj.value.id, userId: formState.userId }).then(() => {
    message.success('分配老师成功')
    getList().then(() => {
      // 更新editObj对象数据
      editObj.value = tableList.value.find(v => v.id === editObj.value.id)
    })
  })
}

// 移除老师
function handleDelManager(id) {
  delManager({ deviceId: editObj.value.id, userId: id }).then(() => {
    message.success('移除成功')
    getList().then(() => {
      // 更新editObj对象数据
      editObj.value = tableList.value.find(v => v.id === editObj.value.id)
    })
  })
}

// 弹窗关闭
function handleClose() {
  formState.userId = null
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
}

onMounted(async () => {
  // 获取所有老师
  const { data } = await userList({ order: '0', page: 1, pageSize: 10000, role: '1', status: '0' })
  allTeacher.value = data.list
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
.add-form {
  padding: 30px;
  margin: 0 30px 30px 30px;
  border-bottom: 1px solid #d9d9d9;
  .flex();
}
.add-list {
  padding: 0 20px 20px 20px;
  display: flex;
  flex-wrap: wrap;
  li {
    .flex(center, center, column);
    margin-bottom: 20px;
    .tag {
      padding: 5px 10px;
      background: @primary-color;
      margin: 0 15px;
      color: #fff;
      border-radius: 3px;
      margin-bottom: 7px;
    }
    .del-icon {
      color: @error-color;
      cursor: pointer;
    }
  }
}
</style>