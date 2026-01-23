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
        class="mr-20 sellarea"
        :getList="getCustomerBill"
        :setCondition="setCondition4BalanceType"
        :RegionalID="condition4BalanceType.SellArea.RegionalID"
        :CityID="condition4BalanceType.SellArea.CityID"
        :CountyID="condition4BalanceType.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
      <!-- <OrderChannelSelector
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
      /> -->

      <OrderChannelSelector
      :options='BillTypeEnumList'
      :requestFunc='getCustomerBill'
      :changePropsFunc='setCustomerBillType'
      :typeList="[['CustomerBillType', '']]"
      :value='condition4BalanceType.CustomerBillType'
      :defaultProps="{ label: 'Name', value: 'ID' }"
      label="类型"
      withEmpty
      />
      <OrderChannelSelector
      :options='localBillModeEnumList'
      :requestFunc='getCustomerBill'
      :changePropsFunc='setCustomerBillMode'
      :typeList="[['CustomerBillMode', '']]"
      :value='condition4BalanceType.CustomerBillMode'
      :defaultProps="{ label: 'Name', value: 'ID' }"
      label="方式"
      withEmpty
      style="margin-right:18px;margin-left: -10px;"
      />
      <OrderChannelSelector
      :options='localBillAccountEnumList'
      :requestFunc='getCustomerBill'
      :changePropsFunc='setCondition4BalanceType'
      :typeList="[['CustomerBillAccount', '']]"
      :value='condition4BalanceType.CustomerBillAccount'
      :defaultProps="{ label: 'Name', value: 'ID' }"
      label="客户账号"
      withEmpty
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
import {
  BillTypeEnumList, BillModeEnumList, BillAccountEnumList, BillTypeEnumObj, BillModeEnumObj, BillAccountEnumObj } from '@/packages/enums/billEnumList.js';
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
    localBillAccountEnumList() {
      const bool = this.condition4BalanceType.CustomerBillType === BillTypeEnumObj.Recharge
        || this.condition4BalanceType.CustomerBillMode === BillModeEnumObj.Recharge;

      return this.BillAccountEnumList.map(it => ({
        ...it,
        disabled: bool && [BillAccountEnumObj.FundCash, BillAccountEnumObj.PrintBean].includes(it.ID),
      }));
    },
    localBillModeEnumList() {
      return this.BillModeEnumList.filter(it => {
        if (this.condition4BalanceType.CustomerBillType === '') {
          return true;
        }
        return it.ParentID === this.condition4BalanceType.CustomerBillType;
      });
    },
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
      BillTypeEnumList,
      BillModeEnumList,
      BillAccountEnumList,
    };
  },
  methods: {
    ...mapMutations('fundBill', ['setCondition4BalanceType', 'clearConditionDate4Balance']),
    ...mapActions('fundBill', ['getCustomerBill']),
    setCustomerBillType(e) {
      this.setCondition4BalanceType(e);
      // 清空方式和客户账号
      this.setCondition4BalanceType([['CustomerBillMode', ''], '']);
      this.setCondition4BalanceType([['CustomerBillAccount', ''], '']);
    },
    setCustomerBillMode(e) {
      this.setCondition4BalanceType(e);
      // 清空客户账号
      this.setCondition4BalanceType([['CustomerBillAccount', ''], '']);
    },
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
  },
};
</script>

<style>
.sellarea.mpzj-sell-lib-comps-ep-cascader-comp-wrap {
  > .title {
    margin-right: 15px;
  }
}
</style>
