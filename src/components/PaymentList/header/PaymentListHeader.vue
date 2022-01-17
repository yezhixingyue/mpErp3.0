<template>
  <header class="mp-payment-list-header">
    <div class="first-row">
      <PayStatusSelect />
      <div class="user-selector">
        <order-channel-selector
          :options="userTypeList"
          :requestFunc="getDataList"
          :changePropsFunc="setDataListRequestObj"
          :typeList="[['CustomerType', 'First']]"
          :value="set2PaymentList.CustomerType.First"
          :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
          label="用户"
        />
        <order-channel-selector
          :showLabel="false"
          :options="userRankList"
          :requestFunc="getDataList"
          :changePropsFunc="setDataListRequestObj"
          :typeList="[['CustomerType', 'Second']]"
          :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
          :value="set2PaymentList.CustomerType.Second"
          label=""
        />
      </div>
      <StaffSelector />
      <!-- <PaymentMethod /> -->
      <OrderMethod />
    </div>
    <TimeSearchSelector />
  </header>
</template>

<script>
import TimeSearchSelector from '@/components/PaymentList/header/TimeSearchSelector.vue';
import PayStatusSelect from '@/components/PaymentList/header/PayStatusSelect.vue';
// import PaymentMethod from '@/components/PaymentList/header/PaymentMethod.vue';
import StaffSelector from '@/components/PaymentList/header/StaffSelector.vue';
import OrderMethod from '@/components/PaymentList/header/OrderMethod.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    TimeSearchSelector,
    PayStatusSelect,
    StaffSelector,
    // PaymentMethod,
    OrderMethod,
    OrderChannelSelector,
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('paymentModule', ['set2PaymentList']),
  },
  methods: {
    ...mapMutations('paymentModule', ['setDataListRequestObj']),
    getDataList() {
      this.$store.dispatch('paymentModule/getPaymentListTableData');
    },
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
  },
};
</script>

<style lang='scss'>
.mp-payment-list-header {
  > .first-row {
    > .user-selector {
      display: flex;
      margin-right: 80px !important;
    }
  }
  .mp-time-serach-wrap .text {
    padding-left: 0;
  }
}
</style>
