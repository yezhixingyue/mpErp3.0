<template>
  <section class="part-wrap" v-if="Part.DisplayList.length > 0">
    <header v-if="!hiddenName">{{ Part.Name }}</header>
    <main>
      <DisplayItem v-for="(it, i) in Part.DisplayList" :key="i" :item="it" :Part="Part" />
    </main>
  </section>
</template>

<script setup lang='ts'>
import { IMRPart } from '../../../js/types';
import DisplayItem from './DisplayItem.vue';

defineProps<{
  Part: IMRPart
  hiddenName?: boolean
}>();
</script>

<style scoped lang='scss'>
.part-wrap {
  > header {
    font-weight: 700;
    margin-bottom: 12px;
    color: #444;
  }

  // el部分样式重置
  :deep(.el-checkbox) {
    margin-right: 15px;

    .el-checkbox__label {
      font-size: 12px;
    }

    &.name {
      margin-right: 6px;
    }
  }

  :deep(.label-name) {
    font-size: 12px;
    line-height: 18px;
    width: 6em;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 14px;
    position: relative;
    margin-right: 8px;
    flex: none;
    &::after {
      content: '：';
      position: absolute;
      right: 0px;
      top: 0;
    }
  }

  &:not(:last-of-type) {
    margin-bottom: 15px;
  }
}
</style>
