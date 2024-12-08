<template>
  <div class="header">
    <div class="header-left">
      <p class="header-title">{{ title }}</p>
      <div class="breadcrumb">首页/{{ $route.meta.title }}</div>
    </div>
    <a-dropdown>
      <a class="header-dropdown" @click.prevent>
        <span>{{ userInfo.name }}</span>
        <span class="iconfont icon-arrow-down"></span>
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="handleLogout">退出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { logout } from '@/api/user/index'

const { userInfo, clearUserInfo } = useUserStore()

const router = useRouter()

const title = ref(import.meta.env.VITE_GLOB_APP_TITLE)

function handleLogout() {
  logout().then(() => {
    clearUserInfo()
    router.push('/login')
  })
}

</script>

<style lang="less" scoped>
.header {
  height: @header-height;
  border-bottom: 1px solid #f2f4f6;
  padding: 10px 40px 10px 20px;
  .flex(space-between, center);
  &-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    color: @main-font-color;
  }
  .breadcrumb {
    font-size: 16px;
  }
  &-dropdown {
    font-size: 16px;
    cursor: pointer;
    line-height: 30px;
    .iconfont {
      font-size: 14px;
      margin-left: 8px;
    }
  }
}
</style>