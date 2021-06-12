<template>
  <div v-if="itemData" class="mp-erp-comps-pruduct-module-material-select-dialog-comp-content-item-wrap">
    <div class="header">
      <el-checkbox v-model="checkItemAll" :indeterminate="isIndeterminateAll">{{itemData.Name}}</el-checkbox>
      <div class="extend-box" @click="extend = !extend" v-if="showContent">
        <span v-if="!extend">展开</span>
        <span v-else>隐藏</span>
        <i v-if="!extend" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </div>
    </div>
    <div v-show="showContent && extend" class="content">
      <el-checkbox :value='checkedIDList.includes(it.ID)' @change='change(it)' v-for="it in itemData.List" :key="'item-check'+it.ID">
        {{it.itemContent}}
      </el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    itemData: {
      type: Object,
      default: null,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      extend: true,
    };
  },
  computed: {
    showContent() {
      if (!this.itemData) return false;
      if (this.itemData.List.length > 1) return true;
      if (this.itemData.List.length === 1 && this.itemData.List[0].itemContent) return true;
      return false;
    },
    itemDataIds() {
      if (!this.itemData) return [];
      return this.itemData.List.map(it => it.ID);
    },
    checkedIDList() {
      if (this.itemDataIds.length === 0 || this.value.length === 0) return [];
      return this.value.filter(it => this.itemDataIds.includes(it.ID)).map(it => it.ID);
    },
    checkItemAll: {
      get() {
        return this.itemDataIds.length > 0 && this.checkedIDList.length === this.itemDataIds.length;
      },
      set(bool) {
        const list = bool ? this.itemData.List : [];
        this.$emit('change', [this.checkedIDList, list]);
      },
    },
    isIndeterminateAll() {
      return this.checkedIDList.length > 0 && this.checkedIDList.length < this.itemDataIds.length;
    },
  },
  methods: {
    change(item) {
      const bool = !this.checkedIDList.includes(item.ID);
      const lastCheckedList = this.itemData.List.filter(it => this.checkedIDList.includes(it.ID));
      const list = bool ? [...lastCheckedList, item] : lastCheckedList.filter(it => it.ID !== item.ID);
      this.$emit('change', [lastCheckedList.map(it => it.ID), list]);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-material-select-dialog-comp-content-item-wrap {
  > .header {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    > .extend-box {
      font-size: 12px;
      width: 70px;
      cursor: pointer;
      display: flex;
      user-select: none;
      justify-content: center;
      > i {
        font-size: 12px;
        color: #989898;
        margin-left: 5px;
        border-radius: 50%;
        background-color: #f5f5f5;
        width: 15px;
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        // padding-top: 1px;
      }
      > span {
        position: relative;
        top: 1px;
        color: #a2a2a2;
      }
    }
    > .el-checkbox {
      min-width: 125px;
      .el-checkbox__label {
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  > .content {
    padding-left: 10px;
    padding-bottom: 13px;
    > .el-checkbox {
      width: 150px;
      margin-right: 6px;
      margin-bottom: 14px;
      .el-checkbox__label {
        max-width: 122px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }
}
</style>
