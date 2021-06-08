<template>
  <ul class="mp-order-status-select-wrap">
    <li class="text">订单状态：</li>
    <li>
      <DropDownExpress @select="setOrderStatus" :title="orderStatueTitle" :list="OrderStatusList" />
    </li>
  </ul>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DropDownExpress from './DropDownExpress.vue';

export default {
  components: {
    DropDownExpress,
  },
  computed: {
    ...mapState('finance', [
      'orderStatueTitle',
      'OrderStatusList',
    ]),
  },
  methods: {
    ...mapMutations('finance', ['setOrderStatus']),
  },
};
</script>

<style lang='scss'>
</style>
