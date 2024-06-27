<template>
  <CommonDialogComp
    width="500px"
    top='30vh'
    title="挂起售后:"
    :visible="visible"
    cancelText='取消'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-suspend-dialog-comp-wrap"
   >
   <template>
    <el-form :model="SuspendForm" status-icon ref="ruleForm" label-width="80px" class="demo-ruleForm" label-position="right">
      <el-form-item label="挂起原因:">
        <el-radio-group v-model="SuspendForm.Reason">
          <el-radio :label="3">等待客户返货</el-radio>
          <el-radio :label="6">等待专家确认是否存在问题</el-radio>
          <el-radio :label="9">等待客户确认是否进行售后</el-radio>
          <el-radio :label="9">暂时与客户协商不成功</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注:">
        <TextareaInput
        v-model.trim="SuspendForm.Remark" show-word-limit :maxlength="300" placeholder="请输入挂起原因" autocomplete="off"></TextareaInput>
        <p style="margin-top: 5px; color: #AEAEAE;">(选填，客户不可见)</p>
      </el-form-item>
    </el-form>
   </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import TextareaInput from '@/components/common/TextareaInput';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonDialogComp,
    TextareaInput,
  },
  data() {
    return {
      loading: false,
      DeliverToForma: '',
      DeliverToFormb: '',
      SuspendForm: {
        Reason: '',
        Remark: '',
      },
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.DeliverToForm = {
        AfterSaleCode: '',
        Reason: '',
        Remark: '',
      };
      this.$emit('cloce');
    },
    onSubmit() {

    },
    onOpen() {
      this.getCustomerData();
    },
    onClosed() {
      this.onCancle();
    },
    async getCustomerData() { // 获取客户数据
      console.log('getCustomerData');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-suspend-dialog-comp-wrap{
  .el-dialog__body{
    padding-top: 20px;
    padding-bottom: 0;
    .demo-ruleForm{
      .el-form-item{
        margin-bottom: 20px;
      }
      .el-form-item__label{
        font-weight: 700;
        line-height: 15px;
      }
      .el-radio-group{
        display: flex;
        flex-direction: column;
        .el-radio + .el-radio{
          margin-top: 10px;
        }
      }
      .mp-textarea, .el-textarea, textarea{
        height: 90px;
      }
    }
  }
}
</style>
