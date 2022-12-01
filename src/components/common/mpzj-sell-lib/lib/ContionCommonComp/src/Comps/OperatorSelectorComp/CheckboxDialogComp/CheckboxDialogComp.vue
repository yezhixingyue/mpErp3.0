<template>
  <CommonDialogComp
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    @cancel="handleClose"
    @open="open"
    @submit="onSubmitClick"
    class="mp-img-style-header mp-erp-common-check-box-dialog-comp-wrap"
    >
    <el-checkbox v-model="checkedAll" v-if="checkAll" :indeterminate="isIndeterminate" class="check-all-box">全选</el-checkbox>
    <LocalCheckGroup :showTitle='false' :useLabel="false" :itemList='list' :defaultProps='defaultProps' v-model="checkList" />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../../CommonDialogComp';
import LocalCheckGroup from './LocalCheckGroup.vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => ([]),
    },
    value: {
      type: Array,
      default: () => [],
    },
    width: {
      type: String,
      default: '580px',
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'name',
        value: 'ID',
      }),
    },
    title: {
      type: String,
      default: '提示',
    },
    submitText: {
      type: String,
      default: '保存',
    },
    checkAll: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LocalCheckGroup,
    CommonDialogComp,
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
    checkedAll: {
      get() {
        return this.checkList.length === this.list.length;
      },
      set(val) {
        if (val) {
          this.checkList = this.list.map((it) => ({ [this.defaultProps.value]: it[this.defaultProps.value] }));
        } else {
          this.checkList = [];
        }
      },
    },
    isIndeterminate() {
      return this.checkList.length > 0 && this.checkList.length < this.list.length;
    },
  },
  data() {
    return {
      checkList: [],
    };
  },
  methods: {
    open() {
      const IDList = this.list.map((it) => it[this.defaultProps.value]);
      this.checkList = this.value.map((it) => {
        if (Object.prototype.toString.call(it) === '[object Object]') return it;
        if (typeof it === 'string') return { [this.defaultProps.value]: it };
        return it;
      }).filter((it) => IDList.includes(it[this.defaultProps.value]));
    },
    handleClose() {
      this.dialogVisible = false;
    },
    onSubmitClick() {
      if (!this.dialogVisible) return;
      this.$emit('change', this.checkList);
      this.handleClose();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-check-box-dialog-comp-wrap {
  .el-dialog__body {
    padding-left: 25px;
    .el-checkbox-group {
      .el-checkbox {
        margin-bottom: 21px;
        margin-right: 15px;
        .el-checkbox__label {
          font-size: 12px;
          width: 216px;
          overflow: hidden;
          white-space: nowrap;
          line-height: 16px;
          vertical-align: -2px;
        }
      }
    }
    .check-all-box {
      padding-bottom: 12px;
    }
  }

}
</style>
