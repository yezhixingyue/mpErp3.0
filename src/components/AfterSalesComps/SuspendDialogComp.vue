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
        <el-radio-group v-model="SuspendForm.ReasonType">
          <el-radio v-for="item in HangReasonList" :key="item.ID" :label="item.ID">{{item.Title}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注:">
        <TextareaInput
        v-model.trim="SuspendForm.HangRemark" show-word-limit :maxlength="300" placeholder="请输入挂起原因" autocomplete="off"></TextareaInput>
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
      HangReasonList: [],
      SuspendForm: {
        ReasonType: '',
        HangRemark: '',
      },
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.SuspendForm = {
        ReasonType: '',
        HangRemark: '',
      };
      this.$emit('cloce');
    },
    onSubmit() {
      this.$emit('submit', this.SuspendForm);
    },
    onOpen() {
      this.getAfterSaleOrderHangReasonList();
    },
    onClosed() {
      this.onCancle();
    },
    async getAfterSaleOrderHangReasonList() {
      this.api.getAfterSaleOrderHangReasonList().then(res => {
        if (res.data.Status === 1000) {
          this.HangReasonList = res.data.Data;
        }
      });
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
