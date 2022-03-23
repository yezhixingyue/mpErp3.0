<template>
  <ul>
    <li>
      <area-selector
        :changePropsFunc="setCondition4OrderType"
        :requestFunc="getCustomerOrderBill"
        :RegionalID="condition4OrderType.SellArea.RegionalID"
        :CityID="condition4OrderType.SellArea.CityID"
        :CountyID="condition4OrderType.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
       />
        <order-channel-selector
        :options='FundBillOrderTypeList'
        :requestFunc='getCustomerOrderBill'
        :changePropsFunc='setCondition4OrderType'
        :typeList="[['Type', '']]"
        :value='condition4OrderType.Type'
        label="类型"
       />
        <order-channel-selector
        :options='FundBillOrderCurrencyList'
        :requestFunc='getCustomerOrderBill'
        :changePropsFunc='setCondition4OrderType'
        :typeList="[['Currency', '']]"
        :value='condition4OrderType.Currency'
        label="渠道"
       />
       <div class="user-selector">
        <order-channel-selector
          :options="userTypeList"
          :requestFunc="getCustomerOrderBill"
          :changePropsFunc="setCondition4OrderType"
          :typeList="[['CustomerType', 'First']]"
          :value="condition4OrderType.CustomerType.First"
          :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
          label="用户"
        />
        <order-channel-selector
          :showLabel="false"
          :options="userRankList"
          :requestFunc="getCustomerOrderBill"
          :changePropsFunc="setCondition4OrderType"
          :typeList="[['CustomerType', 'Second']]"
          :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
          :value="condition4OrderType.CustomerType.Second"
          label=""
        />
      </div>
    </li>
    <li>
      <!-- <LineDateSelectorComp
        :changePropsFunc='setCondition4OrderType'
        :requestFunc='getCustomerOrderBill'
        :isFull="true"
        :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
        :dateValue='condition4OrderType.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="时间"
        :dateList="dateList"
        dateType="date"
        /> -->
      <ElDateRangeSelector v-model="conditionDate"  :menus='dateMenus' title="时间" :condition="condition4OrderType" />
      <search-input-comp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title="关键词"
        placeholder='请输入搜索关键词'
        :requestFunc='getCustomerOrderBill'
        :changePropsFunc='setCondition4OrderType'
        :word='condition4OrderType.KeyWords'
        :searchWatchKey="orderTypeDataList"
        @reset='() => this.clearConditionDate4Order()'
        />
    </li>
  </ul>
</template>

<script>
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
// import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    AreaSelector,
    OrderChannelSelector,
    // LineDateSelectorComp,
    SearchInputComp,
    ElDateRangeSelector,
  },
  computed: {
    ...mapState('fundBill', ['condition4OrderType', 'orderTypeDataList']),
    ...mapState('common', ['FundBillOrderTypeList', 'FundBillOrderCurrencyList', 'userTypeList', 'userRankList']),
    // UserDefinedTimeIsActive() {
    //   // eslint-disable-next-line max-len
    //   return this.condition4OrderType.DateType === '' && !!this.condition4OrderType.Date.First && !!this.condition4OrderType.Date.Second;
    // },
    conditionDate: {
      get() {
        return [this.condition4OrderType.Date.First, this.condition4OrderType.Date.Second];
      },
      set(newVal) {
        const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
        this.setCondition4OrderType([['Date', 'First'], key]);
        this.setCondition4OrderType([['Date', 'Second'], value]);
        this.getCustomerOrderBill();
      },
    },
  },
  data() {
    return {
      // eslint-disable-next-line max-len
      // dateList: [{ name: '不限', ID: 'all' }, { name: '今天', ID: 'today' }, { name: '昨天', ID: 'yesterday' }, { name: '前天', ID: 'beforeyesterday' }, { name: '本月', ID: 'curMonth' }, { name: '上月', ID: 'lastMonth' }],
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
    ...mapMutations('fundBill', ['setCondition4OrderType', 'clearConditionDate4Order']),
    ...mapActions('fundBill', ['getCustomerOrderBill']),
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
  },
};
</script>

<style>

</style>
