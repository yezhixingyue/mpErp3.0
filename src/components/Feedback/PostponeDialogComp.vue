<template>
  <CommonDialogComp
    width="500px"
    top='30vh'
    title="挂起"
    :visible="visible"
    cancelText='取消'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-comps-postpone-dialog-comp-wrap"
   >
   <template>
    <el-form :model="PostponeRuleForm" status-icon ref="ruleForm"  label-width="125px" class="demo-ruleForm" label-position="right">
      <el-form-item style="margin:0" label="挂起原因：" required>
        <TextareaInput
         v-model.trim="PostponeRuleForm.Reason" type="textarea" show-word-limit :maxlength="300" placeholder="请输入挂起原因"></TextareaInput>
        <el-checkbox v-model="PostponeRuleForm.RemarkIsShow">挂起原因前台客户可见</el-checkbox>
      </el-form-item>
      <el-form-item style="margin:0" label="下次处理时间：" required>
        <div>
          <el-date-picker
            style="width:180px;margin-right:15px"
            v-model="PostponeRuleForm.NextOperateTime"
            :disabled="this.PostponeRuleForm.NextOperateType === 0"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <el-switch
            v-model="PostponeRuleForm.NextOperateType"
            active-color="#26BCF9"
            inactive-color="#DCDFE6"
            :active-value="0"
            :inactive-value="1">
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
  },
  data() {
    return {
      a: false,
      value1: '',
      loading: false,
      PostponeRuleForm: {
        AfterSaleCode: this.paramsData.AfterSaleCode,
        RemarkIsShow: true,
        Reason: '',
        NextOperateType: 1,
        NextOperateTime: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; // 如果没有后⾯的-8.64e7就是不可以选择今天的
        },
      },
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.PostponeRuleForm = {
        AfterSaleCode: this.paramsData.AfterSaleCode,
        RemarkIsShow: true,
        Reason: '',
        NextOperateType: 1,
        NextOperateTime: '',
      };
      this.$emit('cloce');
    },
    async onSubmit() { // 仅价格详情使用
      if (!this.PostponeRuleForm.Reason) {
        this.messageBox.failSingleError('操作失败', '请输入挂起原因');
      } else if (this.PostponeRuleForm.NextOperateType === 1 && !this.PostponeRuleForm.NextOperateTime) {
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
  watch: {
    'PostponeRuleForm.NextOperateType': {
      handler(val) {
        if (val === 0) {
          this.PostponeRuleForm.NextOperateTime = '';
        }
      },
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
