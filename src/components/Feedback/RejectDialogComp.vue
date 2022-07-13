<template>
  <CommonDialogComp
    width="500px"
    top='30vh'
    title="驳回"
    :visible.sync="visible"
    cancelText='取消'
    @cancle="onCancle"
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-comps-reject-dialog-comp-wrap"
   >
   <!-- <p slot="title"><img src="@/assets/images/reject.png" alt="">aaaaa</p> -->
   <template>
    <el-form :model="RejectForm" status-icon ref="ruleForm" label-width="110px" class="demo-ruleForm" label-position="left">
      <el-form-item label="处理意见：" required>
        <TextareaInput v-model.trim="RejectForm.Opinion" :showWordLimit='true' :maxlength="300" placeholder="请输入处理意见" autocomplete="off">
        </TextareaInput>
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
    paramsData: {
      type: Object,
    },
  },
  components: {
    CommonDialogComp,
    TextareaInput,
  },
  computed: {
    PermissionObj() {
      if (this.Permission?.PermissionList?.PermissionManageCustomer?.Obj) {
        return this.Permission.PermissionList.PermissionManageCustomer.Obj;
      }
      return {};
    },


  },
  data() {
    return {
      a: false,
      value1: '',
      loading: false,
      RejectForm: {
        AfterSaleCode: this.paramsData.AfterSaleCode,
        Opinion: '',
      },
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.RejectForm.Opinion = '';
      this.$emit('cloce');
    },
    async onSubmit() { // 仅价格详情使用
      if (!this.RejectForm.Opinion) {
        this.messageBox.failSingleError('操作失败', '请输入处理意见');
      } else {
        this.$emit('submit', this.RejectForm);
      }
    },
    onClosed() {
      this.onCancle();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-reject-dialog-comp-wrap{
  .el-dialog{
    .el-dialog__header{
       span::before{
          display: inline-block;
          background: url('../../assets/images/reject.png') no-repeat center #26BCF9;
          background-size: 15px 15px;
          content: "";
          display: inline-block;
          height: 19px;
          width: 19px !important;
          vertical-align: -15%;
          margin-right: 10px;
          border-radius: 50%;
       }
    }
  }
}
</style>
