<template>
  <section class="mp-erp-common-comps-new-tree-comp-single-item-comp-wrap">
    <header>
      <el-checkbox  :class="{isIncreased:data.isIncreased}" :indeterminate="isIndeterminate" v-model="checkAll">{{data.ClassName}}</el-checkbox>
      <span v-if="!data.isIncreased" @click="spread = !spread" :class="{spread:spread}">{{ spread ? '收起' : '展开' }} <i class="el-icon-caret-bottom"></i> </span>
    </header>
    <main v-show="spread" v-if="data.children">
      <ChildSingleItemComp :value='getItemValue(it)' :title='title' @change="onChildItemChange"
       :leftWidt='leftWidth' :rightItemWidth='rightItemWidth' v-for="it in data.children" :key="it.ID" :itemData='it' />
    </main>
  </section>
</template>

<script>
import ChildSingleItemComp from './ChildSingleItemComp';
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
  },
  components: {
    ChildSingleItemComp,
  },
  computed: {
    checkAll: {
      get() {
        if (this.data.isIncreased) {
          console.log(this.data, this.value);
          return this.selectedMinimumItemIDSList.includes(this.data.ID);
        }
        if (this.selectedMinimumItemListCount > 0 && this.selectedMinimumItemListCount === this.allMinimumItemList.length) return true;
        return false;
      },
      set(bool) {
        if ((this.data.isIncreased)) {
          this.$emit('change', this.data);
        } else if (!bool && this.value) { // 清空当前项目
          const temp = { ...this.value, IsIncludeIncreased: false, List: [] };
          this.$emit('change', temp);
        } else if (bool) { // 全选当前项目
          const temp = getCheckAllListByCurDataList([this.data])[0];
          this.$emit('change', temp);
        }
      },
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
  }
  .el-checkbox.isIncreased {
    .el-checkbox__label {
      color: #80C269;
    }
  }
}
</style>
