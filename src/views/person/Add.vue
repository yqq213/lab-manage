<template>
  <a-modal
    v-model:open="modalVisible"
    :title="title"
    width="700px"
    :afterClose="handleClose"
    @ok="handleOk">
    <a-form :model="formState" :rules="rules" :disabled="mode === 'view'" ref="formRef" autocomplete="off" :labelCol="{ style: { width: '90px' } }" style="padding: 30px 50px;">
      <a-form-item name="ident" :label="roleName + '编号'">
        <a-input v-model:value="formState.ident" placeholder="请输入编号（必填）" />
      </a-form-item>
      <a-form-item name="name" :label="roleName + '姓名'">
        <a-input v-model:value="formState.name" placeholder="请输入姓名（必填）" />
      </a-form-item>
      <a-form-item name="phone" :label="roleName + '手机'">
        <a-input v-model:value="formState.phone" placeholder="请输入手机（必填）" />
      </a-form-item>
      <a-form-item name="password" :label="roleName + '密码'">
        <a-input-password v-model:value="formState.password" placeholder="请输入密码（必填）" />
      </a-form-item>
      <a-form-item name="department" :label="roleName + '院系'" v-if="role == '0'">
        <a-input v-model:value="formState.department" placeholder="请输入院系（必填）" />
      </a-form-item>
      <a-form-item name="gender" :label="roleName + '性别'">
        <a-radio-group v-model:value="formState.gender">
          <a-radio value="1">男</a-radio>
          <a-radio value="2">女</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { updateUser, regist } from '@/api/user/index'
import { message } from 'ant-design-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: '1'
  },
  row: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'refresh'])

const modalVisible = computed({
  get: () => props.modelValue,
  set: (v) => { emit('update:modelValue', v) }
})

const title = computed(() => props.mode === 'edit' ? '编辑' : props.mode === 'add' ? '添加' : '查看')

const roleName = computed(() => props.role == '1' ? '老师' : '学生')

// form
const formState = ref({
  password: '!User234',  // 初始密码!User234
  gender: '1'
})
const formRef = ref()

// 手机号校验
const checkPhone = async (_rule: Rule, value: string) => {
  const regex = /^1[3-9]\d{9}$/
  if (regex.test(value)) {
    return Promise.resolve()
  } else {
    return Promise.reject('请输入正确的手机号码')
  }
}

const rules: Record<string, Rule[]> = {
  ident: [{ required: true, message: '编号不能为空！', trigger: 'blur' }],
  name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
  phone: [{ required: true, message: '手机不能为空！', trigger: 'blur' }, { validator: checkPhone, trigger: blur }],
  // password: [{ required: true, message: '密码不能为空！', trigger: 'blur' }],
  department: [{ required: true, message: '院系不能为空！', trigger: 'blur' }],
  gender: [{ required: true, message: '性别不能为空！', trigger: 'change' }],
}

// 确定
function handleOk() {
  if (props.mode === 'view') return modalVisible.value = false
  formRef.value.validate().then(() => {
    const api = props.mode === 'add' ? regist : updateUser
    // account字段使用ident的值
    formState.value.account = formState.value.ident
    formState.value.role = props.role
    api(formState.value).then(() => {
      modalVisible.value = false
      props.mode === 'edit' ? message.success('修改成功') : message.success('添加成功')
      emit('refresh')
    })
  })
}

// 弹窗关闭
function handleClose() {
  formRef.value.resetFields()
  emit('update:modelValue', false)
}

watch(() => props.row, (obj) => {
  formState.value = { ...obj }
  if (props.mode === 'add') {
    formState.value.password = '!User234'
    formState.value.gender = '1'
  }
})

</script>

<style lang="less" scoped>

</style>