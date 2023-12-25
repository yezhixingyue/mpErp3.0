<template>
  <header class="mp-erp-get-price-record-page-header-comp-wrap">
    <div style="justify-content: flex-start;">
      <EpCascaderByArea
        class="mr-12"
        :getList="getRecordList"
        :setCondition="setRequestObj"
        :RegionalID="condition4RecordList.SellArea.RegionalID"
        :CityID="condition4RecordList.SellArea.CityID"
        :CountyID="condition4RecordList.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
      <order-channel-selector
        :options="userTypeList"
        :requestFunc="getRecordList"
        :changePropsFunc="setRequestObj"
        :typeList="[['CustomerType', 'First']]"
        :value="condition4RecordList.CustomerType.First"
        :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
        label="客户"
      />
      <order-channel-selector
        :showLabel="false"
        :options="userRankList"
        :requestFunc="getRecordList"
        :changePropsFunc="setRequestObj"
        :typeList="[['CustomerType', 'Second']]"
        :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
        :value="condition4RecordList.CustomerType.Second"
        label=""
      />
    </div>
    <div>
      <SearchInputComp
        :typeList="[['KeyWords', '']]"
        :requestFunc='getRecordList'
        :changePropsFunc='setRequestObj'
        :word='condition4RecordList.KeyWords'
        @reset='clearRequestObj'
        title="关键词"
        placeholder="请输入客户名称/编号"
        :searchWatchKey="TraceClientList" />
    </div>
  </header>
</template>

<script>
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState } from 'vuex';
import EpCascaderByArea from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  components: {
    SearchInputComp,
    OrderChannelSelector,
    EpCascaderByArea,
    // ElDateRangeSelector,
  },
  computed: {
    ...mapState('TraceClientList', ['condition4RecordList', 'TraceClientList']),
    ...mapState('common', ['selfHelpOrderTypeList', 'userTypeList', 'userRankList']),
    UserDefinedTimeIsActive() {
      return this.condition4RecordList.DateType === ''
       && !!this.condition4RecordList.CalculateDate.First && !!this.condition4RecordList.CalculateDate.Second;
    },
  },
  data() {
    return {};
  },
  methods: {
    getRecordList() {
      this.$store.dispatch('TraceClientList/getTraceClientList');
    },
    setRequestObj(e) {
      this.$store.commit('TraceClientList/setCondition4RecordList', e);
    },
    clearRequestObj() {
      this.$store.commit('TraceClientList/clearCondition4RecordList');
    },
  },
  mounted() {
    this.clearRequestObj();
    this.getRecordList();
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
