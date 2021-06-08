<!--
 * @Author: your name
 * @Date: 2020-03-17 09:03:45
 * @LastEditTime: 2021-05-05 11:11:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/components/order/orderListHeader/ExpressSelector.vue
-->
<template>
  <ul class="order-express-selector-wrap">
    <li class="text">配送方式：</li>
    <li>
      <DropDownExpress @select="setExpressType" :title="expressTitle" :list="expressList" />
    </li>
  </ul>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import DropDownExpress from '@/components/order/orderListHeader/DropDownExpress.vue';

export default {
  components: {
    DropDownExpress,
  },
  computed: {
    ...mapGetters('common', ['expressList']),
    ...mapState('orderModule', [
      'orderStatueTitle',
      'OrderStatusList',
      'expressTitle',
    ]),
  },
  methods: {
    ...mapMutations('orderModule', ['setOrderStatus', 'setExpressType']),
  },
  mounted() {
    this.$store.dispatch('common/getExpressList');
  },
};
</script>

<style lang='scss'>
</style>
