<template>
  <CommonDialogComp
    width="800px"
    top='12vh'
    title="设置客户隐藏"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-craft-hidden-set-dialog-comp-wrap"
   >
    <el-checkbox v-model="it.HiddenToCustomer" v-for="it in checkList" :key="it.ID" :title="it.Name">{{it.Name}}</el-checkbox>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

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
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      checkList: [],
    };
  },
  computed: {
  },
  methods: {
    onSubmit() {
      this.$emit('change', this.checkList);
      // const t = this.checkList.find(it => !it.HiddenToCustomer);
      // if (t) this.$emit('change', this.checkList);
      // else {
      //   this.messageBox.failSingleError('保存失败', '不能设置全部工艺均对客户隐藏');
      // }
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.checkList = [];
    },
    initEditData() { // 数据初始化方法
      this.checkList = JSON.parse(JSON.stringify(this.value));
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-craft-hidden-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 50px;
    padding-right: 20px;
    min-height: 300px;
    max-height: 520px;
    overflow-y: auto;
    .el-checkbox {
      width: 135px;
      margin-right: 5px;
      margin-bottom: 12px;
    }
    .el-checkbox__label {
      font-size: 12px;
      color: #585858;
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      vertical-align: middle;
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
