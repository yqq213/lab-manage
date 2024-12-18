<template>
  <a-modal
    title="设备列表"
    width="900px"
    :footer="null">
    <a-table size="middle" :dataSource="tableList" :columns="columns" :pagination="false" :scroll="{ y: 500 }"></a-table>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getEquipList, myDeviceList } from '@/api/equip/index'

const props = defineProps({
  labRoomId: {
    type: String,
    default: undefined
  },
  userId: {
    type: String,
    default: undefined
  }
})

const tableList = ref([])

const columns = [
  {
    title: '设备编号',
    align: 'center',
    width: '33.3%',
    dataIndex: 'ident',
    key: 'ident'
  },
  {
    title: '设备名称',
    align: 'center',
    width: '33.3%',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '收费标准（元/小时）',
    align: 'center',
    width: '33.3%',
    dataIndex: 'price',
    key: 'price'
  }
]

// 根据实验室查询设备列表
function getList() {
  getEquipList({ order: '0', page: 1, pageSize: 10000, labRoomId: props.labRoomId }).then(({ data }) => {
    tableList.value = data.list
  })
}

// 查询我的设备列表
function getMyDeviceList() {
  myDeviceList({ userId: props.userId }).then(({ data }) => {
    tableList.value = data.list
  })
}

watch(() => props.labRoomId, () => {
  getList()
})

watch(() => props.userId, () => {
  getMyDeviceList()
})

</script>

<style lang="less" scoped>

</style>