<template>
  <section class="mp-erp-common-comps-new-tree-comp-child-single-item-comp-wrap">
    <header>
      <el-checkbox :class="{isIncreased:itemData.isIncreased}" :disabled='checkAllDisabled' :title="itemData.ClassName"
       :style='`width:${leftWidth}`' :indeterminate="isIndeterminate" v-model="checkAll">{{itemData.ClassName}}</el-checkbox>
    </header>
    <main v-if="!isLevel2">
      <el-checkbox-group v-model="checkList" :disabled='disabled'>
        <el-checkbox :class="{isIncreased:it.isIncreased}" :title="it.ClassName" :disabled='DisabledList.includes(it.ID)'
         :style='`width:${rightItemWidth}`' :label="it.ID" v-for="(it, i) in itemData.children" :key="it.ClassName + i">{{it.ClassName}}</el-checkbox>
      </el-checkbox-group>
    </main>
  </section>
</template>

<script>
import { getAllSubItemList, getSelectedItemsList, getCheckAllListByCurDataList } from './utils';

export default {
  props: {
    itemData: {
      type: Object,
      default: () => ({}),
    },
    leftWidth: {
      type: String,
      default: '6em',
    },
    value: {
      type: Object,
      default: null,
    },
    rightItemWidth: {
      type: String,
      default: '8em',
    },
    title: {
      type: String,
      default: '地区',
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
  computed: {
    checkAll: {
      get() {
        if (this.itemData.isIncreased) {
          return this.selectedMinimumItemIDSList.includes(this.itemData.ID);
        }
        if (this.selectedMinimumItemListCount > 0 && this.selectedMinimumItemListCount === this.allMinimumItemList.length) return true;
        return false;
      },
      set(bool) {
        if (this.itemData.isIncreased) {
          if (!this.DisabledList.includes(this.itemData.ID)) this.$emit('change', this.itemData);
        } else if (!bool && this.value) { // 清空当前项目
          const temp = { ...this.value, IsIncludeIncreased: false, List: [] };
          this.$emit('change', temp);
        } else if (bool) { // 全选当前项目
          const temp = getCheckAllListByCurDataList([this.itemData], false, this.DisabledList)[0];
          this.$emit('change', temp);
        }
      },
    },
    checkAllDisabled() {
      if (this.disabled) return true;
      if (this.itemData.isIncreased && this.DisabledList.includes(this.itemData.ID)) return true;
      if (this.itemData && Array.isArray(this.itemData.children)) {
        const t = this.itemData.children.find(it => !this.DisabledList.includes(it.ID));
        if (!t) return true;
      }
      return false;
    },
    isIndeterminate() {
      if (this.selectedMinimumItemListCount === 0 || this.selectedMinimumItemListCount === this.allMinimumItemList.length) return false;
      return true;
    },
    selectedMinimumItemList() {
      return getSelectedItemsList(this.value, this.title);
    },
    selectedMinimumItemIDSList() {
      return this.selectedMinimumItemList.map(it => it.ID);
    },
    selectedMinimumItemListCount() {
      return this.selectedMinimumItemList.length;
    },
    allMinimumItemList() {
      return getAllSubItemList([this.itemData]);
    },
    checkList: {
      get() {
        return this.selectedMinimumItemIDSList;
      },
      set(list) {
        const temp = { ...this.itemData };
        temp.children = temp.children.filter(it => list.includes(it.ID) && !this.DisabledList.includes(it.ID));
        const tempData = getCheckAllListByCurDataList([temp])[0];
        if (!tempData) this.checkAll = false;
        else this.$emit('change', tempData);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-new-tree-comp-child-single-item-comp-wrap {
  display: flex;
  padding-top: 12px;
  .el-checkbox {
    margin-bottom: 6px;
    .el-checkbox__label {
      font-size: 12px;
      color: #585858;
      max-width: calc(100% - 24px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .el-checkbox-group {
    .el-checkbox {
      margin-right: 8px;
    }
  }
  > header {
    padding-right: 4px;
    flex: none;
    .el-checkbox__label {
      font-weight: 700;
    }
  }
  > main {
    padding-top: 1px;
  }
}
</style>
