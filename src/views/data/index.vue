<template>
  <div class="wrapper">
    <div class="filter">
      <a-row :gutter="20" class="filter-left">
        <a-col style="min-width: 250px;">
          <a-range-picker 
            :value="queryDate"
            :placeholder="['开始时间', '结束时间']"
            valueFormat="YYYYMMDD"
            :disabled-date="disabledDate"
            @openChange="onOpenChange"
            @calendarChange="onCalendarChange"
            @change="handleDateChange"
          />
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
            @change="pagination.current = 1, getList(), getStatistic()">
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
            @change="pagination.current = 1, getList(), getStatistic()">
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
            @change="pagination.current = 1, getList(), getStatistic()">
          </a-select>
        </a-col>
        <a-col>
          <a-input-search v-model:value="queryParam.userName" enter-button placeholder="使用人员" @search="pagination.current = 1, getList(), getStatistic()" />
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
            @change="pagination.current = 1, getList(), getStatistic()">
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
    <div class="statistic">
      <template v-if="queryParam.deviceName">
        <a-tag color="orange">单设备费用: {{ statisticData?.cost }}元</a-tag>
        <a-tag color="orange">单设备时长: {{ statisticData?.duration }}小时</a-tag>
      </template>
      <template v-else>
        <a-tag color="orange">总费用: {{ statisticData?.cost }}元</a-tag>
        <a-tag color="orange">总时长: {{ statisticData?.duration }}小时</a-tag>
      </template>
    </div>
    <a-table
      size="middle"
      :dataSource="tableList"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="handleSizeChange">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'costType'">
          <div v-if="record.costType === '0'">按小时计费</div>
          <div v-if="record.costType === '1'">按天计费</div>
          <div v-if="record.costType === '2'">按周计费</div>
        </template>
        <template v-if="column.dataIndex === 'customPrice'">
          <div v-if="record.costType === '0'">{{ record.price }}</div>
          <div v-if="record.costType === '1'">{{ record.priceDay }}</div>
          <div v-if="record.costType === '2'">{{ record.priceWeek }}</div>
        </template>
        <template v-if="column.dataIndex === 'date'">
          {{ dayjs(record.startDate).format('YYYY-MM-DD') + ' - ' + dayjs(record.endDate).format('YYYY-MM-DD') }}
        </template>
        <template v-if="column.dataIndex === 'openDate'">
          {{ dayjs(record.openDate).format('YYYY-MM-DD') + ' ' + record.startTime }}
        </template>
        <template v-if="column.dataIndex === 'closeDate'">
          {{ dayjs(record.closeDate).format('YYYY-MM-DD') + ' ' + record.endTime }}
        </template>
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
import { getDataList, statistValueApi } from '@/api/data/index'
import { userList } from '@/api/user/index'
import Member from '@/components/Member/index.vue'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

interface IOption {
  name: string,
  id: string,
}

const queryParam = reactive({})

const queryDate = ref([dayjs().format('YYYYMMDD'), dayjs().format('YYYYMMDD')])
const dates = ref([])

const selectedRowKeys = ref([])

const loading = ref(false)

const exportLoading = ref(false)

// 筛选条件列表
const equipList = ref<IOption[]>([])
const labList = ref<IOption[]>([])
const groupList = ref<IOption[]>([])
const checkUserList = ref<IOption[]>([])
const statisticData = ref<{
  cost: string,
  duration: string,
}>()

const tableList = ref([])

const columns = [
  {
    title: '设备编号',
    align: 'center',
    dataIndex: 'deviceIdent',
    key: 'deviceIdent',
    width: 120
  },
  {
    title: '设备名称',
    align: 'center',
    dataIndex: 'deviceName',
    key: 'deviceName',
    width: 120
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
    key: 'labRoomAddress',
    width: 120
  },
  {
    title: '使用人员',
    align: 'center',
    dataIndex: 'userName',
    key: 'userName',
    width: 100
  },
  {
    title: '审核人员',
    align: 'center',
    dataIndex: 'examinerName',
    key: 'examinerName',
    width: 100
  },
  {
    title: '人员分组',
    align: 'center',
    dataIndex: 'topicGroupName',
    key: 'topicGroupName',
    width: 120
  },
  {
    title: '预约日期',
    align: 'center',
    dataIndex: 'date',
    key: 'date',
    width: 120
  },
  {
    title: '上机时间',
    align: 'center',
    dataIndex: 'openDate',
    key: 'openDate',
    width: 100
  },
  {
    title: '下机时间',
    align: 'center',
    dataIndex: 'closeDate',
    key: 'closeDate',
    width: 100
  },
  {
    title: '时长(小时)',
    align: 'center',
    dataIndex: 'duration',
    key: 'duration',
    width: 100
  },
  {
    title: '费用(元)',
    align: 'center',
    dataIndex: 'cost',
    key: 'cost',
    width: 80
  },
  {
    title: '价格(元/小时)',
    align: 'center',
    dataIndex: 'price',
    key: 'price',
    width: 110
  },
  {
    title: '收费方式',
    align: 'center',
    dataIndex: 'costType',
    key: 'costType',
    width: 80
  },
  {
    title: '收费标准(元)',
    align: 'center',
    dataIndex: 'customPrice',
    key: 'customPrice',
    width: 110
  },
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

function handleDateChange(val) {
  queryDate.value = val
  pagination.value.current = 1
  getList()
  getStatistic()
}

function onOpenChange(open) {
  if (open) {
    dates.value = [] as any;
  }
}

function onCalendarChange(val) {
  dates.value = val
}

// 限制日期选择范围为90天
function disabledDate(current) {
  if (dates.value.length === 0) {
    return false
  }
  const tooLate = dates.value[0] && current.diff(dates.value[0], 'days') > 90;
  const tooEarly = dates.value[1] && dayjs(dates.value[1]).diff(current, 'days') > 90;
  return tooEarly || tooLate;
}

// 获取统计
function getStatistic() {
  statistValueApi({
    order: '0',
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
    ...queryParam,
    startDate: queryDate.value?.[0],
    endDate: queryDate.value?.[1],
    status: '0',
    costStatus: '1'
  }).then(({ data }) => {
    statisticData.value = data || {}
  })
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
    endDate: queryDate.value?.[1],
    status: '0',
    costStatus: '1'
  }
  getDataList(param).then(({ data }) => {
    loading.value = false
    tableList.value = data.list || []
    pagination.value.total = Number(data.pageTotal)
  }).catch(() => { loading.value = false })
}

// 获取设备、实验室、分组、老师列表
async function initFilterList() {
  await getEquipList({ order: '0', page: 1, pageSize: 1000 }).then(({ data }) => {
    equipList.value = data.list || []
  })
  await getLabList({ order: '0', page: 1, pageSize: 1000 }).then(({ data }) => {
    labList.value = data.list || []
  })
  await getGroupList({ order: '0', page: 1, pageSize: 1000 }).then(({ data }) => {
    groupList.value = data.list || []
  })
  await userList({ order: '0', page: 1, pageSize: 1000, role: '1', status: '0' }).then(({ data }) => {
    checkUserList.value = data.list
  })
}

// 导出
function handleExport() {
  exportLoading.value = true
  // 获取全部数据
  getDataList({
    order: '0',
    page: 1,
    pageSize: 10000,
    ...queryParam,
    startDate: queryDate.value?.[0],
    endDate: queryDate.value?.[1],
    status: '0',
    costStatus: '1'
  }).then(({ data }) => {
    const list = data.list || []
    // 表格数据
    const excelList = []
    // 获取表头数据
    const excelHead = columns.map(item => item.title)
    excelList.push(excelHead)
    const keyList = columns.map(v => v.dataIndex)
    list.forEach(item => {
      const excelRow = keyList.map(v => {
        if (Array.isArray(item[v])) {
          return item[v].join(',')
        } else if (v === 'date') {
          return dayjs(item['startDate']).format('YYYY-MM-DD') + ' - ' + dayjs(item['endDate']).format('YYYY-MM-DD')
        } else if (v === 'openDate') {
          return dayjs(item['openDate']).format('YYYY-MM-DD') + ' ' + item['startTime']
        } else if (v === 'closeDate') {
          return dayjs(item['closeDate']).format('YYYY-MM-DD') + ' ' + item['endTime']
        } else if (v === 'costType') {
          if (item['costType'] === '0') return '按小时计费'
          if (item['costType'] === '1') return '按天计费'
          if (item['costType'] === '2') return '按周计费'
          return ''
        } else if (v === 'customPrice') {
          if (item['costType'] === '0') return item['price']
          if (item['costType'] === '1') return item['priceDay']
          if (item['costType'] === '2') return item['priceWeek']
          return ''
        } else {
          return item[v]
        }
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

// 计算费用
// function getCost(record) {
//   return (Number(record.price) * Number(record.duration)).toFixed(2)
// }

onMounted(async () => {
  await initFilterList()
  getList()
  getStatistic()
})

</script>

<style lang="less" scoped>
.wrapper {
  padding: 20px;
  .filter {
    .flex(space-between);
    margin-bottom: 15px;
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
  .statistic {
    height: 50px;
    .flex(flex-start, center);
  }
}
</style>