<template>
  <ul class="mp-batch-upload-page-header-comps-customer-select-comp-wrap">
    <!-- 搜索区域 -->
    <li class="search">
      <CustomerRemoteSelector :disabled="disabled" @change="onCustomerChange" showBtn placeholder="请输入客户关键词" />
    </li>
    <li v-if="!customer" class="empty">
      <span>尚未选中客户！</span>
    </li>
    <template v-else>
      <li class="name is-bold">
        <span :title="customer.CustomerName && customer.CustomerName.length > 17 ? customer.CustomerName :''">{{customer.CustomerName || ''}}</span>
        <span v-if="customer.CustomerSN">（ {{customer.CustomerSN}} ）</span>
      </li>
      <li class="level is-gray"  v-if="customer.Type && customer.Grade">
        <span>{{customer.Type.Second || ''}}{{customer.Grade.Second || ''}}</span>
      </li>
      <li class="area is-gray" v-if="customer.SellArea">
        <span>{{customer.SellArea.RegionalName || ''}}{{customer.SellArea.CityName || ''}}{{customer.SellArea.CountyName || ''}}</span>
      </li>
      <li class="rechange" v-if="Amount || Amount === 0">
        <span>余额：</span>
        <span class="is-pink">￥{{Amount}}元</span>
        <template v-if="BeanNumber || BeanNumber === 0">
          <span style="margin-left:15px">印豆：</span>
          <span class="is-pink">￥{{BeanNumber}}个</span>
        </template>
        <RechargeComp :customer='customer' @success="handleRechargeSuccess" @getBalance="handleGetBalance" />
      </li>
    </template>
  </ul>
</template>

<script>
import CustomerRemoteSelector from '../../common/SelectorComps/CustomerRemoteSelector.vue';
import RechargeComp from './RechargeComp.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CustomerRemoteSelector,
    RechargeComp,
  },
  data() {
    return {
      Amount: '',
      BeanNumber: '',
    };
  },
  computed: {
  },
  methods: {
    onCustomerChange(data) {
      this.$emit('setCustomer', data);
    },
    handleRechargeSuccess(allAmount) { // 充值成功
      this.$emit('paid', allAmount);
    },
    handleGetBalance(data) {
      this.$emit('getBalance', data);
    },
  },
  watch: {
    customer: {
      handler(val) {
        if (val && val.FundInfo) {
          const { BeanNumber, Amount } = val.FundInfo;
          this.Amount = Amount;
          this.BeanNumber = BeanNumber;
        } else {
          this.Amount = '';
          this.BeanNumber = '';
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-batch-upload-page-header-comps-customer-select-comp-wrap {
  height: 30px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 22px;
  > li {
    white-space: nowrap;
    &.search {
      width: 300px;
      margin-right: 38px;
    }
    &.empty {
      color: #989898;
    }
    &.name {
      margin-right: 13px;
      display: flex;
      max-width: 325px;
      overflow: hidden;
      > span {
        flex: none;
        &:first-of-type {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    &.level {
      margin-right: 24px;
    }
    &.area {
      margin-right: 35px;
    }
  }
}
</style>
