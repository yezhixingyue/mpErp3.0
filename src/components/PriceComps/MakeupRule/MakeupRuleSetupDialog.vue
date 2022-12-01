<template>
  <CommonDialogComp
    width="700px"
    top='13vh'
    :title="title"
    :visible="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-price-module-makeup-rule-save-dialog-comp-wrap"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px" class="demo-ruleForm" @submit.native.prevent>
      <el-form-item required>
        <el-col :span="7">
          <el-form-item prop="ColumnNumber">
            <el-input size="small" v-model.trim.number="ruleForm.ColumnNumber" maxlength="9" style="width: 100px;"></el-input>
            <span>列</span>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1">X</el-col>
        <el-col :span="7">
          <el-form-item prop="RowNumber">
            <el-input size="small" v-model.trim.number="ruleForm.RowNumber" maxlength="9" style="width: 100px;"></el-input>
            <span>行</span>
          </el-form-item>
        </el-col>
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
    EditData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加拼版规则',
      ruleForm: {
        ID: '',
        RowNumber: '',
        ColumnNumber: '',
      },
      rules: {
        RowNumber: [
          { required: true, message: '请输入列', trigger: 'blur' },
          { type: 'integer', min: 1, message: '应为大于0的正整数类型', trigger: 'blur' },
        ],
        ColumnNumber: [
          { required: true, message: '请输入行', trigger: 'blur' },
          { type: 'integer', min: 1, message: '应为大于0的正整数类型', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() { // 提交
      const bool = await this.$refs.ruleForm.validate().catch(() => {});
      if (bool) this.$emit('submit', this.ruleForm);
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
      this.title = this.EditData ? '编辑拼版规则' : '添加拼版规则';
      const ID = this.EditData ? this.EditData.ID : '';
      const RowNumber = this.EditData ? this.EditData.RowNumber : '';
      const ColumnNumber = this.EditData ? this.EditData.ColumnNumber : '';
      this.ruleForm = {
        ID,
        RowNumber,
        ColumnNumber,
      };
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-makeup-rule-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    height: 100px;
    padding-top: 80px;
    .el-form-item__content {
      .el-form-item__content {
        > span {
          margin-left: 7px;
          color: #A2A2A2;
          font-size: 14px;
        }
      }
      .line {
        font-size: 12px;
        color: #585858;
      }
    }
  }

}
</style>
