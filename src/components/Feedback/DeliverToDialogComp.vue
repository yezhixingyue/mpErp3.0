<template>
  <CommonDialogComp
    width="500px"
    top='30vh'
    title="转他人处理"
    :visible.sync="visible"
    cancelText='取消'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-comps-deliver-to-dialog-comp-wrap"
   >
   <template>
    <el-form :model="DeliverToForm" status-icon ref="ruleForm" label-width="110px" class="demo-ruleForm" label-position="left">
      <el-form-item label="选择人员：" required>
        <el-select style="width:100%;" filterable v-model="DeliverToForm.NextOperaterID" placeholder="请选择转交人">
          <el-option v-for="item in staffList" :key="item.StaffID"
            :label="item.StaffName"
            :value="item.StaffID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转交原因：" required>
        <TextareaInput
        v-model="DeliverToForm.Reason" show-word-limit :maxlength="300" placeholder="请输入转交原因" autocomplete="off"></TextareaInput>
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
  data() {
    return {
      loading: false,
      staffList: null,
      DeliverToForm: {
        AfterSaleCode: this.paramsData.AfterSaleCode,
        NextOperaterID: '',
        Reason: '',
      },
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.DeliverToForm = {
        AfterSaleCode: this.paramsData.AfterSaleCode,
        NextOperaterID: '',
        Reason: '',
      };
      this.$emit('cloce');
    },
    onSubmit() {
      if (!this.DeliverToForm.NextOperaterID) {
        this.messageBox.failSingleError('操作失败', '请选择转交人');
      } else if (!this.DeliverToForm.Reason) {
        this.messageBox.failSingleError('操作失败', '请输入转交原因');
      } else {
        this.$emit('submit', this.DeliverToForm);
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
      this.api.getOperateStaff().then(res => {
        this.staffList = res.data.Data;
      });
      this.loading = false;
    },

  },
};
</script>
<style lang='scss'>
.mp-erp-comps-deliver-to-dialog-comp-wrap{
  .el-dialog{
    .el-dialog__header{
       span::before{
          display: inline-block;
          background: url('../../assets/images/haoyou.png') no-repeat center #26BCF9;
          background-size: 14px 14px;
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
