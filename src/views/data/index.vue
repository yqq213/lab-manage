<template>
  <div class="wrapper">
    <div class="filter">
      <a-row :gutter="20" class="filter-left">
        <a-col style="min-width: 250px;">
          <a-range-picker v-model:value="queryDate" :placeholder="['开始时间', '结束时间']" valueFormat="YYYY-MM-DD" @change="pagination.current = 1, getList()"/>
        </a-col>
        <a-col>
          <a-select
            v-model:value="queryParam.deviceName"
            show-search
            allowClear
            :options="equipList"
            :filter-option="filterOption"
            :fieldNames="{
              label: 'name',
              value: 'name'
            }"
            placeholder="设备"
            @change="pagination.current = 1, getList()">
          </a-select>
        </a-col>
        <a-col>
          <a-select
            v-model:value="queryParam.labRoomName"
            show-search
            allowClear
            :options="labList"
            :filter-option="filterOption"
            :fieldNames="{
              label: 'name',
              value: 'name'
            }"
            placeholder="实验室"
            @change="pagination.current = 1, getList()">
          </a-select>
        </a-col>
        <a-col>
          <a-select
            v-model:value="queryParam.topicGroupName"
            show-search
            allowClear
            :options="groupList"
            :filter-option="filterOption"
            :fieldNames="{
              label: 'name',
              value: 'name'
            }"
            placeholder="分组"
            @change="pagination.current = 1, getList()">
          </a-select>
        </a-col>
        <a-col>
          <a-input-search v-model:value="queryParam.userName" enter-button placeholder="使用人员" @search="pagination.current = 1, getList()" />
        </a-col>
        <a-col>
          <a-select
            v-model:value="queryParam.examinerName"
            show-search
            allowClear
            :options="checkUserList"
            :filter-option="filterOption"
            :fieldNames="{
              label: 'name',
              value: 'name'
            }"
            placeholder="审核人员"
            @change="pagination.current = 1, getList()">
          </a-select>
        </a-col>
      </a-row>
      <a-button type="primary" :loading="exportLoading" @click="handleExport">
        <template #icon>
          <UploadOutlined />
        </template>
        导出
      </a-button>
    </div>
    <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
    <a-table
      size="middle"
      :dataSource="tableList"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="handleSizeChange">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'group'">
          <a-tag color="#1f9172">{{ text }}</a-tag>
        </template>
        <!-- <template v-if="column.dataIndex === 'deviceManagerNames'">
          <Member :list="record.deviceManagerNames || []" />
        </template> -->
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { getEquipList } from '@/api/equip/index'
import { getLabList } from '@/api/lab/index'
import { getGroupList } from '@/api/group/index'
import { getDataList } from '@/api/data/index'
import { userList } from '@/api/user/index'
import Member from '@/components/Member/index.vue'
import * as XLSX from 'xlsx'

const queryParam = reactive({})

const queryDate = ref([])

const selectedRowKeys = ref([])

const loading = ref(false)

const exportLoading = ref(false)

// 筛选条件列表
const equipList = ref([])
const labList = ref([])
const groupList = ref([])
const checkUserList = ref([])

const tableList = ref([])

const columns = [
  {
    title: '设备编号',
    align: 'center',
    dataIndex: 'deviceIdent',
    key: 'deviceIdent'
  },
  {
    title: '设备名称',
    align: 'center',
    dataIndex: 'deviceName',
    key: 'deviceName'
  },
  // {
  //   title: '设备管理人员',  // 会有多个，显示与之前页面一致
  //   align: 'center',
  //   dataIndex: 'deviceManagerNames',
  //   key: 'deviceManagerNames'
  // },
  {
    title: '实验室所在地',
    align: 'center',
    dataIndex: 'labRoomAddress',
    key: 'labRoomAddress'
  },
  {
    title: '价格(元/小时)',
    align: 'center',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '使用人员',
    align: 'center',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '审核人员',
    align: 'center',
    dataIndex: 'examinerName',
    key: 'examinerName'
  },
  {
    title: '人员分组',
    align: 'center',
    dataIndex: 'topicGroupName',
    key: 'topicGroupName'
  },
  {
    title: '预约日期',
    align: 'center',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: '上机时间',
    align: 'center',
    dataIndex: 'startTime',
    key: 'startTime'
  },
  {
    title: '下机时间',
    align: 'center',
    dataIndex: 'endTime',
    key: 'endTime'
  },
  {
    title: '时长(小时)',
    align: 'center',
    dataIndex: 'duration',
    key: 'duration'
  }
]

const pagination = ref({
  current: 1,
  total: 0,
  pageSize: 10,
  size: 'middle'
})

// select filter
function filterOption(input: string, option: any) {
  return option.name.includes(input)
}

// 分页
function handleSizeChange(page) {
  pagination.value = page
  getList()
}

function onSelectChange() {
  
}

// 获取列表
function getList() {
  loading.value = true
  const param = {
    order: '0',
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
    ...queryParam,
    startDate: queryDate.value?.[0],
    endDate: queryDate.value?.[1]
  }
  getDataList(param).then(({ data }) => {
    loading.value = false
    tableList.value = data.list || []
    pagination.value.total = Number(data.pageTotal)
  }).catch(() => { loading.value = false })
}

// 获取设备、实验室、分组、老师列表
function initFilterList() {
  getEquipList({ order: '0', page: 1, pageSize: 1000 }).then(({ data }) => {
    equipList.value = data.list || []
  })
  getLabList({ order: '0', page: 1, pageSize: 1000 }).then(({ data }) => {
    labList.value = data.list || []
  })
  getGroupList({ order: '0', page: 1, pageSize: 1000 }).then(({ data }) => {
    groupList.value = data.list || []
  })
  userList({ order: '0', page: 1, pageSize: 1000, role: '1', status: '0' }).then(({ data }) => {
    checkUserList.value = data.list
  })
}

// 导出
function handleExport() {
  exportLoading.value = true
  // 获取全部数据
  getDataList({ order: '0', page: 1, pageSize: 10000, ...queryParam, startDate: queryDate.value?.[0], endDate: queryDate.value?.[1] }).then(({ data }) => {
    const list = data.list || []
    // 表格数据
    const excelList = []
    // 获取表头数据
    const excelHead = columns.map(item => item.title)
    excelList.push(excelHead)
    const keyList = columns.map(v => v.dataIndex)
    list.forEach(item => {
      const excelRow = keyList.map(v => {
        return Array.isArray(item[v]) ? item[v].join(',') : item[v]
      })
      excelList.push(excelRow)
    })
    console.log(excelList)
    exportLoading.value = false
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(excelList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // 导出为 Excel 文件
    XLSX.writeFile(wb, 'data.xlsx');
  })
}

onMounted(() => {
  initFilterList()
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
      width: 90%;
      .flex(space-between, center);
      flex-wrap: nowrap;
      :deep(.ant-col) {
        flex: 1;
        .ant-select {
          width: 100%;
        }
      }
    }
  }
}
</style>