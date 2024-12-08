<template>
  <div class="member">
    <div class="list">
      <li class="item" v-for="(item, index) in showList" :key="index">{{ item }}</li>
    </div>
    <span class="more" v-if="list.length > 3" @click="modalVisible = true"><span>·</span>更多</span>
    <a-modal
      v-model:open="modalVisible"
      width="800px"
      class="member-modal"
      :footer="null"
      title="组员信息">
      <div class="modal-content">
        <li class="tag" v-for="(item, index) in list" :key="index">{{ item }}</li>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const showList = computed(() => props.list && props.list.slice(0, 3))

const modalVisible = ref(false)

</script>

<style lang="less" scoped>
.member {
  .flex();
  .list {
    .flex();
    .item {
      &::after {
        content: '·';
        margin: 0 3px;
        font-weight: bold;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
  .more {
    color: @primary-color;
    cursor: pointer;
    span {
      margin: 0 3px;
      font-weight: bold;
    }
  }
}
</style>

<style lang="less">
.member-modal {
  .modal-content {
    padding: 30px 50px;
    display: flex;
    flex-wrap: wrap;
    .tag {
      padding: 5px 10px;
      background: @primary-color;
      margin: 0 15px;
      margin-bottom: 20px;
      color: #fff;
      border-radius: 3px;
    }
  }
}
</style>