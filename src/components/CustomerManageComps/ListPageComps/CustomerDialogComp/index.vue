<template>
  <CommonDialogComp
    width="1020px"
    top='6vh'
    :title="title"
    :visible="visible"
    :cancelText='cancelText'
    :showSubmit="showSubmit"
    :cancelBlue='!showSubmit'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-comps-customer-setup-module-customer-detail-display-dialog-comp-wrap"
   >
   <template v-if="customer">
    <ul v-show="showType === 'detail'" class="detail-box">
      <BasicInfoComp :customer='customer' @changeStatus='handleChangeStatus' :disabled='!PermissionObj.Freeze' />
      <FinanceInfoComp :customer='customer' @recharge='handleRecharge' :PermissionObj='PermissionObj' />
      <PriceInfoComp :customer='customer' @jump='onJumpClick("setPrice")' :PermissionObj='PermissionObj' />
      <AuthenInfoComp :customer='customer' :getCustomerData="getCustomerData" :isGetList="(bool) => isGetList = bool"/>
      <AddressInfoComp :customer='customer' />
    </ul>
    <SetPriceComp v-show="showType === 'setPrice'" :haveEditPermission='PermissionObj.SetPrice'
     :customer='customer' @jump='onJumpClick("detail")' ref="oPriceForm" />
   </template>
  </CommonDialogComp>
</template>

<script>
import Customer from '@/store/customerManage/Customer';
import { mapState } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';
import BasicInfoComp from './DetailComps/BasicInfoComp.vue';
import FinanceInfoComp from './DetailComps/FinanceInfoComp.vue';
import PriceInfoComp from './DetailComps/PriceInfoComp.vue';
import AuthenInfoComp from './DetailComps/AuthenInfoComp.vue';
import AddressInfoComp from './DetailComps/AddressInfoComp.vue';
import SetPriceComp from './SetPriceComps/index.vue';

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
    openType: {
      type: String,
      default: 'detail',
    },
  },
  components: {
    CommonDialogComp,
    BasicInfoComp,
    FinanceInfoComp,
    PriceInfoComp,
    AuthenInfoComp,
    AddressInfoComp,
    SetPriceComp,
  },
  computed: {
    ...mapState('common', ['Permission']),
    ...mapState('customerManage', ['condition4DataList']),
    PermissionObj() {
      if (this.Permission?.PermissionList?.PermissionManageCustomer?.Obj) {
        return this.Permission.PermissionList.PermissionManageCustomer.Obj;
      }
      return {};
    },
    showSubmit() {
      return this.showType === 'setPrice' && this.PermissionObj.SetPrice;
    },
    cancelText() {
      if (this.showSubmit) return '取消';
      return '关闭';
    },
    title() {
      if (this.showType === 'detail') return '客户详情';
      if (this.showType === 'setPrice') return '设置客户价格';
      return '';
    },
  },
  data() {
    return {
      customer: null,
      showType: '',
      loading: false,
      isGetList: false, // 是否需要重新获取客户列表
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    async onSubmit() { // 仅价格详情使用
      if (this.$refs.oPriceForm) {
        const data = await this.$refs.oPriceForm.submit();
        if (data) {
          const resp = await this.api.getCustomerSetPrice(data).catch(() => null);
          if (resp && resp.data.Status === 1000) {
            const cb = () => {
              this.customer.PolicyList = JSON.parse(JSON.stringify(data.PolicyList));
              this.customer.FundInfo.CashBackType = data.FundInfo.CashBackType;
              this.customer.FundInfo.MinAmount = +data.FundInfo.MinAmount;
              this.customer.FundInfo.BackPercent = +data.FundInfo.BackPercent;
              this.$store.commit('customerManage/setCustomerItemPriceChange', [this.customer.CustomerID, data]);
            };
            this.messageBox.successSingle('保存成功', cb, cb);
          }
        }
      }
    },
    onOpen() { // 打开时初始化数据
      this.showType = this.openType;
      this.getCustomerData();
      this.isGetList = false;
    },
    onClosed() {
      this.customer = null;
      this.showType = '';
      if (this.isGetList) {
        this.$store.dispatch('customerManage/getCustomerDataList', this.condition4DataList.Page);
      }
    },
    async getCustomerData() { // 获取客户数据
      this.loading = true;
      if (this.CustomerID && this.CustomerID !== 'null') {
        const resp = await this.api.getCustomerList({ ID: this.CustomerID, FieldType: 3 }).catch(() => null);
        if (resp && resp.data.Status === 1000 && resp.data.Data && resp.data.Data.length === 1) {
          const [temp] = resp.data.Data;
          this.customer = new Customer(temp);
        }
      } else {
        this.customer = new Customer();
      }
      this.loading = false;
    },
    handleChangeStatus() { // 冻结及解冻
      if (!this.customer) return;
      this.getCustomerData();
    },
    handleRecharge(increment) { // 充值及退款
      this.customer.FundInfo.Amount = +this.customer.FundInfo.Amount + +increment;
      this.$store.commit('customerManage/setCustomerItemAmountChange', [this.customer.CustomerID, increment]);
      this.isGetList = true;
    },
    onJumpClick(type = 'setPrice') { // 跳转价格详情 -- 切换showType
      this.showType = type;
    },
  },
  watch: {
    showType(val) { // 获取产品列表数据
      if (val === 'setPrice') {
        this.$store.dispatch('common/getProductClassifyData', { key: 2 }); // 使用客户产品分类
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-setup-module-customer-detail-display-dialog-comp-wrap {
  > .el-dialog > .el-dialog__body {
    height: 640px;
    padding: 20px 15px;
    padding-bottom: 0px;
    ul.detail-box {
      display: flex;
      flex-wrap: wrap;
      > li {
        box-shadow: 0 0px 8px 0 rgba($color: #000000, $alpha: 0.2);
        box-sizing: border-box;
        padding: 10px;
        padding-bottom: 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: none;
        > p.title {
          height: 26px;
          line-height: 26px;
          display: flex;
          align-items: center;
          flex: none;
          > img {
            margin-right: 10px;
          }
          > span {
            color: #444;
            font-weight: 700;
          }
        }
        > ul.content {
          flex: 1;
          padding-top: 8px;
          > li {
            font-size: 12px;
            color: #585858;
            display: flex;
            align-items: center;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            margin: 6px 0;
            line-height: 25px;
            label {
              color: #888;
              flex: none;
              min-width: 7em;
              text-align: right;
            }
            span {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            > div {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              display: flex;
              &:first-of-type {
                flex: none;
              }
              &:not(:first-of-type) {
                label {
                  min-width: 1em !important;
                }
              }
            }
          }
        }
        > div {
          &.footer {
            height: 30px;
            padding-top: 10px;
            flex: none;
            text-align: center;
            > button {
              padding: 0;
              height: 30px;
              width: 100px;
              border-radius: 2px;
              font-size: 14px;
              line-height: 28px;
            }
          }
        }
      }
    }
  }
}
</style>
