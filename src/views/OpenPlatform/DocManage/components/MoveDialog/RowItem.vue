<template>
  <div class="move-dialog-class-table-item" :class="{isRoot: item.categoryLevel === 1}">
    <div class="content" :style="`padding-left: ${(item.categoryLevel) * 20}px;`" :class="{active: curClassId === item.id}">
      <div class="left" @click="() => onclick()" :title="item.categoryName">{{ item.categoryName }}</div>
      <div class="menu">
        <div @click="isCollapse = !isCollapse" v-if="item.children && item.children.length > 0">
          <i v-if="isCollapse" class="el-icon-arrow-down"></i>
          <i v-else class="el-icon-arrow-up"></i>
        </div>
      </div>
    </div>

    <div class="children" v-show="!isCollapse" v-if="item.children && item.children.length > 0">
      <RowItem v-for="it in item.children" :key="it.id" :curClassId="curClassId" :item="it" @select="onclick" />
    </div>

  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { IClassTreeItem } from '../../js/types';

const props = defineProps<{
  item: IClassTreeItem
  curClassId: number | ''
}>();

const emit = defineEmits(['select']);

const isCollapse = ref(false);

const onclick = (item = props.item) => {
  emit('select', item);
};

</script>

<script lang='ts'>
export default {
  name: 'RowItem',
};
</script>

<style scoped lang='scss'>
.move-dialog-class-table-item {
  width: 100%;
  box-sizing: border-box;

  .content {
    height: 28px;
    line-height: 28px;
    padding-left: 20px;
    margin: 2px 0;
    display: grid;
    grid-template-columns: 1fr 160px;
    align-items: center;

    .left {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      color: #444;
    }

    .menu {
      display: grid;
      grid-template-columns: 25px;
      grid-template-rows: 20px;
      text-align: center;
      padding: 0 12px;

      > div {
        cursor: pointer;
        transition: background-color 0.1s ;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        &:hover {
          background-color: #f5f5f5;
          &:active {
            background-color: #ddd;
          }
        }

        i {
          font-size: 16px;
        }
      }

    }

    &.active {
      background-color: #f5f5f5;
      // .left {
      //   color: darken($color: #428dfa, $amount: 45);
      // }
    }
  }

  &.isRoot {
    padding-left: 20px;
  }
}

</style>
