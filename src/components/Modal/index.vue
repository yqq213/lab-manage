<template>
  <a-modal v-model:open="visible" class="baseModal" :maskClosable="false">
    <div class="modal_header">
      <div class="modal_header_content" v-if="title">{{ title }}</div>
      <slot name="header" v-else></slot>
    </div>
    <div class="modal_body">
      <slot></slot>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  },
  title: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => { emit('update:modelValue', v) }
})

</script>

<style lang="less">
.baseModal {
  color: #fff;

  .ant-modal-content {
    background: #154d58;
    border-radius: 0;
    padding: 0;

    .ant-modal-close {
      color: #fff;
      top: 0;
      inset-inline-end: -30px;

      .ant-modal-close-x {
        font-size: 20px;
      }
    }
  }

  .modal_header {
    border-bottom: 1px solid #42777f;

    &_content {
      padding: 12px 24px;
      font-weight: bold;
      font-size: 16px;
      letter-spacing: 2px;
    }
  }

  .modal_body {
    padding: 20px;
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>