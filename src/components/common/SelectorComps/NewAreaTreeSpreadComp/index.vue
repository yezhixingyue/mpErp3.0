<template>
  <article class="mp-erp-common-comps-new-tree-comp-wrap">
    <header>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll">所有{{title}}</el-checkbox>
    </header>
    <main>
      <SingleItemComp
        v-for="it in showList"
        :key="it.ID"
        :data='it'
        :title='title'
        :value='getItemValue(it)'
        @change='onItemChange'
        :leftWidt='leftWidth'
        :rightItemWidth='rightItemWidth'
        />
    </main>
  </article>
</template>

<script>
import SingleItemComp from './SingleItemComp.vue';
import { getAllSubItemList, getSelectedItemsList, createOneNewIncreasedItem, getCheckAllListByCurDataList, getFormalData4SubmitAfterChange } from './utils';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    leftWidth: {
      type: String,
      default: '6em',
    },
    rightItemWidth: {
      type: String,
      default: '8em',
    },
    title: {
      type: String,
      default: '地区',
    },
    withNew: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    SingleItemComp,
  },
  computed: {
    showList() {
      if (!this.withNew) return this.list;
      const rootNewIncreasedItem = createOneNewIncreasedItem('root', this.title);
      const appendIncreased = (item) => { // 向列表中加入新加子项目
        const { children, ID } = item;
        if (!children) return item;
        const _children = children.map(_it => appendIncreased(_it));
        const newIncreasedItem = createOneNewIncreasedItem(ID, this.title);
        return { ...item, children: [..._children, newIncreasedItem] };
      };
      const _list = this.list.map(lv1 => appendIncreased(lv1));
      return [..._list, rootNewIncreasedItem];
    },
    checkAll: {
      get() {
        return this.selectedMinimumItemListLengt === this.allMinimumItemListLength && this.selectedMinimumItemListLengt > 0;
      },
      set(bool) {
        const temp = bool ? this.getCheckAllList(this.showList) : { IsIncludeIncreased: false, List: [] };
        this.$emit('change', temp);
      },
    },
    allMinimumItemList() {
      const list = this.withNew ? this.showList : this.list;
      return getAllSubItemList(list);
    },
    allMinimumItemIDList() {
      return this.allMinimumItemList.map(it => it.ID);
    },
    allMinimumItemListLength() { // 全部最小选项的列表长度 （如果withNew时，包含全部三级目录中的新加地区项目）
      return this.allMinimumItemList.length;
    },
    selectedMinimumItemListLengt() {
      const list = getSelectedItemsList(this.value, this.title);
      return list.length;
    },
    isIndeterminate() {
      if (this.selectedMinimumItemListLengt === 0 || this.selectedMinimumItemListLengt === this.allMinimumItemListLength) return false;
      return true;
    },
  },
  methods: {
    getItemValue(item) {
      if (item.isIncreased) {
        return this.value.IsIncludeIncreased ? item : null;
      }
      if (this.value.List.length === 0) return null;
      const t = this.value.List.find(it => it.ID === item.ID);
      return t || null;
    },
    onItemChange(item) {
      const temp = getFormalData4SubmitAfterChange(item, this.value);
      this.$emit('change', temp);
    },
    getCheckAllList(list) {
      return getCheckAllListByCurDataList(list, true);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-new-tree-comp-wrap{
  > header {
    .el-checkbox {
      .el-checkbox__label {
        font-weight: 700;
        color: #585858;
      }
    }
    margin-bottom: 12px;
  }
}
</style>
