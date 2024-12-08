<template>
  <div class="menu">
    <div class="menu-header">
      <span>中国药科大学</span>
    </div>
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :items="items"
      @click="handleClickItem"
      style="width: 220px;"
    >
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { ItemType } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
// import { subRoute } from '@/router/index'

const route = useRoute()
const router = useRouter()

const items: ItemType[] = reactive([
  {
    key: 'lab',
    icon: () => h('span', { class: 'iconfont icon-shiyanshiguanli' }, ''),
    label: '实验室管理',
    title: '实验室管理',
  },
  {
    key: 'equip',
    icon: () => h('span', { class: 'iconfont icon-shebei' }, ''),
    label: '设备管理',
    title: '设备管理',
  },
  {
    key: 'person',
    icon: () => h('span', { class: 'iconfont icon-renyuanguanli' }, ''),
    label: '人员管理',
    title: '人员管理',
  },
  {
    key: 'group',
    icon: () => h('span', { class: 'iconfont icon-fenzuguanli' }, ''),
    label: '分组管理',
    title: '分组管理',
    // children: [
    //   {
    //     key: 'group-person',
    //     label: '人员分组',
    //     title: '人员分组'
    //   }
    // ]
  },
  {
    key: 'data',
    icon: () => h('span', { class: 'iconfont icon-shujuguanli' }, ''),
    label: '数据管理',
    title: '数据管理',
  }
])

const selectedKeys = ref([route.name])

function handleClickItem({key}) {
  router.push({ name: key })
}

</script>

<style lang="less" scoped>
.menu {
  &-header {
    height: @header-height;
    background: url('@/assets/images/header_logo.png') center no-repeat;
    background-size: 100% 100%;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
    .flex();
    span {
      position: relative;
      left: 30px;
    }
  }
  :deep(.iconfont) {
    font-size: 20px;
    color: @base-font-color;
  }
  :deep(.ant-menu) {
    .ant-menu-item {
      height: 50px;
      line-height: 50px;
    }
    .ant-menu-title-content, .ant-menu-submenu-arrow {
      color: @base-font-color;
    }
    .ant-menu-item-selected {
      background: @primary-color;
      .ant-menu-title-content, .ant-menu-submenu-arrow, .iconfont {
        color: #fff;
      }
    }
  }
}
</style>