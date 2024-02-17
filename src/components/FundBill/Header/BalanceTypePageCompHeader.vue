<template>
  <ul>
    <li>
      <!-- <area-selector
        :changePropsFunc="setCondition4BalanceType"
        :requestFunc="getCustomerBill"
        :RegionalID="condition4BalanceType.SellArea.RegionalID"
        :CityID="condition4BalanceType.SellArea.CityID"
        :CountyID="condition4BalanceType.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
       /> -->
      <EpCascaderByArea
        class="mr-20"
        :getList="getCustomerBill"
        :setCondition="setCondition4BalanceType"
        :RegionalID="condition4BalanceType.SellArea.RegionalID"
        :CityID="condition4BalanceType.SellArea.CityID"
        :CountyID="condition4BalanceType.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
      <OrderChannelSelector
      :options='FundBillMonetyTypeList'
      :requestFunc='getCustomerBill'
      :changePropsFunc='setCondition4BalanceType'
      :typeList="[['BillType', '']]"
      :value='condition4BalanceType.BillType'
      label="账单类型"
      style="margin-right:12px"
      />
      <OrderChannelSelector
      :options='FundBillBalanceTypeList'
      :requestFunc='getCustomerBill'
      :changePropsFunc='setCondition4BalanceType'
      :typeList="[['Type', '']]"
      :value='condition4BalanceType.Type'
      label="交易类型"
      />
      <OrderChannelSelector
      :options='FundBillBalanceCurrencyList'
      :requestFunc='getCustomerBill'
      :changePropsFunc='setCondition4BalanceType'
      :typeList="[['Currency', '']]"
      :value='condition4BalanceType.Currency'
      label="方式"
      />
      <div class="user-selector">
        <OrderChannelSelector
          :options="userTypeList"
          :requestFunc="getCustomerBill"
          :changePropsFunc="setCondition4BalanceType"
          :typeList="[['CustomerType', 'First']]"
          :value="condition4BalanceType.CustomerType.First"
          :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
          label="用户"
        />
        <OrderChannelSelector
          :showLabel="false"
          :options="userRankList"
          :requestFunc="getCustomerBill"
          :changePropsFunc="setCondition4BalanceType"
          :typeList="[['CustomerType', 'Second']]"
          :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
          :value="condition4BalanceType.CustomerType.Second"
          label=""
        />
      </div>
    </li>
    <li>
      <LineDateSelectorComp
        :changePropsFunc='setCondition4BalanceType'
        :requestFunc='getCustomerBill'
        :isFull="true"
        :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
        :dateValue='condition4BalanceType.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="时间"
        :dateList="dateList"
        />
      <!-- <ElDateRangeSelector v-model="conditionDate"  :menus='dateMenus' title="时间" :condition="condition4BalanceType" /> -->
      <search-input-comp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title="关键词"
        placeholder='请输入搜索关键词'
        :requestFunc='getCustomerBill'
        :changePropsFunc='setCondition4BalanceType'
        :word='condition4BalanceType.KeyWords'
        :searchWatchKey="balanceTypeDataList"
        @reset='() => this.clearConditionDate4Balance()'
        />
    </li>
  </ul>
</template>

<script>
// import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState, mapMutations, mapActions } from 'vuex';
import EpCascaderByArea from '../../common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  components: {
    // AreaSelector,
    OrderChannelSelector,
    LineDateSelectorComp,
    SearchInputComp,
    EpCascaderByArea,
    // ElDateRangeSelector,
  },
  computed: {
    ...mapState('fundBill', ['condition4BalanceType', 'balanceTypeDataList']),
    ...mapState('common', ['FundBillBalanceTypeList', 'FundBillBalanceCurrencyList', 'userTypeList', 'userRankList', 'FundBillMonetyTypeList']),
    UserDefinedTimeIsActive() {
      return this.condition4BalanceType.DateType === '' && !!this.condition4BalanceType.Date.First && !!this.condition4BalanceType.Date.Second;
    },
    // conditionDate: {
    //   get() {
    //     return [this.condition4BalanceType.Date.First, this.condition4BalanceType.Date.Second];
    //   },
    //   set(newVal) {
    //     const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
    //     this.setCondition4BalanceType([['Date', 'First'], key]);
    //     this.setCondition4BalanceType([['Date', 'Second'], value]);
    //     this.getCustomerBill();
    //   },
    // },
  },
  data() {
    return {
      // eslint-disable-next-line max-len
      dateList: [{ name: '近30天', ID: 'last30Date' }, { name: '今天', ID: 'today' }, { name: '昨天', ID: 'yesterday' }, { name: '前天', ID: 'beforeyesterday' }, { name: '本月', ID: 'curMonth' }, { name: '上月', ID: 'lastMonth' }],
      dateMenus: [
        { text: '不限', key: 'all' },
        { text: '今天', key: 'TodayDate' },
        { text: '昨天', key: 'YesterdayDate' },
        { text: '前天', key: 'BeforeYesterdayTimeDate' },
        { text: '本月', key: 'curMonthDate' },
        { text: '上月', key: 'lastMonthDate' },
      ],
    };
  },
  methods: {
    ...mapMutations('fundBill', ['setCondition4BalanceType', 'clearConditionDate4Balance']),
    ...mapActions('fundBill', ['getCustomerBill']),
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
  },
};
</script>

<style>

</style>
