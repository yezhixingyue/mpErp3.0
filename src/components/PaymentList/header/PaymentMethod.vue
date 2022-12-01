<template>
  <div>
    <span class="text">支付方式：</span>
    <DropDown :watchTarget='set2PaymentList.payment'
     @select="setPaymentMethod" :title='title' :list='PayTypeList' />
  </div>
</template>

<script>
import DropDown from '@/components/common/DropDown.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    DropDown,
  },
  data() {
    return {
      title: '不限',
    };
  },
  computed: {
    ...mapState('paymentModule', ['set2PaymentList']),
    ...mapState('common', ['PayTypeList']),
    paymentTypeValue() {
      return this.set2PaymentList.payment;
    },
  },
  watch: {
    paymentTypeValue(newVal) {
      if (newVal === '') this.title = '不限';
    },
  },
  methods: {
    ...mapMutations('paymentModule', ['setPaymentType']),
    ...mapActions('paymentModule', ['getPaymentListTableData']),
    setPaymentMethod([ID]) {
      // this.title = name;
      this.setPaymentType(ID);
      this.getPaymentListTableData();
    },
  },
};
</script>

<style>

</style>
