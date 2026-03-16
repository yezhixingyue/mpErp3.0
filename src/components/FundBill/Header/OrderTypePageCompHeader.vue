<template>
  <ul>
    <li>
      <EpCascaderByArea
        class="mr-20 sellarea"
        :getList="getCustomerOrderBill"
        :setCondition="setCondition4OrderType"
        :RegionalID="condition4OrderType.SellArea.RegionalID"
        :CityID="condition4OrderType.SellArea.CityID"
        :CountyID="condition4OrderType.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
        <order-channel-selector
        class="mr-25"
        :options='OrderBillTypeEnumList'
        :requestFunc='getCustomerOrderBill'
        :changePropsFunc='setCondition4OrderType'
        :typeList="[['Type', '']]"
        :defaultProps="{ label: 'Name', value: 'ID' }"
        :value='condition4OrderType.Type'
        label="方式"
        withEmpty
       />
        <order-channel-selector
        :options='BillAccountEnumList'
        :requestFunc='getCustomerOrderBill'
        :changePropsFunc='setCondition4OrderType'
        :typeList="[['Account', '']]"
        :value='condition4OrderType.Account'
        :defaultProps="{ label: 'Name', value: 'ID' }"
        label="客户账户"
        withEmpty
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
      <LineDateSelectorComp
        :changePropsFunc='setCondition4OrderType'
        :requestFunc='getCustomerOrderBill'
        :isFull="true"
        :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
        :dateValue='condition4OrderType.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="时间"
        :dateList="dateList"
        />
      <!-- <ElDateRangeSelector v-model="conditionDate"  :menus='dateMenus' title="时间" :condition="condition4OrderType" /> -->
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
// import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState, mapMutations, mapActions } from 'vuex';
import EpCascaderByArea from '../../common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';
import { OrderBillTypeEnumList, BillAccountEnumList } from '@/packages/enums/billEnumList.js';

export default {
  components: {
    // AreaSelector,
    OrderChannelSelector,
    LineDateSelectorComp,
    SearchInputComp,
    // ElDateRangeSelector,
    EpCascaderByArea,
  },
  computed: {
    ...mapState('fundBill', ['condition4OrderType', 'orderTypeDataList']),
    ...mapState('common', ['userTypeList', 'userRankList']),
    UserDefinedTimeIsActive() {
      // eslint-disable-next-line max-len
      return this.condition4OrderType.DateType === '' && !!this.condition4OrderType.Date.First && !!this.condition4OrderType.Date.Second;
    },
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
      dateList: [{ name: '近30天', ID: 'last30Date' }, { name: '今天', ID: 'today' }, { name: '昨天', ID: 'yesterday' }, { name: '前天', ID: 'beforeyesterday' }, { name: '本月', ID: 'curMonth' }, { name: '上月', ID: 'lastMonth' }],
      dateMenus: [
        { text: '不限', key: 'all' },
        { text: '今天', key: 'TodayDate' },
        { text: '昨天', key: 'YesterdayDate' },
        { text: '前天', key: 'BeforeYesterdayTimeDate' },
        { text: '本月', key: 'curMonthDate' },
        { text: '上月', key: 'lastMonthDate' },
      ],
      OrderBillTypeEnumList,
      BillAccountEnumList,
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
.sellarea.mpzj-sell-lib-comps-ep-cascader-comp-wrap {
  > .title {
    margin-right: 15px;
  }
}
</style>
