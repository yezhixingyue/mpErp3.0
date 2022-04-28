<template>
  <CommonDialogComp
    width="500px"
    top='30vh'
    title="挂起"
    :visible.sync="visible"
    cancelText='取消'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-comps-postpone-dialog-comp-wrap"
   >
   <template>
    <el-form :model="PostponeRuleForm" status-icon ref="ruleForm" label-width="110px" class="demo-ruleForm" label-position="left">
      <el-form-item style="margin:0" label="挂起原因：" prop="pass">
        <el-input v-model="PostponeRuleForm.Reason" type="textarea" placeholder="请输入挂起原因" autocomplete="off"></el-input>
        <el-checkbox v-model="PostponeRuleForm.ApplyIsShow">挂起原因前台客户可见</el-checkbox>
      </el-form-item>
      <el-form-item style="margin:0" label="下次处理时间：" prop="checkPass">
        <div>
          <el-date-picker
            style="width:180px;margin-right:15px"
            v-model="PostponeRuleForm.NextOperateTime"
            :disabled="this.PostponeRuleForm.NextOperateType !== 0"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <el-switch
            v-model="PostponeRuleForm.NextOperateType"
            active-color="#26BCF9"
            inactive-color="#DCDFE6"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
          不确定
        </div>
      </el-form-item>
    </el-form>
   </template>
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
    paramsData: {
      type: Object,
    },

  },
  components: {
    CommonDialogComp,
  },
  computed: {
  },
  data() {
    return {
      a: false,
      value1: '',
      loading: false,
      PostponeRuleForm: {
        AfterSaleCode: this.paramsData.AfterSaleCode,
        ApplyIsShow: true,
        Reason: '',
        NextOperateType: 0,
        NextOperateTime: '',
      },
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.PostponeRuleForm = {
        AfterSaleCode: this.paramsData.AfterSaleCode,
        ApplyIsShow: true,
        Reason: '',
        NextOperateType: 0,
        NextOperateTime: '',
      };
      this.$emit('cloce');
    },
    async onSubmit() { // 仅价格详情使用
      if (!this.PostponeRuleForm.Reason) {
        this.messageBox.failSingleError('操作失败', '请输入挂起原因');
      } else if (this.PostponeRuleForm.NextOperateType === 0 && !this.PostponeRuleForm.NextOperateTime) {
        this.messageBox.failSingleError('操作失败', '请选择下次处理时间');
      } else {
        this.$emit('submit', this.PostponeRuleForm);
      }
    },
    onOpen() {
      this.getCustomerData();
    },
    onClosed() {
      this.onCancle();
    },
    async getCustomerData() { // 获取客户数据
      this.loading = true;

      this.loading = false;
    },

  },
};
</script>
<style lang='scss'>
.mp-erp-comps-postpone-dialog-comp-wrap{
  .el-dialog{
    .el-dialog__header{
       span::before{
          display: inline-block;
          background: url('../../assets/images/jian.png') no-repeat center #26BCF9;
          background-size: 10px 15px;
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
