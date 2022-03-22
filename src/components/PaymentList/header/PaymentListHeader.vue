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
    <div class="s">
      <ElDateRangeSelector v-model="conditionDate" />
      <SearchInputComp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title="关键词"
        placeholder='请输入搜索关键词'
        :requestFunc='getDataList'
        :changePropsFunc='setDataListRequestObj'
        :word='set2PaymentList.KeyWords'
        :searchWatchKey="tableData"
        @reset='() => this.clearCondition()'
      />
    </div>
    <!-- <TimeSearchSelector /> -->
  </header>
</template>

<script>
// import TimeSearchSelector from '@/components/PaymentList/header/TimeSearchSelector.vue';
import PayStatusSelect from '@/components/PaymentList/header/PayStatusSelect.vue';
// import PaymentMethod from '@/components/PaymentList/header/PaymentMethod.vue';
import StaffSelector from '@/components/PaymentList/header/StaffSelector.vue';
import OrderMethod from '@/components/PaymentList/header/OrderMethod.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    // TimeSearchSelector,
    PayStatusSelect,
    StaffSelector,
    // PaymentMethod,
    OrderMethod,
    OrderChannelSelector,
    ElDateRangeSelector,
    SearchInputComp,
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('paymentModule', ['set2PaymentList', 'tableData']),
    conditionDate: {
      get() {
        return [this.set2PaymentList.CreateDate.First, this.set2PaymentList.CreateDate.Second];
      },
      set(newVal) {
        const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
        this.setDataListRequestObj([['CreateDate', 'First'], key]);
        this.setDataListRequestObj([['CreateDate', 'Second'], value]);
        this.getDataList();
      },
    },
  },
  methods: {
    ...mapMutations('paymentModule', ['setDataListRequestObj']),
    getDataList() {
      this.$store.dispatch('paymentModule/getPaymentListTableData');
    },
    clearCondition() {
      this.$store.commit('paymentModule/clearConfigObj');
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
  > .s {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding-right: 60px;
    > div, > section {
      margin-bottom: 18px;
    }
  }
  .mp-time-serach-wrap .text {
    padding-left: 0;
  }
}
</style>
