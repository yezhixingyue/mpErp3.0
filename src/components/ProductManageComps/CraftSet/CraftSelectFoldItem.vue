<template>
  <div v-if="itemData" class="mp-erp-comps-pruduct-module-usable-craft-select-dialog-comp-content-item-wrap">
    <div class="header">
      <span class="mp-common-title-wrap">{{itemData.ClassName}}</span>
      <div class="extend-box" @click="extend = !extend">
        <span v-if="!extend">展开</span>
        <span v-else>收起</span>
        <i v-if="!extend" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </div>
    </div>
    <div v-show="extend" class="content">
      <el-checkbox :value='value.includes(it.ID)' @change='change(it)' v-for="it in itemData.children" :key="it.ID" :title="it.Name">
        {{it.Name}}
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
  },
  methods: {
    change(item) {
      this.$emit('change', item);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-usable-craft-select-dialog-comp-content-item-wrap {
  > .header {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    > span {
      color: #585858;
      margin-right: 20px;
      min-width: 80px;
    }
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
  }
  > .content {
    padding-bottom: 13px;
    > .el-checkbox {
      width: 125px;
      margin-right: 5px;
      margin-bottom: 14px;
      .el-checkbox__label {
        max-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        font-size: 12px;
        vertical-align: text-bottom;
      }
    }
  }
}
</style>
