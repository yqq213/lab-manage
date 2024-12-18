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
            <a-select-option :value="2">分组1</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-input-search v-model:value="queryParam.userName" enter-button placeholder="使用人员" @search="pagination.current = 1, getList()" />
        </a-col>
      </a-row>
      <a-button type="primary" @click="handleExport">
        <template #icon>
          <UploadOutlined />
        </template>
        导出
      </a-button>
    </div>
    <a-table
      size="middle"
      :dataSource="tableList"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="handleSizeChange"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'group'">
          <a-tag color="#1f9172">{{ text }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'deviceManagerNames'">
          <Member :list="record.deviceManagerNames || []" />
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
import { getDataList } from '@/api/data/index'
import Member from '@/components/Member/index.vue'

const queryParam = reactive({})

const queryDate = ref([])

const selectedRowKeys = ref([])

const loading = ref(false)

// 筛选条件列表
const equipList = ref([])
const labList = ref([])
const groupList = ref([])

const tableList = ref([])
// const tableList = ref([
//   {
//     deviceIdent: '123456',
//     deviceName: '测试设备名称',
//     deviceManagerNames: ['薛亚亚', '周成功', '汪剑剑', '杨庆庆'],
//     labRoomAddress: '实验室一楼实验室一楼实验室一楼实验室一楼实验室一楼',
//     price: 100,
//     userName: '薛亚亚',
//     examinerName: '周成功',
//     topicGroupName: '分组一',
//     startTime: '2024-01-01',
//     endTime: '2024-01-01',
//     duration: '20'
//   }
// ])

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
  {
    title: '设备维护人员',  // 会有多个，显示与之前页面一致
    align: 'center',
    dataIndex: 'deviceManagerNames',
    key: 'deviceManagerNames'
  },
  {
    title: '实验室所在地',
    align: 'center',
    dataIndex: 'labRoomAddress',
    key: 'labRoomAddress'
  },
  {
    title: '价格',
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
    title: '时长',
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

// 获取设备、实验室、分组列表
function initFilterList() {
  getEquipList({ order: '0', page: 1, pageSize: 10000 }).then(({ data }) => {
    equipList.value = data.list || []
  })
  getLabList({ order: '0', page: 1, pageSize: 10000 }).then(({ data }) => {
    labList.value = data.list || []
  })
  getGroupList({ order: '0', page: 1, pageSize: 10000 }).then(({ data }) => {
    groupList.value = data.list || []
  })
}

// 导出
function handleExport() {

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
      width: 85%;
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