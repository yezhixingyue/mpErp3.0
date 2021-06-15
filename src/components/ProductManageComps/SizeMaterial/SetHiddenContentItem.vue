<template>
  <div v-if="itemData" class="mp-erp-comps-pruduct-module-material-hidden-drawer-comp-content-item-wrap">
    <div class="header">
      <el-checkbox v-model="checkItemAll" :indeterminate="isIndeterminateAll">{{itemData.Name}}</el-checkbox>
      <div class="extend-box" @click="extend = !extend" v-if="showContent">
        <span v-if="!extend">展开</span>
        <span v-else>收起</span>
        <i v-if="!extend" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </div>
    </div>
    <div v-show="showContent && extend" class="content">
      <el-checkbox :value="it.HiddenToCustomer" @change='change(it)' v-for="it in itemData.List" :key="'item-hidden'+it.ID">
        {{it.itemContent}}
      </el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: null,
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
    checkItemAll: {
      get() {
        const t = this.itemData.List.find(it => !it.HiddenToCustomer);
        return !t && this.itemData.List.length > 0;
      },
      set(bool) {
        const list = bool ? this.itemData.List : [];
        this.$emit('change', list);
      },
    },
    isIndeterminateAll() {
      const t1 = this.itemData.List.find(it => !it.HiddenToCustomer);
      const t2 = this.itemData.List.find(it => it.HiddenToCustomer);
      return !!(t1 && t2);
    },
  },
  methods: {
    change({ ID }) {
      this.$emit('change', ID);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-material-hidden-drawer-comp-content-item-wrap {
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
