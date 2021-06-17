<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-single-craft-set-dialog-comp-wrap"
   >
    单选工艺设置弹窗
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';

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
    value: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '',
    };
  },
  computed: {
  },
  methods: {
    onSubmit() {
      // this.$emit('submit', this.localCraftList);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
    },
    initEditData() { // 数据初始化方法
      if (this.value) {
        this.title = '编辑单选工艺';
      } else {
        this.title = '添加单选工艺';
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-single-craft-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 50px;
    padding-right: 20px;
    height: 548px;
    > .el-tabs {
      > .el-tabs__header {
        border: none;
        .el-tabs__nav {
          border: none;
          .el-tabs__item {
            border: 1px solid #e5e5e5;
            border-right: none;
            height: 32px;
            line-height: 30px;
            padding: 0 25px;
            color: #444;
            font-size: 14px;
            transition: none;
            user-select: none;
            box-sizing: border-box;
            &:hover {
              color: #444;
              background-color: #26bdf91f;
            }
            &.is-active {
              background-color: #26BCF9;
              color: #fff;
              border-color: #26BCF9;
              padding-left: 16px;
              padding-right: 20px;
              &::before {
                content: '';
                display: inline-block;
                width: 4px;
                height: 4px;
                background-color: #fff;
                border-radius: 50%;
                vertical-align: middle;
                margin-right: 10px;
              }
              & + .el-tabs__item {
                border-left: 1px solid #fff;
              }
            }
            &:first-of-type {
              border-radius: 3px 0px 0px 3px;
            }
            &:last-of-type {
              border-radius: 0px 3px 3px 0px;
              box-shadow: 1px 0 0 0 #e5e5e5;
              &.is-active {
                box-shadow: 1px 0 0 0 #26BCF9;
              }
            }
          }
        }
      }
      > .el-tabs__content {
        .list-content {
          height: 480px;
          overflow-y: auto;
          padding-top: 20px;
        }
      }
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      button + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
