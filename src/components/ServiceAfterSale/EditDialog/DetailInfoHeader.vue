<template>
  <div v-if="Funds">
    <div>
      <span class="title">总金额：</span>
      <span class="text-content">￥{{Funds.FinalPrice}}元</span>
    </div>
    <div>
      <span class="title">已付：</span>
      <span class="text-content">￥{{Funds.HavePaid}}元</span>
    </div>
    <div v-if="PayPackageData">
      <span class="title">运费：</span>
      <span class="text-content">￥{{PayPackageData.Freight}}元<i class="is-font-size-12 is-gray">（含{{PayPackageData.OrderList.length}}个订单）</i></span>
    </div>
    <div>
      <span class="title">订单退款：</span>
      <span class="text-content">￥{{Funds.Refund}}元
        <i v-if="Funds.RefundBeanNumber > 0" class="is-font-size-12 is-gray">(含印豆{{Funds.RefundBeanNumber}}个)</i>
      </span>
    </div>
    <div v-if="PayPackageData">
      <span class="title">运费退款：</span>
      <span class="text-content">￥{{PayPackageData.RefundFreight}}元
        <i v-if="PayPackageData.RefundFreightBeanNumber > 0" class="is-font-size-12 is-gray">(含印豆{{PayPackageData.RefundFreightBeanNumber}}个)</i>
      </span>
    </div>
    <div>
      <span class="title">尾款减少：</span>
      <span class="text-content">￥{{Funds.Reduced}}元</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    Funds: {
      type: Object,
      default: null,
    },
    PayPackageData: {
      type: Object,
      default: null,
    },
  },
};
</script>
<style lang='scss'>
</style>
