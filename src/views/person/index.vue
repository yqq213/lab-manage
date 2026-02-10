<template>
  <div class="wrapper">
    <div class="filter">
      <a-row :gutter="20" class="filter-left">
        <a-col style="width: 200px;">
          <a-select v-model:value="currentRole" @change="changeRole">
            <a-select-option value="1">老师</a-select-option>
            <a-select-option value="0">学生</a-select-option>
            <a-select-option value="2">校外用户</a-select-option>
          </a-select>
        </a-col>
        <!-- <a-col :span="6">
          <a-select v-model:value="origin" placeholder="请选择数据来源">
            <a-select-option :value="1">自主注册</a-select-option>
            <a-select-option :value="2">平台对接</a-select-option>
          </a-select>
        </a-col> -->
        <a-col style="width: 200px;">
          <a-select v-model:value="auditStatus" placeholder="请选择审核状态" allowClear @change="pagination.current = 1, getList()">
            <a-select-option value="1">通过</a-select-option>
            <a-select-option value="0">未审核</a-select-option>
          </a-select>
        </a-col>
        <a-col style="width: 250px;">
          <a-input-search v-model:value="searchName" enter-button placeholder="输入姓名搜索" @search="pagination.current = 1, getList()" />
        </a-col>
      </a-row>
      <a-upload
        action=""
        :accept="'.xls,.xlsx'"
        :headers="{ 'X-Access-Token': token }"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :customRequest="customRequest"
      >
        <a-button :loading="uploadLoading" style="margin-right: 30px;">
          <template #icon>
            <UploadOutlined />
          </template>
          批量上传
        </a-button>
      </a-upload>
      <a-popconfirm title="是否通过审核？" ok-text="通过" cancel-text="取消" @confirm="handleBatchAudit" :disabled="!selectedRowKeys.length">
        <a-button style="margin-right: 30px;" :disabled="!selectedRowKeys.length">
        <template #icon>
          <AuditOutlined />
        </template>
        批量审核
      </a-button>
      </a-popconfirm>
      <a-button type="primary" @click="handleOperate('add')">
        <template #icon>
          <PlusOutlined />
        </template>
        <span v-if="currentRole == '1'">添加老师</span>
        <span v-if="currentRole == '0'">添加学生</span>
        <span v-if="currentRole == '2'">添加校外用户</span>
      </a-button>
    </div>
    <a-table
      size="middle"
      :dataSource="tableList"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      :row-selection="{ selectedRowKeys, columnWidth: 60, onChange: onSelectChange }"
      @change="handleSizeChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-switch :checked="record.status === '0'" class="mg10" @change="changeSwitch(record)"></a-switch>
          <a-button size="small" @click="handleOperate('view', record)" class="mg10">详情</a-button>
          <a-button size="small" type="primary" @click="handleOperate('edit', record)" class="mg10">修改</a-button>
          <a-popconfirm title="是否通过审核？" ok-text="通过" cancel-text="取消" @confirm="handleAudit('1', record)" :disabled="record.permission == '1'">
            <a-button size="small" type="primary" class="mg10" :disabled="record.permission == '1'">审核</a-button>
          </a-popconfirm>
          <a-button size="small" type="primary" class="mg10" v-if="currentRole == '1'" @click="handleEquip(record)">设备</a-button>
          <a-button size="small" type="primary" danger @click="handleResetPwd(record)" class="mg10" v-if="currentRole == '1'">重置密码</a-button>
        </template>
      </template>
    </a-table>
    <!-- 添加/修改 -->
    <Add v-model="addModalVisible" :mode="mode" :role="currentRole" :row="rowObj" @close="rowObj = {}" @refresh="pagination.current = 1, getList()"></Add>
    <!-- 设备列表modal -->
    <equip-list v-model:open="equipModalVisible" :userId="currentEquip.id"></equip-list>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, AuditOutlined } from '@ant-design/icons-vue'
import { ref, createVNode, computed, onMounted, h } from 'vue'
import { Modal, message, Tag } from 'ant-design-vue'
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons-vue'
import Add from './Add.vue'
import EquipList from '../lab/EquipList.vue'
import { userList, updateUser, resetPwd, batchRegist, audit, batchExamine } from '@/api/user/index'
import { Storage } from '@/utils/storage'
import * as XLSX from 'xlsx'

const loading = ref(false)

const uploadLoading = ref(false)

// 老师or学生   1: 老师  0: 学生
const currentRole = ref('1')

// 审核状态
const auditStatus = ref(null)

// 数据来源
// const origin = ref(null)

// 搜索名称
const searchName = ref('')

// 添加、详情、编辑弹框
const addModalVisible = ref(false)

// view、edit、add
const mode = ref('')

// 选中的记录
const rowObj = ref({})

// 当前点击的设备按钮
const currentEquip = ref({})


// 设备列表modal
const equipModalVisible = ref(false)

// 当前列
const columns = computed(() => currentRole.value == '1' ? teacherColumns : currentRole.value == '0' ? studentColumns : externUserColumns)

// data
const tableList = ref([])

// token
const token = Storage.get('token')

// 选中的记录
const selectedRowKeys = ref([])

// 教师表格
const teacherColumns = [
  {
    title: '老师编号',
    align: 'center',
    width: 150,
    dataIndex: 'ident',
    key: 'ident'
  },
  {
    title: '老师姓名',
    align: 'center',
    width: 150,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '老师电话',
    align: 'center',
    width: 150,
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '审核状态',
    align: 'center',
    width: 150,
    dataIndex: 'permission',
    key: 'permission',
    customRender: ({ text }) => {
      return text == '1' ? h(Tag, { color: '#87d068' }, '通过') : text == '0' ? h(Tag, { color: '#f5222d' }, '未审核') : ''
    }
  },
  {
    title: '操作',
    align: 'center',
    width: 300,
    dataIndex: 'action',
    key: 'action'
  }
]

// 学生表格
const studentColumns = [
  {
    title: '学生编号',
    align: 'center',
    width: 150,
    dataIndex: 'ident',
    key: 'ident'
  },
  {
    title: '学生姓名',
    align: 'center',
    width: 150,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '学生电话',
    align: 'center',
    width: 150,
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '导师姓名',
    align: 'center',
    width: 150,
    dataIndex: 'tutor',
    key: 'tutor'
  },
  {
    title: '审核状态',
    align: 'center',
    width: 150,
    dataIndex: 'permission',
    key: 'permission',
    customRender: ({ text }) => {
      return text == '1' ? h(Tag, { color: '#87d068' }, '通过') : text == '0' ? h(Tag, { color: '#f5222d' }, '未审核') : ''
    }
  },
  {
    title: '操作',
    align: 'center',
    width: 300,
    dataIndex: 'action',
    key: 'action'
  }
]

// 校外用户表格
const externUserColumns = [
  {
    title: '用户姓名',
    align: 'center',
    width: 150,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '手机号',
    align: 'center',
    width: 150,
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '公司',
    align: 'center',
    width: 200,
    dataIndex: 'enterprice',
    key: 'enterprice'
  },
  {
    title: '审核状态',
    align: 'center',
    width: 150,
    dataIndex: 'permission',
    key: 'permission',
    customRender: ({ text }) => {
      return text == '1' ? h(Tag, { color: '#87d068' }, '通过') : text == '0' ? h(Tag, { color: '#f5222d' }, '未审核') : ''
    }
  },
  {
    title: '操作',
    align: 'center',
    width: 300,
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

// 切换角色
function changeRole() {
  pagination.value.current = 1
  getList()
  selectedRowKeys.value = [] // 清空勾选
}

// 获取列表
function getList() {
  loading.value = true
  userList({ order: '0', page: pagination.value.current, pageSize: pagination.value.pageSize, name: searchName.value, role: currentRole.value, permission: auditStatus.value }).then(({ data }) => {
    loading.value = false
    tableList.value = data.list
    pagination.value.total = Number(data.pageTotal)
  }).catch(() => { loading.value = false })
}

// 分页事件
function handleSizeChange(page) {
  pagination.value = page
  getList()
}

// 详情、新增、编辑
function handleOperate(type, record = {}) {
  addModalVisible.value = true
  mode.value = type
  rowObj.value = record
}

// 重置密码
function handleResetPwd(record) {
  Modal.confirm({
    title: '确定要重置密码吗？',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      resetPwd({ id: record.id }).then(() => {
        message.success('重置密码成功')
        getList()
      })
    },
  })
}

// 切换状态
function changeSwitch(record) {
  record.status == '0' ? record.status = '1' : record.status == '1' ? record.status = '0' : ''
  updateUser(record).then(() => {
    message.success('修改成功')
    getList()
  })
}

// 查看设备
function handleEquip(record) {
  equipModalVisible.value = true
  currentEquip.value = record
}

// 审核
function handleAudit(status, record) {
  audit({ id: record.id, permission: status }).then(() => {
    message.success('审核成功')
    getList()
  })
}

// 批量审核
function handleBatchAudit() {
  batchExamine({ users: selectedRowKeys.value.map(item => ({ id: item, permission: '1' })) }).then((res) => {
    if (res.code == '200') {
      message.success(`批量审核完成，成功${res.data.successCount}个，失败${res.data.failureCount}个`)
      getList()
      selectedRowKeys.value = [] // 清空勾选
    } else {
      message.error('批量审核失败')
    }
  })
}

// 多选
function onSelectChange(selected) {
  selectedRowKeys.value = selected
}

// 上传文件校验
function beforeUpload(file) {
  if (!/excel|spreadsheet/.test(file.type)) {
    message.error('请上传excel文件')
    return false
  }
  return true
}

// 自定义上传
function customRequest({file, onSuccess, onError}) {
  uploadLoading.value = true
  // 读取excel文件数据
  const reader = new FileReader()
  reader.onload = function(e) {
    const data = e.target.result
    const workbook = XLSX.read(data, { type: 'binary' })
    // 读取第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // 将工作表数据转换为 JSON 格式
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // 去除表格头部
    jsonData.shift()
    console.log(jsonData)
    // 封装数据
    const param = jsonData.map(item => {
      const obj = {}
      const columnTeacherMap = [{ name: '老师编号', key: 'ident' }, { name: '老师姓名', key: 'name' }, { name: '老师手机', key: 'phone' }, { name: '老师性别', key: 'gender' }, { name: '老师院系', key: 'department' }]
      const columnStudentMap = [{ name: '学生编号', key: 'ident' }, { name: '学生姓名', key: 'name' }, { name: '学生手机', key: 'phone' }, { name: '学生性别', key: 'gender' }, { name: '学生院系', key: 'department' }, { name: '学生年级', key: 'grade' }, { name: '学生导师', key: 'tutor' }]
      const columnExternUserMap = [{ name: '用户姓名', key: 'name' }, { name: '用户手机', key: 'phone' }, { name: '用户性别', key: 'gender' }, { name: '公司名称', key: 'enterprice' }]
      item.forEach((v, i) => {
        try {
          if (currentRole.value === '1') obj[columnTeacherMap[i]['key']] = v
          if (currentRole.value === '0') obj[columnStudentMap[i]['key']] = v
          if (currentRole.value === '2') obj[columnExternUserMap[i]['key']] = v
        } catch (error) {
          message.error('请上传正确的excel模板')
          uploadLoading.value = false
          throw new Error('请上传正确的excel模板')
        }
      })
      if (currentRole.value === '2') {
        obj.account = obj.phone
        obj.ident = obj.phone
      } else {
        obj.account = obj.ident
      }
      obj.password = '!User234'
      obj.role = currentRole.value
      obj.gender === '男' ? obj.gender = '1' : obj.gender === '女' ? obj.gender = '2' : obj.gender = undefined
      obj.permission = '1'
      return obj
    })
    batchRegist({ users: param }).then(({ data }) => {
      message.success(`上传成功${data.successCount}个，失败${data.failureCount}个，已存在${data.existCount}个`)
      getList()
    }).finally(() => {
      uploadLoading.value = false
    })
  }
  reader.readAsBinaryString(file)
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
    &-left {
      width: 60%;
      flex: 1;
      :deep(.ant-select) {
        width: 100%;
      }
    }
    .title {
      font-size: 18px;
      color: @main-font-color;
      font-weight: bold;
    }
  }
  .mg10 {
    margin-right: 10px;
  }
}
</style>