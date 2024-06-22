<template>
  <article class="mp-erp-common-comps-new-tree-comp-wrap">
    <header>
      <el-checkbox :indeterminate="isIndeterminate" :disabled='checkAllDisabled' v-model="checkAll">所有{{title}}</el-checkbox>
    </header>
    <main>
      <SingleItemComp
        v-for="it in showList"
        :key="it.ID"
        :data='it'
        :title='title'
        :value='getItemValue(it)'
        @change='onItemChange'
        :leftWidth='leftWidth'
        :disabled='disabled'
        :DisabledList='DisabledList'
        :rightItemWidth='rightItemWidth'
        :isLevel2='isLevel2'
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
    disabled: {
      type: Boolean,
      default: false,
    },
    DisabledList: {
      type: Array,
      default: () => [],
    },
    isLevel2: { // 只使用到2级分类
      type: Boolean,
      default: false,
    },
  },
  components: {
    SingleItemComp,
  },
  computed: {
    localList() {
      if (this.isLevel2) {
        const _list = this.list.map(level1 => {
          const children = level1.children ? level1.children.map(it => ({ ...it, children: [] })) : [];
          return { ...level1, children };
        });
        return _list;
      }
      return this.list;
    },
    showList() {
      if (!this.withNew) return this.localList;
      const rootNewIncreasedItem = createOneNewIncreasedItem('root', this.title);
      const appendIncreased = (item) => { // 向列表中加入新加子项目
        const { children, ID } = item;
        if (!children) return item;
        const _children = children.map(_it => appendIncreased(_it));
        const newIncreasedItem = createOneNewIncreasedItem(ID, this.title);
        return { ...item, children: [..._children, newIncreasedItem] };
      };
      const _list = this.localList.map(lv1 => appendIncreased(lv1));
      return [..._list, rootNewIncreasedItem];
    },
    checkAll: {
      get() {
        return this.selectedMinimumItemListLengt === this.allMinimumItemListLength && this.selectedMinimumItemListLengt > 0;
      },
      set(bool) {
        const rootTemp = bool ? this.getCheckAllList(this.showList) : { IsIncludeIncreased: false, List: [] };
        this.$emit('change', rootTemp);
      },
    },
    allMinimumItemList() {
      const list = this.withNew ? this.showList : this.localList;
      return getAllSubItemList(list);
    },
    allMinimumItemIDList() {
      return this.allMinimumItemList.map(it => it.ID);
    },
    allMinimumItemListLength() { // 全部最小选项的列表长度 （如果withNew时，包含全部三级目录中的新加地区项目）
      return this.allMinimumItemList.length;
    },
    selectedMinimumItemListLengt() {
      // 对绑定的value数据进行筛选，去掉已经不在当前全部树形数据列表中的子项，然后计算出数量
      const list = getSelectedItemsList(this.value, this.title).map(it => it.ID).filter(it => this.allMinimumItemIDList.includes(it));
      return list.length;
    },
    isIndeterminate() {
      if (this.selectedMinimumItemListLengt === 0 || this.selectedMinimumItemListLengt === this.allMinimumItemListLength) return false;
      return true;
    },
    checkAllDisabled() {
      if (this.disabled) return true;
      if (this.allMinimumItemIDList.length === this.DisabledList.length) {
        const t = this.allMinimumItemIDList.find(it => !this.DisabledList.includes(it));
        if (!t) return true;
      }
      return false;
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
      return getCheckAllListByCurDataList(list, true, this.DisabledList);
    },
    getCheckAllHandler(bool) { // 用于向父组件提供全选操作
      this.checkAll = bool;
    },
  },
  mounted() {
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
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
    background-color: #26bcf9;
    border-color: #26bcf9;
    &::after {
      border-color: #fff;
    }
    &::before {
      border-color: #fff;
      background-color: #fff;
    }
  }
}
</style>
