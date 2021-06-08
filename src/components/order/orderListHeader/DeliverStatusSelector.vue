<!--
 * @Author: your name
 * @Date: 2020-03-21 10:46:58
 * @LastEditTime: 2021-03-18 14:54:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/components/order/orderListHeader/DeliverStatusSelector.vue
-->
<template>
  <ul class="order-deliver-selector-wrap">
    <li class="text">物流状态：</li>
    <li>
      <DropDownExpress @select="setDeliverStatus" :title="deliverTitle" :list="deliverStatus" />
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
    ...mapState('orderModule', ['deliverTitle']),
    ...mapState('common', ['deliverStatus']),
  },
  methods: {
    ...mapMutations('orderModule', ['setDeliverStatus']),
  },
};
</script>

<style lang='scss'>
.order-deliver-selector-wrap{
    margin-right: 0px !important;
    > li{
        &.text {
            width: 5em;
            margin-right: 0;
        }
    }
}
</style>
