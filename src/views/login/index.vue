<template>
  <div class="login">
    <!-- <img src="@/assets/images/school_logo.png" class="login-logo"> -->
    <div class="login-wrap">
      <p class="login-title">欢迎登录实验室管理系统</p>
      <p class="login-sub_title">WELCOME</p>
      <div class="login-input_wrap" style="margin-bottom: 30px;">
        <img src="@/assets/images/user_icon.png" class="icon">
        <div class="line"></div>
        <a-input v-model:value="form.userName" placeholder="请输入登录账号" class="input" @keydown.enter="handleLogin"></a-input>
      </div>
      <div class="login-input_wrap">
        <img src="@/assets/images/password_icon.png" class="icon">
        <div class="line"></div>
        <a-input-password v-model:value="form.password" placeholder="请输入登录密码" class="input" @keydown.enter="handleLogin"></a-input-password>
      </div>
      <a-checkbox v-model:checked="form.remember" class="login-remember">记住密码</a-checkbox>
      <a-button type="primary" block size="large" class="login-btn" @click="handleLogin">
        <template #icon>
          <img src="@/assets/images/login_btn_icon.png" class="login-btn-icon">
        </template>
        登录
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { login } from '@/api/user/index'
import { useUserStore } from '@/stores/user'
import { Storage } from '@/utils/storage'

interface IForm {
  userName: string;
  password: string;
  remember: boolean;
}

const store = useUserStore()

const router = useRouter()

const form = reactive<IForm>({
  userName: '',
  password: '',
  remember: false
})

// 点击登录
function handleLogin() {
  if (!form.userName.trim() || !form.password.trim()) return message.error('账号或密码不能为空')
  // 0: 学生  1: 老师  10000: 系统管理员
  login({ account: form.userName.trim(), password: form.password.trim(), role: '10000' }).then(res => {
    store.setUserInfo(res.data)
    Storage.set('token', res.data.token)
    Storage.set('userInfo', res.data)
    router.push('/lab')
  })
}

</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background: url('@/assets/images/login_bg.png');
  background-size: 100% 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(242, 244, 245);
  &-logo {
    width: 100px;
    position: absolute;
    top: 5vh;
    left: 5vw;
  }
  &-wrap {
    width: 450px;
    position: absolute;
    right: 7vw;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(31, 145, 114, 0.1);
    padding: 50px;
    background: #fff;
  }
  &-title {
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 1px;
    text-align: center;
    color: rgba(0, 0, 0, 0.88);
  }
  &-sub_title {
    font-size: 14px;
    text-align: center;
    margin: 20px 0 50px 0;
    color: @base-font-color;
  }
  &-input_wrap {
    height: 48px;
    border-radius: 3px;
    background: rgb(227, 245, 240);
    display: flex;
    align-items: center;
    .icon {
      margin: 0 12px;
    }
    .line {
      height: 22px;
      width: 2px;
      background: rgba(204, 233, 226);
    }
    .input {
      padding: 11px 20px;
      font-size: 16px;
      border: 0;
      background-color: transparent;
      box-shadow: unset;
      &:focus {
        box-shadow: unset;
      }
    }
    :deep(input) {
      background-color: transparent;
      &:focus {
        box-shadow: unset;
      }
    }
  }
  &-remember {
    margin-top: 15px;
  }
  &-btn {
    margin-top: 30px;
    &-icon {
      vertical-align: text-bottom;
      margin-right: 5px;
    }
  }
}
</style>