<template>
  <div class="class-table-item" :class="{isRoot: item.categoryLevel === 1}">
    <div class="content" :style="`margin-left: ${item.categoryLevel - 1}em;`">
      <div class="left">{{ item.categoryName }}</div>
      <div class="menus"></div>
    </div>

    <div class="children" v-if="item.children && item.children.length > 0">
      <ClassTreeItem v-for="it in item.children" :key="it.id" :item="it" />
    </div>

  </div>
</template>

<script setup lang='ts'>
import { IClassTreeItem } from '../../js/types';

withDefaults(defineProps<{
  item: IClassTreeItem
}>(), {
});

</script>

<script lang='ts'>
export default {
  name: 'ClassTreeItem',
};
</script>

<style scoped lang='scss'>
.class-table-item {
  width: 100%;
  box-sizing: border-box;

  .content {
    height: 26px;
    line-height: 26px;
    padding: 8px 20px;
  }

  &.isRoot {
    padding-left: 6px;
    &:not(:last-of-type) {
      border-bottom: 1px solid #dcdcdc;
    }
  }
}
</style>
