<template>
  <CommonDialogComp
    width="700px"
    top='15vh'
    :title="title"
    :visible="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-period-manage-module-composition-solution-item-save-dialog-comp-wrap"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="185px" hide-required-asterisk @submit.native.prevent>
      <el-form-item
        label="工期名称："
        prop='Name'
        :rules="[
          { required: true, message: '工期名称不能为空'}
        ]"
      >
        <el-input v-model.trim="ruleForm.Name" show-word-limit maxlength="8" size="small"></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    saveData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加工期',
      ruleForm: {
        ID: '',
        Name: '',
        ProductID: '',
      },
    };
  },
  methods: {
    async onSubmit() { // 提交
      const bool = await this.$refs.ruleForm.validate().catch(() => {});
      if (!bool) return;
      const temp = { ...this.ruleForm };
      this.$emit('submit', temp);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.$refs.ruleForm.resetFields();
    },
    initEditData() { // 数据初始化方法
      this.title = this.saveData.ID ? '编辑工期' : '添加工期';
      this.ruleForm = { ...this.saveData };
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-period-manage-module-composition-solution-item-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 30px;
    padding-bottom: 10px;
    padding-top: 60px;
    height: 93px;
    .el-form {
      .el-form-item__label {
        font-size: 14px;
        color: #888E99;
      }
      .el-input {
        width: 350px;
      }
      .el-form-item__content {
        > p {
          font-size: 12px;
          color: #888E99;
          margin-top: 25px;
          height: 10px;
          padding-top: 4px;
          width: 360px;
          border-top: 1px solid #eee;
        }
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 25px;
    .dialog-footer > p > button.el-button--default {
      margin-left: 30px;
    }
  }
}
</style>
