<template>
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  :width="width"
  v-dialogDrag
  :modal='false'
  class="mp-img-style-header mp-erp-common-check-box-dialog-comp-wrap"
  :before-close="handleClose">
  <CheckboxGroupComp :showTitle='false' :useLabel="false" :itemList='list' :defaultProps='defaultProps' v-model="checkList" />
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="onSubmitClick">{{submitText}}</el-button>
    <el-button @click="handleClose">取消</el-button>
  </span>
</el-dialog>
<!-- <CheckboxDialogComp // ----- 使用示例
  :visible.sync='addNewProductVisible'
  v-model="productList"
  :list='OperatorKeyValueList'
  title="复选弹窗组件"
  :defaultProps="{label: 'name', value: 'ID'}"
  /> -->
</template>

<script>
import CheckboxGroupComp from '../CheckboxGroupComp.vue';

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
  },
  components: {
    CheckboxGroupComp,
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
  },
  data() {
    return {
      checkList: [],
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    onSubmitClick() {
      if (!this.dialogVisible) return;
      this.$emit('change', this.checkList);
      this.handleClose();
    },
  },
  watch: {
    visible(bool) {
      if (bool) {
        this.checkList = this.value.map(it => {
          if (Object.prototype.toString.call(it) === '[object Object]') return it;
          if (typeof it === 'string') return { [this.defaultProps.value]: it };
          return it;
        });
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-check-box-dialog-comp-wrap {
  .el-dialog__header {
    > span::before {
      background: url(../../../assets/images/Compile.png) no-repeat center;
    }
    border-radius: 2px 2px 0px 0
  }

  .el-dialog__body {
    .el-checkbox-group {
      .el-checkbox {
        margin-bottom: 21px;
        margin-right: 20px;
        .el-checkbox__label {
          font-size: 13px;
          width: 91px;
          overflow: hidden;
          // text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 16px;
          vertical-align: middle;
        }
      }
    }
  }

  .el-dialog__footer {
    display: flex;
    justify-content: center;
    > .dialog-footer {
      padding: 10px 0;
      > button {
        height: 30px;
        width: 120px;
        padding: 0;
        border-radius: 2px;
        & + button {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
