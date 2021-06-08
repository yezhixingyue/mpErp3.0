<template>
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  :width="width"
  :top='top'
  v-dialogDrag
  :modal='false'
  @open='onOpen'
  @opened='onOpened'
  @close='onClose'
  @closed='onClosed'

  class="mp-img-style-header mp-erp-common-dialog-comp-wrap"
  :before-close="onCancleClick">
  <slot></slot>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="onSubmitClick" v-if="showSubmit" :disabled='disabled'>{{submitText}}</el-button>
    <el-button type="danger"  @click="onDangerClick" v-if="showDanger">{{dangerText}}</el-button>
    <el-button @click="onCancleClick">{{cancelText}}</el-button>
  </span>
</el-dialog>
</template>

<script>
// ---- 使用方式示例：
// <CommonDialogComp width='580px' title="测试弹窗" :visible.sync='addNewProductVisible' @submit="onTestDialogSubmit" @cancle="onTestDialogCancle" >
//   测试弹窗组件 --- slot内容区
// </CommonDialogComp>

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
    title: {
      type: String,
      default: '提示',
    },
    width: {
      default: '30%',
    },
    top: {
      type: String,
      default: '15vh',
    },
    showSubmit: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: '保存',
    },
    dangerText: {
      type: String,
      default: '重新生成',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showDanger: {
      type: Boolean,
      default: false,
    },
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
    onCancleClick() {
      this.$emit('cancle');
    },
    onSubmitClick() {
      if (!this.dialogVisible) return;
      this.$emit('submit');
    },
    onDangerClick() {
      this.$emit('danger');
    },
    onOpen() {
      this.$emit('open');
    },
    onOpened() {
      this.$emit('opened');
    },
    onClose() {
      this.$emit('close');
    },
    onClosed() {
      this.$emit('closed');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-dialog-comp-wrap {
  > .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    > span{
      font-size: 15px;
      color: #888E99;
      &::before {
        width: 3px;
        background-color: #26bcf9;
      }
    }
    border-radius: 5px 5px 0px 0;
    background-color: #fff;
    height: 30px;
    line-height: 30px;
    position: relative;
    .el-dialog__headerbtn {
      top: 13px;
    }
    &::after {
      width: calc(100% - 22px);
      position: absolute;
      height: 1px;
      background-color: #eee;
      left: 11px;
      bottom: 0;
      content: '';
    }
  }

  // .el-dialog__body {
  // }

  .el-dialog__footer {
    display: flex;
    justify-content: center;
    > .dialog-footer {
      padding: 10px 0;
      > button {
        height: 35px;
        width: 120px;
        padding: 0;
        border-radius: 3px;
        & + button {
          margin-left: 20px;
        }
        &.el-button--default {
          border-color: #26bcf9;
          color: #26bcf9;
          &:active {
            border-color: #428dfa;
            color: #428dfa;
          }
        }
        &.el-button--primary {
          background: linear-gradient(to right, #26bcf9, #35dff9);
          border: none;
          &:hover {
            opacity: 0.88;
          }
          &:active {
            background: linear-gradient(to right, #428dfa, #26bcf9);
          }
        }
        &.el-button--danger {
          background: #FF3769;
          border-color: #FF3769;
          &:hover {
            opacity: 0.88;
          }
          &:active {
            border-color: #e4083f;
            background: #e4083f;
          }
        }
        &.is-disabled {
          background: #cbcbcb !important;
          opacity: 1 !important;
        }
      }
    }
  }
}
</style>
