<template>
  <a-config-provider :locale="zhCN" :theme="theme">
    <routerView></routerView>
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const theme = {
  token: {
    colorPrimary: '#1f9172'
  }
}

</script>

<style lang="less" scoped>
.main-page {
  
}
</style>