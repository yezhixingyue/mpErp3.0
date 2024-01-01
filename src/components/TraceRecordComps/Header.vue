<template>
  <header class="mp-erp-get-price-record-page-header-comp-wrap">
    <div style="justify-content: flex-start;">
      <EpCascaderByProduct
      class="mr-12"
      :getList="getCustomerTrackLogList"
      :setCondition="setRequestObj"
      :First="condition4TraceRecordList.Product.ClassID"
      :Second="condition4TraceRecordList.Product.TypeID"
      :ProductID="condition4TraceRecordList.ProductID"
      :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
      />
      <EpCascaderByArea
        class="mr-12"
        :getList="getCustomerTrackLogList"
        :setCondition="setRequestObj"
        :RegionalID="condition4TraceRecordList.SellArea.RegionalID"
        :CityID="condition4TraceRecordList.SellArea.CityID"
        :CountyID="condition4TraceRecordList.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
      <order-channel-selector
        :options="userTypeList"
        :requestFunc="getCustomerTrackLogList"
        :changePropsFunc="setRequestObj"
        :typeList="[['CustomerType', 'First']]"
        :value="condition4TraceRecordList.CustomerType.First"
        :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
        label="客户"
      />
      <order-channel-selector
        :showLabel="false"
        :options="userRankList"
        :requestFunc="getCustomerTrackLogList"
        :changePropsFunc="setRequestObj"
        :typeList="[['CustomerType', 'Second']]"
        :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
        :value="condition4TraceRecordList.CustomerType.Second"
        label=""
      />
      <order-channel-selector
        :options="[{label: '不限', value: ''}, ...TrackStatusList]"
        :requestFunc="getCustomerTrackLogList"
        :changePropsFunc="setRequestObj"
        :typeList="[['TrackStatus', '']]"
        :value="condition4TraceRecordList.TrackStatus"
        :defaultProps="{ label: 'label', value: 'value' }"
        label="状态"
      />
    </div>
    <div>
      <LineDateSelectorComp
        :changePropsFunc='setRequestObj'
        :requestFunc='getCustomerTrackLogList'
        :typeList="[['DateType', ''], ['AddTime', 'First'], ['AddTime', 'Second']]"
        :dateValue='condition4TraceRecordList.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        :dateList="dateList"
        isFull
        label="时间筛选" />
      <SearchInputComp
        :typeList="[['KeyWords', '']]"
        :requestFunc='getCustomerTrackLogList'
        :changePropsFunc='setRequestObj'
        :word='condition4TraceRecordList.KeyWords'
        @reset='clearRequestObj'
        title="报价编号"
        placeholder="请输入报价编号"
        :searchWatchKey="TraceRecordList" />
    </div>
  </header>
</template>

<script>
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState } from 'vuex';
import EpCascaderByProduct from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';
import EpCascaderByArea from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  components: {
    SearchInputComp,
    LineDateSelectorComp,
    OrderChannelSelector,
    EpCascaderByArea,
    EpCascaderByProduct,
    // ElDateRangeSelector,
  },
  computed: {
    ...mapState('TraceRecord', ['condition4TraceRecordList', 'TraceRecordList', 'TrackStatusList']),
    ...mapState('common', ['selfHelpOrderTypeList', 'userTypeList', 'userRankList']),
    UserDefinedTimeIsActive() {
      return this.condition4TraceRecordList.DateType === ''
       && !!this.condition4TraceRecordList.AddTime.First && !!this.condition4TraceRecordList.AddTime.Second;
    },
    conditionDate: {
      get() {
        return [this.condition4TraceRecordList.AddTime.First, this.condition4TraceRecordList.AddTime.Second];
      },
      set(newVal) {
        const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
        this.setRequestObj([['AddTime', 'First'], key]);
        this.setRequestObj([['AddTime', 'Second'], value]);
        this.getCustomerTrackLogList();
      },
    },
  },
  data() {
    return {
      dateList: [{ name: '今日添加', ID: 'today' }, { name: '昨日添加', ID: 'yesterday' }, { name: '本周添加', ID: 'curWeek' }, { name: '上周添加', ID: 'lastWeek' }],
      dateMenus: [
        { text: '今天', key: 'TodayDate' },
        { text: '昨天', key: 'YesterdayDate' },
        { text: '前天', key: 'BeforeYesterdayTimeDate' },
        { text: '本周', key: 'curWeekDate' },
        { text: '上周', key: 'lastWeekDate' },
      ],
    };
  },
  methods: {
    getCustomerTrackLogList() {
      this.$store.dispatch('TraceRecord/getCustomerTrackLogList');
    },
    setRequestObj(e) {
      this.$store.commit('TraceRecord/setCondition4List', e);
    },
    clearRequestObj() {
      this.$store.commit('TraceRecord/clearCondition4List');
    },
  },
  mounted() {
    this.clearRequestObj();
    this.getCustomerTrackLogList();
    this.$store.dispatch('common/getUserClassify');
  },
};
</script>
<style lang='scss'>
.mp-erp-get-price-record-page-header-comp-wrap {
  padding: 20px 0;
  background-color: #fff;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-left: 20px;
    padding-right: 65px;
    // height: 30px;
    >div{
      height: 30px;
    }
    .mp-line-date-selector-wrap {
      margin-top: 18px;
    }
    .mp-common-comps-el-date-range-selector-comp-wrap, .mp-common-comps-search-box {
      margin-top: 0px;
      padding-top: 18px;
      height: 30px;
    }
  }
}
</style>
