<template>
  <div class="period">
    <span
      class="period-item"
      v-for="item in periodList"
      :key="item.value"
      :class="{'active': modelValue === item.value}"
      @click="modelValue = item.value">
      {{ item.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Period'
})

const modelValue = defineModel<string>({ required: true })

const periodList = [
  {
    label: '天',
    value: 'day'
  },
  {
    label: '周',
    value: 'week'
  },
  {
    label: '月',
    value: 'month'
  },
]

</script>

<style lang="less" scoped>
.period {
  .flex(flex-end);
  &-item {
    width: 46px;
    height: 28px;
    border-radius: 2px;
    border: 1px solid rgba(23,158,255,0.5);
    margin-left: 6px;
    font-size: 14px;
    cursor: pointer;
    .flex();
    &.active {
      box-shadow: inset 0px 0px 4px 4px rgba(23,158,255,0.5);
      background: rgba(217,217,217,0.01);
    }
  }
}
</style>