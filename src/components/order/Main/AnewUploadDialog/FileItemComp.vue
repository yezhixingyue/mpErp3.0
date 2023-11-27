<template>
  <li class="file-item-box" :class="{loading: item.loading}">
    <div class="file-content">
      <span class="icon">
        <img src="@/assets/images/fileicon.png" alt="">
      </span>
      <span class="name" :title="item.file.name">{{ item.file.name }}</span>
      <el-checkbox v-model="checked">印刷文件</el-checkbox>
    </div>
    <div class="percentagee" v-show="item.loading">
      <el-progress :percentage="50" :stroke-width="3"></el-progress>
    </div>
  </li>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { FileItemClass } from './FileItemClass';

const props = defineProps<{
  item: FileItemClass
}>();

const emit = defineEmits(['change']);

const checked = computed({
  get() {
    return props.item.isPrintFile;
  },
  set(val) {
    emit('change', val);
  },
});
</script>

<style scoped lang='scss'>
.file-item-box {
  height: 35px;
  background-color: #F4FBFF;
  margin-bottom: 5px;
  font-size: 12px;
  padding: 0 20px;
  transition: background-color 0.2s;
  position: relative;

  &:not(.loading):hover {
    background-color: darken($color: #F4FBFF, $amount: 10);
  }

  > .file-content {
    height: 100%;
    display: flex;
    align-items: center;

    > .icon {
      width: 16px;
      margin-top: 1px;
    }

    > span.name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #aaa;
      margin-right: 15px;
      line-height: 24px;
    }

    > label {
      :deep(.el-checkbox__label) {
        font-size: 12px;
        color: #26bcf9;
      }
      :deep(.el-checkbox__inner) {
        border-color: #26bcf9;
      }
    }

    > span, > label {
      flex: none;
      white-space: nowrap;
    }
  }

  > .percentagee {
    position: absolute;
    left: 20px;
    right: 0;
    top: 0;
    bottom: 0;
    padding-top: 26px;
    z-index: 2;

    :deep(.el-progress__text) {
      font-size: 12px !important;
      position: relative;
      top: -1px;
    }
  }
}
</style>
