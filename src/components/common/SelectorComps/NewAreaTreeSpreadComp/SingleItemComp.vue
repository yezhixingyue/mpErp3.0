<template>
  <section class="mp-erp-common-comps-new-tree-comp-single-item-comp-wrap">
    <header>
      <el-checkbox :disabled='checkAllDisabled'
       :class="{isIncreased:data.isIncreased}" :indeterminate="isIndeterminate" v-model="checkAll">{{data.ClassName}}</el-checkbox>
      <span v-if="!data.isIncreased" @click="spread = !spread" :class="{spread:spread}">{{ spread ? '收起' : '展开' }} <i class="el-icon-caret-bottom"></i> </span>
    </header>
    <main v-show="spread" v-if="data.children" :class="{isLevel2: isLevel2}">
      <ChildSingleItemComp :value='getItemValue(it)' :title='title' @change="onChildItemChange" :disabled='disabled' :DisabledList='DisabledList'
       :leftWidth='leftWidth' :isLevel2='isLevel2' :rightItemWidth='rightItemWidth' v-for="it in data.children" :key="it.ID" :itemData='it' />
    </main>
  </section>
</template>

<script>
import ChildSingleItemComp from './ChildSingleItemComp.vue';
import { getAllSubItemList, getSelectedItemsList, getCheckAllListByCurDataList, getFormalData4SubmitAfterChange } from './utils';

export default {
  props: {
    data: {
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
    value: {
      type: Object,
      default: null,
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
  components: {
    ChildSingleItemComp,
  },
  computed: {
    checkAll: {
      get() {
        if (this.data.isIncreased) {
          return this.selectedMinimumItemIDSList.includes(this.data.ID);
        }
        if (this.selectedMinimumItemListCount > 0 && this.selectedMinimumItemListCount === this.allMinimumItemList.length) return true;
        return false;
      },
      set(bool) {
        if ((this.data.isIncreased)) {
          if (!this.DisabledList.includes(this.data.ID)) this.$emit('change', this.data);
        } else if (!bool && this.value) { // 清空当前项目
          const temp = { ...this.value, IsIncludeIncreased: false, List: [] };
          this.$emit('change', temp);
        } else if (bool) { // 全选当前项目
          const temp = getCheckAllListByCurDataList([this.data], false, this.DisabledList)[0];
          this.$emit('change', temp);
        }
      },
    },
    checkAllDisabled() {
      if (this.disabled) return true;
      if (this.data.isIncreased && this.DisabledList.includes(this.data.ID)) return true;
      if (this.data && Array.isArray(this.data.children)) {
        const target = this.data.children.find(item => {
          if (item.isIncreased) {
            return !this.DisabledList.includes(item.ID);
          }
          const t = item.children.find(it => !this.DisabledList.includes(it.ID));
          if (t) return true;
          return false;
        });
        if (!target) return true;
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
      return getAllSubItemList([this.data]);
    },
  },
  data() {
    return {
      spread: false,
    };
  },
  methods: {
    getItemValue(item) {
      if (!this.value) return null;
      if (item.isIncreased) {
        return this.value.IsIncludeIncreased ? item : null;
      }
      if (this.value.List.length === 0) return null;
      const t = this.value.List.find(it => it.ID === item.ID);
      return t || null;
    },
    onChildItemChange(item) {
      const temp = getFormalData4SubmitAfterChange(item, this.value, this.data);
      this.$emit('change', temp);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-new-tree-comp-single-item-comp-wrap {
  margin-bottom: 12px;
  > header {
    display: flex;
    align-items: center;
    > .el-checkbox {
      .el-checkbox__label {
        font-weight: 700;
        color: #585858;
        min-width: 6em;
      }
    }
    > span {
      font-size: 12px;
      color: #585858;
      margin-left: 12px;
      user-select: none;
      cursor: pointer;
      > i {
        color: #a2a2a2;
        font-size: 15px;
      }
      &.spread {
        > i {
          transform: rotateZ(180deg);
        }
      }
    }
  }
  > main {
    padding-left: 14px;
    &.isLevel2 {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .el-checkbox.isIncreased {
    .el-checkbox__label {
      color: #80C269;
    }
  }
}
</style>
