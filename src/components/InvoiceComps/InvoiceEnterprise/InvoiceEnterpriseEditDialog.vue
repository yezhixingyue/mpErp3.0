<template>
  <CommonDialogComp
      width="625px"
      top="18vh"
      title="修改资质"
      :visible.sync="localVisible"
      @submit="submitForm"
      @cancle="localVisible = false"
      @closed="onClosed"
      @open="onOpen"
      class="mp-erp-invoice-enterprise-item-change-comp-dialog-comp-wrap"
    >
      <InvoiceMakeupForm :originEnterpriseData="originEnterpriseData" onlyEnterprise ref="oForm" @submit="onSubmit"  />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../packages/CommonDialogComp';
import InvoiceMakeupForm from '../../../packages/InvoiceComps/InvoiceMakeupForm/index.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curEditItemData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CommonDialogComp,
    InvoiceMakeupForm,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
  },
  data() {
    return {
      originEnterpriseData: null,
    };
  },
  methods: {
    onOpen() {
      this.originEnterpriseData = { ...this.curEditItemData };
    },
    onClosed() {
      this.$refs.oForm.clearForm();
    },
    submitForm() {
      this.$refs.oForm.submitForm();
    },
    onSubmit(e) {
      if (!e) return;
      const { EnterpriseName, CreditCode, RegisteredAddress, RegisteredTelephone, OpeningBank, BankAccount } = e;
      if (this.originEnterpriseData) {
        const old = this.originEnterpriseData;
        const str1 = `${old.EnterpriseName}${old.CreditCode}${old.RegisteredAddress}${old.RegisteredTelephone}${old.OpeningBank}${old.BankAccount}`;
        const str2 = `${EnterpriseName}${CreditCode}${RegisteredAddress}${RegisteredTelephone}${OpeningBank}${BankAccount}`;
        if (str1 === str2) {
          this.messageBox.failSingleError('保存失败', '发票资质未发生变化');
          return;
        }
      }
      const item = { ...this.curEditItemData, ...e, ModifyTime: this.$utils.getFormatDateString() };
      const { CustomerID } = this.originEnterpriseData || {};
      const temp = { EnterpriseName, CreditCode, RegisteredAddress, RegisteredTelephone, OpeningBank, BankAccount, CustomerID };
      this.$emit('submit', [item, temp]);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-enterprise-item-change-comp-dialog-comp-wrap {
  .el-dialog__body {
    padding-left: 55px;
  }
}
</style>
