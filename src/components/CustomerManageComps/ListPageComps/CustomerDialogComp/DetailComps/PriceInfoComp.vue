<template>
  <li class="mp-erp-customer-detail-dialog-price-info-comp-wrap" v-if="customer">
    <p class="title">
      <img src="@/assets/images/c-p.png" alt="">
      <span>价格信息</span>
    </p>
    <ul class="content">
      <li>
        <label>账户类型：</label>
        <span>{{accountTypeContent}}</span>
      </li>
      <template v-if="EBusinessObj">
        <li>
          <label>返现方式：</label>
          <span>{{EBusinessObj.CashBackTypeContent}}</span>
        </li>
        <li>
          <label>{{amountLabel}}</label>
          <span class="is-bold is-pink">{{EBusinessObj.MinAmount}}元</span>
        </li>
        <li>
          <label></label>
          <el-progress type="circle" :percentage="EBusinessObj.BackPercent" :width='78' :stroke-width='9' :format='formatPercent' color="#26bcf9"></el-progress>
        </li>
      </template>
    </ul>
    <div class="footer">
      <el-button v-if="EBusinessObj && PermissionObj.SetPrice" size="small" @click="onPriceDetailClick()" type="primary">价格详情</el-button>
    </div>
  </li>
</template>

<script>
import { mapState } from 'vuex';
import { CashBackTypeEnumList, CustomerPriceTypeEnum, CashBackTypeEnum } from '../../../../../store/customerManage/Enums';

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
  },
  filters: {
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('common', ['userTypeList']),
    CustomerID() {
      return this.customer ? this.customer.CustomerID : '';
    },
    accountTypeContent() { // 账户类型
      if (!this.customer) return '';
      const { Type, Grade } = this.customer;
      return `${(Type && Type.Second) || ''}${(Grade && Grade.Second) || ''}`;
    },
    EBusinessObj() { // 电商返现方式
      if (!this.customer || !this.customer.FundInfo) return null;
      const t = this.userTypeList.find(it => it.CategoryID === this.customer.Type.First);
      if (t && t.Value === CustomerPriceTypeEnum.Single.ID) {
        const { MinAmount, BackPercent, CashBackType } = this.customer.FundInfo;
        const target = CashBackTypeEnumList.find(_it => _it.ID === CashBackType);
        const CashBackTypeContent = target ? target.Name : '';
        return {
          MinAmount: MinAmount || MinAmount === 0 ? MinAmount : '-- ',
          BackPercent: BackPercent || 0,
          CashBackTypeContent,
        };
      }
      return null;
    },
    amountLabel() {
      if (this.customer.FundInfo.CashBackType === CashBackTypeEnum.Recharge.ID) return '返现最小充值金额：';
      if (this.customer.FundInfo.CashBackType === CashBackTypeEnum.Consume.ID) return '月消费金额：';
      return '';
    },
  },
  methods: {
    formatPercent(percentage) { // 设置进度条显示文字
      if (!percentage && this.customer.FundInfo.BackPercent === null) return '-- %';
      return `${percentage}%`;
    },
    onPriceDetailClick() { // 点击操作按钮
      if (!this.customer) return;
      this.$emit('jump');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-detail-dialog-price-info-comp-wrap {
  width: 278px;
  height: 270px;
  > ul {
    padding-left: 20px;
    > li {
      margin: 0 !important;
      label {
        min-width: 5em !important;
      }
      .el-progress {
        margin-top: 7px;
        margin-left: 12px;
        .el-progress__text {
          white-space: normal;
          width: 50px;
          margin-left: 14px;
          margin-top: -1px;
          color: #ff3769;
          &::after {
            content: '返现';
            display: block;
            margin-top: 4px;
            color: #888;
          }
        }
      }
    }
  }
}
</style>
