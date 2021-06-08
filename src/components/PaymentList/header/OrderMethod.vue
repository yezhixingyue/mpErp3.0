<template>
  <div>
    <span class="text">下单方式：</span>
    <DropDownOrderMethod :watchTarget='set2PaymentList.OrderType'
     @select="setPaymentMethod" :title="title" :list='orderCreateTypeList' />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import DropDownOrderMethod from './DropDownOrderMethod.vue';

export default {
  components: {
    DropDownOrderMethod,
  },
  data() {
    return {
      title: '不限',
    };
  },
  computed: {
    ...mapState('paymentModule', ['orderCreateTypeList', 'set2PaymentList']),
    orderCreateTypeValue() {
      return this.set2PaymentList.OrderType;
    },
  },
  watch: {
    orderCreateTypeValue(newVal) {
      if (newVal === '') this.title = '不限';
    },
  },
  methods: {
    ...mapMutations('paymentModule', ['setOrderCreateType']),
    ...mapActions('paymentModule', ['getPaymentListTableData']),
    setPaymentMethod([ID, name]) {
      this.title = name;
      this.setOrderCreateType(ID);
      this.getPaymentListTableData();
    },
  },
};
</script>

<style>

</style>
