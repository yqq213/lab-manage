<template>
  <a-select :placeholder="placeholder" class="custom-select" @focus="handleFocus" :getPopupContainer="getPopupContainer"></a-select>
</template>

<script setup lang="ts">
defineProps({
  placeholder: {
    type: String,
    default: '请选择'
  }
})

// 修复下拉框组件的下拉框因为页面放大缩小导致的位置偏移
const getPopupContainer = (trigger) => trigger.parentNode

function handleFocus(e) {
  console.log(e)
}
</script>

<style lang="less" scoped>
@select-height: 36px;
.custom-select {
  :deep(.ant-select-selector) {
    height: @select-height;
    background: rgba(217,217,217,0.01);
    box-shadow: inset 0px 0px 10px 8px rgba(0,157,255,0.5) !important;
    border: 1px solid rgba(52,244,255,0.5);
    color: #fff;
    border-radius: 3px;
    .ant-select-selection-placeholder {
      color: #fff;
      opacity: .7;
      line-height: @select-height;
    }
    .ant-select-selection-item {
      line-height: @select-height;
      color: #fff;
    }
    input {
      height: @select-height !important;
    }
  }
  :deep(.ant-select-arrow) {
    color: #fff;
  }
  :deep(.ant-select-dropdown) {
    left: 0 !important;
    top: 46px !important;
    border-radius: 3px;
    box-shadow: inset 0px 0px 10px 8px rgba(0,157,255,0.3);
    background: rgba(217,217,217,0.01);
    border: 1px solid rgba(52,244,255,0.5);
    .ant-select-item {
      color: #fff;
      font-size: 12px;
    }
    .ant-select-item-option-selected {
      background: transparent;
      color: @primary-color;
    }
    .ant-empty {
      color: #fff;
      opacity: .7;
    }
  }
}
</style>