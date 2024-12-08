<template>
  <div class="layout">
    <Menu class="layout-left"></Menu>
    <div class="layout-right">
      <Header class="layout-header"></Header>
      <div class="layout-container">
        <router-view class="layout-inner"></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from './Menu.vue'
import Header from './Header.vue' 
import { ref } from 'vue'


</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  display: flex;
  &-left {
    flex-shrink: 0;
  }
  &-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  &-header {
    flex-shrink: 0;
  }
  &-container {
    height: calc(100% - @header-height);
    padding: 20px;
    background: #f2f4f6;
  }
  &-inner {
    background: #fff;
    height: 100%;
    overflow-y: auto;
  }
}
</style>