<template>
  <div class="mp-erp-doc-manage-left-class-list-manage-comp-wrap">
    <SearchInput :value="words" @change="e => words = e" />

    <span class="add">新增一级分类</span>

    <div class="table">
      <h4 class="header">
        <span class="n">页面分类名称</span>
        <span class="m">操作</span>
      </h4>

      <div class="list">
        <ClassTreeItem v-for="it in list" :key="it.id" :item="it" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import SearchInput from './SearchInput.vue';
import ClassTreeItem from './ClassTreeItem.vue';

const list = [
  {
    id: 58,
    categoryName: '一级分类1',
    categoryLevel: 1,
    categoryParentID: -1,
    categoryOrder: 1,
    children: [
      {
        id: 62,
        categoryName: '二级分类1',
        categoryLevel: 2,
        categoryParentID: 58,
        categoryOrder: 1,
      },
    ],
  },
  {
    id: 59,
    categoryName: '一级分类2',
    categoryLevel: 1,
    categoryParentID: -1,
    categoryOrder: 2,
    children: [
      {
        id: 63,
        categoryName: '二级分类2',
        categoryLevel: 2,
        categoryParentID: 58,
        categoryOrder: 1,
      },
      {
        id: 163,
        categoryName: '二级分类2-2',
        categoryLevel: 2,
        categoryParentID: 58,
        categoryOrder: 1,
      },
    ],
  },
  {
    id: 60,
    categoryName: '一级分类3',
    categoryLevel: 1,
    categoryParentID: -1,
    categoryOrder: 3,
    children: [
      {
        id: 63,
        categoryName: '二级分类3-1',
        categoryLevel: 2,
        categoryParentID: 59,
        categoryOrder: 1,
      },
      {
        id: 64,
        categoryName: '二级分类3-2',
        categoryLevel: 2,
        categoryParentID: 60,
        categoryOrder: 1,
      },
      {
        id: 163,
        categoryName: '二级分类3-3',
        categoryLevel: 2,
        categoryParentID: 59,
        categoryOrder: 1,
      },
      {
        id: 164,
        categoryName: '二级分类3-4',
        categoryLevel: 2,
        categoryParentID: 60,
        categoryOrder: 1,
      },
    ],
  },
];

const cb = () => {
  try {
    console.log('is try trigger');
  } catch {
    console.log('is catch trigger');
  }
};

const words = ref('fen');

cb();

</script>

<style scoped lang='scss'>
.mp-erp-doc-manage-left-class-list-manage-comp-wrap {
  width: 100%;
  height: 100%;
  max-height: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #444;

  > * {
    flex: none;
  }

  .add {
    display: flex;
    align-items: center;
    line-height: 18px;
    padding: 15px 0;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
    user-select: none;

    &:hover {
      color: #888;
    }

    &:active {
      color: #222;
    }

    &::before {
      content: '';
      width: 13px;
      height: 13px;
      margin-right: 7px;
      background: url('@/assets/images/add.png') 100% 100%;
    }
  }

  .table {
    flex: 1;
    overflow: hidden;
    margin-right: -30px;
    display: flex;
    flex-direction: column;

    .header {
      flex: none;
      height: 43px;
      width: 100%;
      display: flex;
      align-items: center;
      font-weight: 700;
      background-color: #f5f5f5;
      .n {
        flex: 1;
        margin-left: 20px;
      }

      .m {
        flex: none;
        width: 240px;
        text-align: center;
      }
    }

    > .list {
      flex: 1;
      overflow: auto;
      overflow: overlay;
    }
  }
}
</style>
