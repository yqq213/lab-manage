<template>
  <div class="wrapper">
    <div class="filter">
      <a-button type="primary" @click="modalVisible = true, editObj = {}">
        <template #icon>
          <PlusOutlined />
        </template>
        新建分组
      </a-button>
    </div>
    <a-table
      size="middle"
      :dataSource="tableList"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="handleSizeChange">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <a-tag color="#1f9172">{{ text }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'managerId'">
          <span>{{ teacherList.find(v => v.id === record.managerId)?.name }}</span>
        </template>
        <template v-if="column.dataIndex === 'teacherMembers'">
          <Member :list="record.teacherMembers ? record.teacherMembers.map(v => v.name) : []" />
        </template>
        <template v-if="column.dataIndex === 'studentMembers'">
          <Member :list="record.studentMembers ? record.studentMembers.map(v => v.name) : []" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-button size="small" @click="handleEdit(record)">编辑</a-button>
          <a-button size="small" type="primary" danger style="margin: 0 10px;" @click="handleDelete(record)">删除</a-button>
        </template>
      </template>
    </a-table>
    <!-- 添加/修改 -->
    <a-modal
      v-model:open="modalVisible"
      width="700px"
      :title="editObj.id ? '修改分组' : '添加分组'"
      :afterClose="handleClose"
      @ok="handleOk">
      <a-form :model="formState" :rules="rules" ref="formRef" autocomplete="off" :labelCol="{ style: { width: '90px' } }" style="padding: 30px 50px;">
        <a-form-item name="name" label="分组名称">
          <a-input v-model:value="formState.name" placeholder="输入分组名称" />
        </a-form-item>
        <a-form-item name="managerId" label="组长">
          <a-select v-model:value="formState.managerId" placeholder="请选择组长">
            <a-select-option :value="item.id" v-for="item in teacherList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="teacherMembers" label="教师组员">
          <a-select v-model:value="formState.teacherMembers" mode="multiple" placeholder="请选择教师组员">
            <a-select-option :value="item.id" v-for="item in teacherList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="studentMembers" label="学生组员">
          <a-select v-model:value="formState.studentMembers" mode="multiple" placeholder="请选择学生组员">
            <a-select-option :value="item.id" v-for="item in studentList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { createVNode, onMounted, reactive, ref } from 'vue'
import { getGroupList, addGroup, editGroup } from '@/api/group/index'
import { userList } from '@/api/user/index'
import type { Rule } from 'ant-design-vue/es/form'
import { message, Modal } from 'ant-design-vue'
import Member from '@/components/Member/index.vue'

const pagination = ref({
  current: 1,
  total: 0,
  pageSize: 10,
  size: 'middle'
})

const tableList = ref([])

const loading = ref(false)

const columns = [
  {
    title: '分组',
    align: 'center',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '组长',
    align: 'center',
    dataIndex: 'managerId',
    key: 'managerId'
  },
  {
    title: '教师组员',
    align: 'center',
    dataIndex: 'teacherMembers',
    key: 'teacherMembers'
  },
  {
    title: '学生组员',
    align: 'center',
    dataIndex: 'studentMembers',
    key: 'studentMembers'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    key: 'action'
  },
]

const modalVisible = ref(false)
const editObj = ref({})
const formRef = ref()
const formState = ref({})
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '分组名称不能为空！', trigger: 'blur' }],
  managerId: [{ required: true, message: '组长不能为空！', trigger: 'change' }],
  teacherMembers: [{ required: true, message: '教师组员不能为空！', trigger: 'change' }],
  studentMembers: [{ required: true, message: '学生组员不能为空！', trigger: 'change' }],
}

const teacherList = ref([])
const studentList = ref([])

let studentMembersBak = []  // 编辑时备份学生成员
let teacherMembersBak = []  // 编辑时备份老师成员

// 获取列表
function getList() {
  const param = {
    order: '0',
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
  }
  loading.value = true
  getGroupList(param).then(({ data }) => {
    loading.value = false
    tableList.value = data.list || []
    pagination.value.total = Number(data.pageTotal)
  }).catch(() => { loading.value = false })
}

function handleSizeChange(page) {
  pagination.value = page
  getList()
}

// 点击编辑
function handleEdit(record) {
  editObj.value = record
  modalVisible.value = true
  formState.value = JSON.parse(JSON.stringify(record))
  // 格式化teacherMembers与studentMembers
  record.studentMembers ? formState.value.studentMembers = formState.value.studentMembers.map(v => v.id) : formState.value.studentMembers = []
  record.teacherMembers ? formState.value.teacherMembers = formState.value.teacherMembers.map(v => v.id) : formState.value.teacherMembers = []
  // 编辑时将studentMembers与teacherMembers提前存储，方便提交时对比，判断出要删除的数据
  studentMembersBak = [...formState.value.studentMembers]
  teacherMembersBak = [...formState.value.teacherMembers]
  console.log(studentMembersBak, teacherMembersBak)
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
      editGroup({id: record.id, isDelete: 1}).then(() => {
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
    const isEditMode = !!editObj.value.id
    const api = isEditMode ? editGroup : addGroup
    const param = formState.value
    if (isEditMode) {
      param.id = editObj.value.id
      // 获取老师或学生组员中删除的数据
      param.delStudentMembers = studentMembersBak.filter(v => !formState.value.studentMembers.includes(v))
      param.delTeacherMembers = teacherMembersBak.filter(v => !formState.value.teacherMembers.includes(v))
    } else {
      param.delStudentMembers = []
      param.delTeacherMembers = []
    }
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

// 教师列表
async function getAllTeacher() {
  const { data } = await userList({ order: '0', page: 1, pageSize: 10000, status: '0' })
  teacherList.value = data.list.filter(v => v.role == '1')
  studentList.value = data.list.filter(v => v.role == '0')
}

onMounted(async () => {
  await getAllTeacher()
  getList()
})

</script>

<style lang="less" scoped>
.wrapper {
  padding: 20px;
  .filter {
    text-align: right;
    margin-bottom: 20px;
  }
}
</style>