<template>
  <div class="add-page">
    <div class="back-wrap">
      <p class="back" @click="handleClose">
        <LeftOutlined></LeftOutlined>
        <span>返回</span>
      </p>
    </div>
    <div class="form-wrap">
      <a-form :model="formState" :rules="rules" ref="formRef" autocomplete="off" :labelCol="{ style: { width: '90px' } }">
        <a-form-item name="ident" label="设备编号">
          <a-input v-model:value="formState.ident" placeholder="设备编号最多40个字（必填）" :maxlength="40"/>
        </a-form-item>
        <a-form-item name="name" label="设备名称">
          <a-input v-model:value="formState.name" placeholder="设备名称最多40个字（必填）" :maxlength="40"/>
        </a-form-item>
        <a-form-item name="price" label="收费标准" class="label-suffix-item">
          <a-input-number v-model:value="formState.price" :min="1" :precision="0" placeholder="收费标准必须为整数（必填）" />
          <span class="label-suffix">元&nbsp;/&nbsp;h</span>
        </a-form-item>
        <a-form-item name="labRoomId" label="实验室">
          <a-select v-model:value="formState.labRoomId" placeholder="请选择实验室">
            <a-select-option :value="item.id" v-for="item in labList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="paramInfo" label="设备参数">
          <a-textarea v-model:value="formState.paramInfo" :autoSize="{ minRows: 3 }" placeholder="请输入设备参数（必填）" />
        </a-form-item>
        <a-form-item name="abilityInfo" label="设备功能">
          <a-textarea v-model:value="formState.abilityInfo" :autoSize="{ minRows: 3 }" placeholder="请输入设备功能（必填）" />
        </a-form-item>
        <a-form-item name="operateInfo" label="设备操作">
          <a-textarea v-model:value="formState.operateInfo" :autoSize="{ minRows: 3 }" placeholder="请输入设备操作（必填）" />
        </a-form-item>
        <a-form-item name="status" label="设备状态">
          <a-radio-group v-model:value="formState.status">
            <a-radio value="0">可预约</a-radio>
            <a-radio value="1">不可预约</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- <a-form-item name="interval" label="设备间隔" class="label-suffix-item">
          <a-input-number v-model:value="formState.interval" :min="1" :precision="0" placeholder="设备间隔必须为整数（必填）" />
          <span class="label-suffix">分钟</span>
        </a-form-item> -->
        <a-form-item name="code" label="开关码">
          <a-input v-model:value="formState.code" placeholder="请输入开关码（必填）" :maxlength="40"/>
        </a-form-item>
        <a-form-item name="thumb" label="添加图像">
          <a-upload
            action=""
            :show-upload-list="false"
            :headers="{ 'X-Access-Token': token }"
            name="avatar"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :customRequest="customRequest"
          >
            <div class="upload-wrap" v-if="!imgUrl">
              <PlusOutlined />
              <div style="margin-top: 8px;">上传</div>
            </div>
            <div class="uploadImg" v-else>
              <img :src="imgUrl" />
              <DeleteOutlined class="remove" @click.stop="handleRemoveImg"/>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 16, offset: 8 }">
          <a-button style="margin-right: 30px;" @click="handleResetForm">重置</a-button>
          <a-button type="primary" @click="handleSubmit">确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { Rule } from 'ant-design-vue/es/form';
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { addEquip, editEquip, equipDetail, fileUpload } from '@/api/equip/index'
import { getLabList } from '@/api/lab/index'
import { Storage } from '@/utils/storage'
import SparkMD5 from 'spark-md5'
import { getFileExtension } from '@/utils/index'

const props = defineProps({
  editObj: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

const labList = ref([])

const token = Storage.get('token')

const imgUrl = computed(() => formState.value.thumb ? import.meta.env.VITE_FILE_PREFIX + formState.value.thumb : '')

// const fileList = computed(() => formState.value.thumb ? [{ url: import.meta.VITE_FILE_PREFIX + formState.value.thumb }])
// const fileList = ref([{
//   // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
//   uid: '-xxx',
//     percent: 50,
//     name: 'image.png',
//     status: 'uploading',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
// }])

const formState = ref({
  ident: '',
  name: '',
  price: '',
  labRoomId: null,
  paramInfo: '',
  abilityInfo: '',
  operateInfo: '',
  status: '0',
  // interval: '',
  code: '',
  thumb: '',
})

const rules: Record<string, Rule[]> = {
  ident: [{ required: true, message: '设备编号不能为空！', trigger: 'blur' }],
  name: [{ required: true, message: '设备名称不能为空！', trigger: 'blur' }],
  price: [{ required: true, message: '收费标准不能为空！', trigger: 'blur' }],
  paramInfo: [{ required: true, message: '设备参数不能为空！', trigger: 'blur' }],
  abilityInfo: [{ required: true, message: '设备功能不能为空！', trigger: 'blur' }],
  operateInfo: [{ required: true, message: '设备操作不能为空！', trigger: 'blur' }],
  status: [{ required: true, message: '设备状态不能为空！', trigger: 'change' }],
  // interval: [{ required: true, message: '设备间隔不能为空！', trigger: 'blur' }],
  code: [{ required: true, message: '开关码不能为空！', trigger: 'blur' }],
}

const formRef = ref()

// 上传图片校验
function beforeUpload(file) {
  if (['image/jpeg', 'image/png'].includes(file.type) === false) {
    message.error('请上传正确的图片文件')
    return false
  }
  return true
}

// 自定义上传
function customRequest({file, onSuccess, onError}) {
  const reader = new FileReader()
  reader.onload = function(e) {
    const fileBuffer = e.target!.result
    const spark = new SparkMD5.ArrayBuffer()
    spark.append(fileBuffer)
    const hexHash = spark.end(false)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    formData.append('ident', hexHash)
    formData.append('totalSize', file.size)
    formData.append('suffixName', getFileExtension(file.name))

    fileUpload(formData).then(({ data }) => {
      formState.value.thumb = data.url
      fileList.value = [{ url: import.meta.env.VITE_FILE_PREFIX + data.url }]
    })
  }
  reader.readAsArrayBuffer(file)
}

// 重置
function handleResetForm() {
  formRef.value.resetFields()
}

// 确定
function handleSubmit() {
  formRef.value.validate().then(() => {
    const api = props.editObj.id ? editEquip : addEquip
    api(formState.value).then(() => {
      props.editObj.id ? message.success('修改成功') : message.success('添加成功')
      setTimeout(() => {
        handleClose()
      }, 1000)
    })
  })
}

// 删除图片
function handleRemoveImg() {
  formState.value.thumb = ''
}

// 设备详情
function getDetail(id) {
  equipDetail({ id }).then(({ data }) => {
    formState.value = data
    // data.thumb ? fileList.value = [{ url: import.meta.env.VITE_FILE_PREFIX + data.thumb }] : fileList.value = []
  })
}

// 关闭
function handleClose() {
  emit('close')
}

onMounted(() => {
  if (props.editObj.id) getDetail(props.editObj.id)
  // 获取实验室列表
  getLabList({ order: '0', page: 1, pageSize: 10000 }).then(({ data }) => {
    labList.value = data.list || []
  })
})

</script>

<style lang="less" scoped>
.add-page {
  .back-wrap {
    padding: 20px 50px;
  }
  .back {
    cursor: pointer;
    font-size: 16px;
    width: 60px;
    .flex(flex-start);
  }
  .form-wrap {
    width: 40%;
    margin: 30px auto;
    .label-suffix-item {
      :deep(.ant-input-number) {
        width: calc(100% - 40px);
      }
      .label-suffix {
        width: 40px;
        display: inline-block;
        text-align: right;
        vertical-align: sub;
      }
    }
    :deep(.ant-form-item) {
      margin-bottom: 40px;
    }
    :deep(.ant-upload-select) {
      padding: 8px;
      .uploadImg {
        width: 100%;
        height: 100%;
        position: relative;
        .flex();
        &::before {
          content: '';
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
          position: absolute;
          z-index: 1;
          opacity: 0;
          transition: all ease .5s;
          left: 0;
        }
        &:hover {
          &::before {
            opacity: 1;
          }
          .remove {
            opacity: 1;
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
        .remove {
          color: #fff;
          position: absolute;
          opacity: 0;
          transition: all ease .5s;
          font-size: 16px;
          z-index: 9;
        }
      }
    }
    .upload-wrap {
      height: 100%;
      .flex();
      flex-direction: column;
    }
  }
}
</style>