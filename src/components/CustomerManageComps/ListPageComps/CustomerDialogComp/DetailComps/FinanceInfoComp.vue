<template>
  <li class="mp-erp-customer-detail-dialog-finance-info-comp-wrap" v-if="customer">
    <p class="title">
      <img src="@/assets/images/c-f.png" alt="">
      <span>财务信息</span>
    </p>
    <ul class="content">
      <li>
        <label>可用余额：</label>
        <span class="is-bold is-pink">￥{{customer.FundInfo.Amount | formatNumber}}元</span>
      </li>
      <li>
        <label>可用印豆：</label>
        <span class="is-bold is-pink" style="margin-left:12px">{{customer.FundInfo.BeanNumber}}个</span>
      </li>
      <li>
        <label>信用额度：</label>
        <span class="is-bold is-pink indent">{{customer.FundInfo.TotalCredit | formatNumber}}元</span>
      </li>
      <li>
        <label>可用信用额度：</label>
        <span class="is-bold is-pink indent">{{canUseCredit | formatNumber}}元</span>
      </li>
    </ul>
    <ReChangeDialog :visible.sync='visible' :CustomerID='CustomerID' :type='type' @recharge='onRechargeClick' />
    <div class="footer">
      <el-button size="small" @click="onAmountChangeClick('topUp')" type="warning" v-if="PermissionObj.Charge">手动充值</el-button>
      <el-button size="small" @click="onAmountChangeClick('topDown')" class="cancel-blue-btn" v-if="PermissionObj.Deduct">手动扣款</el-button>
    </div>
  </li>
</template>

<script>
import ReChangeDialog from './ReChangeDialog.vue';
import { ReChangeTypeEnum } from '../../../../../store/customerManage/Enums';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
    PermissionObj: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ReChangeDialog,
  },
  filters: {
  },
  data() {
    return {
      visible: false,
      type: -1, // 16 为充值 23为扣款  使用枚举
    };
  },
  computed: {
    canUseCredit() {
      if (this.customer && this.customer.FundInfo) {
        const { UsedCredit, TotalCredit } = this.customer.FundInfo;
        if (this.$utils.getValueIsOrNotNumber(TotalCredit) && this.$utils.getValueIsOrNotNumber(UsedCredit)) {
          return TotalCredit - UsedCredit;
        }
      }
      return '/';
    },
    CustomerID() {
      return this.customer ? this.customer.CustomerID : '';
    },
  },
  methods: {
    onAmountChangeClick(key) { // 点击操作按钮
      if (!this.customer) return;
      this.type = ReChangeTypeEnum[key] ? ReChangeTypeEnum[key].ID : -1;
      if (this.type !== -1) this.visible = true;
    },
    async onRechargeClick(data, title) { // 充值操作
      if (!this.customer || !this.customer.CustomerID || !data || !title) return;
      const resp = await this.api.getManualRecharge(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const { Type, Amount } = data;
          const increment = Type === ReChangeTypeEnum.topUp.ID ? Amount : -Amount;
          this.$emit('recharge', increment);
          this.visible = false;
        };
        this.messageBox.successSingle(title, cb, cb);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-detail-dialog-finance-info-comp-wrap {
  width: 348px;
  height: 270px;
  margin: 0 20px;
  > ul {
    > li {
      label {
        min-width: 7em !important;
      }
      .indent {
        text-indent: 1em;
      }
    }
  }
}
</style>
