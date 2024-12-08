<template>
  <div class="input-wrap">
    <a-input v-model:value="value" placeholder="搜索"></a-input>
   <div class="input-wrap-suffix">
    <svg-icon name="search-icon" size="18"></svg-icon>
   </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (v) => { emit('update:modelValue',v) }
})

</script>

<style lang="less" scoped>
@suffix-width: 50px;
.input-wrap {
  width: 100%;
  border-radius: 3px;
  box-shadow: inset 0px 0px 10px 8px rgba(0,157,255,0.5);
  background: rgba(217,217,217,0.01);
  height: @input-height;
  padding-right: @suffix-width;
  position: relative;
  :deep(.ant-input) {
    height: 100%;
    background: transparent;
    border: 0;
    color: #fff;
    letter-spacing: 1px;
    padding-left: 20px;
    &::placeholder {
      color: #fff;
      opacity: .7;
    }
  }
  &-suffix {
    height: @input-height;
    width: @suffix-width;
    position: absolute;
    right: 0;
    top: 0;
    .flex();
  }
}
</style>