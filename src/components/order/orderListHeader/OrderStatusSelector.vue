<template>
  <ul class="mp-order-status-select-wrap">
    <li class="text order-statu-text">订单状态：</li>
    <li>
      <DropDownExpress @select="setOrderStatus" :title="orderStatueTitle" :list="OrderStatusList" />
    </li>
  </ul>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DropDownExpress from '@/components/order/orderListHeader/DropDownExpress.vue';

export default {
  components: {
    DropDownExpress,
  },
  computed: {
    ...mapState('orderModule', [
      'orderStatueTitle',
      'OrderStatusList',
    ]),
  },
  methods: {
    ...mapMutations('orderModule', ['setOrderStatus']),
  },
};
</script>

<style lang='scss'>
// .mp-order-status-select-wrap {
  // > .order-statu-text {
  //   margin-left: 15px;
  // }
// }
</style>
