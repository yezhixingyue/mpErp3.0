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
    class="mp-erp-comps-price-module-price-item-part-mixin-set-save-dialog-comp-wrap"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="180px" hide-required-asterisk @submit.native.prevent>
      <el-form-item
        label="默认："
        prop='radio'
        :rules="[
          { validator: validator, trigger: 'change' },
        ]"
      >
        <el-radio-group v-model="ruleForm.radio">
          <el-radio :label="true">允许混拼</el-radio>
          <el-radio :label="false">不允许混拼</el-radio>
        </el-radio-group>
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
  computed: {
  },
  data() {
    return {
      title: '设置混拼默认行为',
      ruleForm: {
        solutionID: '',
        partID: '',
        radio: false,
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
      this.title = this.saveData.Part && this.saveData.Part.Name ? `设置多个${this.saveData.Part.Name}混拼默认行为` : '设置混拼默认行为';
      if (!this.saveData || !this.saveData.Part) {
        this.$goback();
        return;
      }
      this.ruleForm = { solutionID: this.saveData.solutionID, partID: this.saveData.Part.ID, radio: this.saveData.Part.mixinData.AllowMixture };
      this.$refs.ruleForm.resetFields();
    },
    validator(rule, value, callback) {
      if (value === this.saveData.Part.mixinData.AllowMixture) {
        callback(new Error('默认行为设置未发生变化'));
        return;
      }
      callback();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-part-mixin-set-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 100px;
    padding-bottom: 10px;
    padding-top: 90px;
    height: 135px;
    .el-form {
      .el-form-item__label {
        font-size: 14px;
        color: #888E99;
      }
      .el-radio__label {
        font-size: 12px;
        color: #585858;
      }
    }
  }

}
</style>
