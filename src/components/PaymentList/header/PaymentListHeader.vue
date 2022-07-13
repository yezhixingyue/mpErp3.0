<template>
  <header class="mp-payment-list-header">
    <div class="first-row">
      <RadioButtonGroupComp
        :radioList="statusEnumList"
        :requestFunc="getDataList"
        v-model="Status"
        :isFull="true"
        title="购买状态"
      />
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
      <OrderMethod />
    </div>
    <div class="s">
      <!-- <ElDateRangeSelector v-model="conditionDate" :condition="set2PaymentList" /> -->
      <LineDateSelectorComp
        :changePropsFunc='setDataListRequestObj'
        :requestFunc='getDataList'
        :isFull="true"
        :typeList="[['DateType', ''], ['CreateDate', 'First'], ['CreateDate', 'Second']]"
        :dateValue='set2PaymentList.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="时间筛选"
        :dateList="dateList"
        />
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
  </header>
</template>

<script>
import StaffSelector from '@/components/PaymentList/header/StaffSelector.vue';
import OrderMethod from '@/components/PaymentList/header/OrderMethod.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    StaffSelector,
    OrderMethod,
    OrderChannelSelector,
    SearchInputComp,
    LineDateSelectorComp,
    RadioButtonGroupComp,
  },
  data() {
    return {
      dateList: [
        { name: '不限', ID: 'all' },
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
      ],
    };
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList', 'PayStatusList']),
    ...mapState('paymentModule', ['set2PaymentList', 'tableData']),
    statusEnumList() {
      const list = this.PayStatusList.map(it => ({ ID: it.ID, name: it.Name }));
      return [{ ID: '', name: '不限' }, ...list];
    },
    UserDefinedTimeIsActive() {
      return this.set2PaymentList.DateType === '' && !!this.set2PaymentList.CreateDate.First && !!this.set2PaymentList.CreateDate.Second;
    },
    Status: {
      get() {
        return this.set2PaymentList.Status;
      },
      set(newVal) {
        this.setDataListRequestObj([['Status', ''], newVal]);
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
    > .mp-common-comps-radio-group-wrap {
      margin-right: 8px;
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
