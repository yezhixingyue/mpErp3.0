<template>
  <CommonDialogComp
    width="500px"
    top='30vh'
    title="转他人处理:"
    :visible="visible"
    cancelText='取消'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-suspend-dialog-comp-wrap"
   >
   <template>
    <el-form :model="HandOnForm" status-icon ref="ruleForm" label-width="80px" class="demo-ruleForm" label-position="right">
      <el-form-item label="接收人:">
        <select-comp
          :options='staffList'
          :title="HandOnForm.NextOperater"
          :defaultProps='{
            label: "StaffName",
            value: "StaffID",
          }'
          v-model="HandOnForm.NextOperater"
          @handleChange='handleChange'
          :filterable="true"
        />
      </el-form-item>
      <el-form-item label="转交原因:">
        <el-radio-group v-model="HandOnForm.ReasonType">
          <el-radio :label="item.ID" v-for="item in TransferReasonList" :key="item.ID">{{item.Title}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注:">
        <TextareaInput
        v-model.trim="HandOnForm.TransferRemark" show-word-limit :maxlength="300" placeholder="请输入挂起原因" autocomplete="off"></TextareaInput>
        <p style="margin-top: 5px; color: #AEAEAE;">(选填，客户不可见)</p>
      </el-form-item>
    </el-form>
   </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import TextareaInput from '@/components/common/TextareaInput';
import SelectComp from '@/components/common/SelectComp.vue';

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
    SelectComp,
  },
  data() {
    return {
      staffList: [],
      loading: false,
      TransferReasonList: [],
      HandOnForm: {
        AfterSaleCode: '',
        ReasonType: '',
        TransferRemark: '',
        NextOperater: '',
      },
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.HandOnForm = {
        AfterSaleCode: '',
        NextOperater: '',
        TransferRemark: '',
        ReasonType: 0,
      };
      this.$emit('cloce');
    },
    onSubmit() {
      this.$emit('submit', this.HandOnForm);
    },
    async getAfterSaleOrderTransferReasonList() {
      this.api.getAfterSaleOrderTransferReasonList().then(res => {
        if (res.data.Status === 1000) {
          this.TransferReasonList = res.data.Data;
        }
      });
    },
    onOpen() {
      this.getAfterSaleOrderTransferReasonList();
    },
    onClosed() {
      this.onCancle();
    },
    handleChange(ID) {
      this.HandOnForm.NextOperater = ID;
    },
    async getCustomerData() { // 获取客户数据
      if (this.staffList.length) return;
      this.api.getOperateStaff().then(res => {
        this.staffList = res.data.Data;
      });
    },
  },
  mounted() {
    this.getCustomerData();
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
        line-height: 15px;
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
      .el-form-item__content{
        line-height: 15px;
      }
      .mp-textarea, .el-textarea, textarea{
        height: 90px;
      }
      .el-select{
        .el-input{
          height: 24px;
          display: flex;
        }
      }
    }
  }
}
</style>
