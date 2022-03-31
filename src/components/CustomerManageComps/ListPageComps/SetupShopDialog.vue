<template>
  <CommonDialogComp
    width="700px"
    top='18vh'
    title="设置店铺"
    :visible.sync="visible"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    :disabled="!value"
    class="mp-erp-comps-customer-setup-module-customer-shop-setup-dialog-comp-wrap">
    <span class="label">店铺：</span>
    <el-select v-model="value" placeholder="请选择" filterable size="small">
      <el-option
        v-for="item in shopList"
        :key="item.ShopId"
        :label="item.Name"
        :value="item.ShopId">
      </el-option>
    </el-select>
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
    CustomerID: {
      type: String,
      default: '',
    },
    ShopID: {
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      shopList: [],
      value: '',
    };
  },
  methods: {
    onCancle() {
      this.$emit('update:visible', false);
    },
    async onOpen() {
      const resp = await this.api.getThirdPartyShopList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.shopList = resp.data.Data;
        this.value = this.ShopID;
      }
    },
    onClosed() {
      this.shopList = [];
      this.value = '';
    },
    async onSubmit() {
      if (!this.value) return;
      const resp = await this.api.getCustomerShopSetup(this.CustomerID, this.value).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const t = this.shopList.find(it => it.ShopId === this.value);
          if (t) this.$emit('shopSetup', t);
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-setup-module-customer-shop-setup-dialog-comp-wrap {
  .el-dialog__body {
    height: 75px;
    text-align: center;
    padding-top: 80px;
    .label {
      margin-right: 10px;
    }
    .el-input {
      width: 260px;
    }
  }
}
</style>
