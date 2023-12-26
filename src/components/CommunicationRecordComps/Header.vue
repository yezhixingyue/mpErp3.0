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
    <staff-selector
      title="沟通人"
      needlimit
      isLineStyle
      showArrow
      :remote="false"
      :changePropsFunc='setRequestObj'
      :requestFunc='getRecordList'
      :typeList="[['OrderTaker', '']]"
      :value="condition4RecordList.CustomerType.First"
      />
    </div>
    <div>
      <LineDateSelectorComp
        :changePropsFunc='setRequestObj'
        :requestFunc='getRecordList'
        :typeList="[['DateType', ''], ['CommunicateTime', 'First'], ['CommunicateTime', 'Second']]"
        :dateValue='condition4RecordList.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        :dateList="dateList"
        isFull
        label="时间筛选" />
      <OrderChannelSelector
        :options='selfHelpOrderTypeList'
        :requestFunc='getRecordList'
        :changePropsFunc='setRequestObj'
        :typeList="[['Terminal', '']]"
        :value='condition4RecordList.Terminal'
        label="沟通方式="
        isRadio
       />
      <SearchInputComp
        :typeList="[['KeyWords', '']]"
        :requestFunc='getRecordList'
        :changePropsFunc='setRequestObj'
        :word='condition4RecordList.KeyWords'
        @reset='clearRequestObj'
        title="报价编号"
        placeholder="请输入报价编号"
        :searchWatchKey="CommunicationRecordList" />
    </div>
  </header>
</template>

<script>
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState } from 'vuex';
import EpCascaderByArea from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  components: {
    SearchInputComp,
    LineDateSelectorComp,
    OrderChannelSelector,
    EpCascaderByArea,
    StaffSelector,
    // ElDateRangeSelector,
  },
  computed: {
    ...mapState('CommunicationRecord', ['condition4RecordList', 'CommunicationRecordList']),
    ...mapState('common', ['selfHelpOrderTypeList', 'userTypeList', 'userRankList']),
    UserDefinedTimeIsActive() {
      return this.condition4RecordList.DateType === ''
       && !!this.condition4RecordList.CommunicateTime.First && !!this.condition4RecordList.CommunicateTime.Second;
    },
    conditionDate: {
      get() {
        return [this.condition4RecordList.CommunicateTime.First, this.condition4RecordList.CommunicateTime.Second];
      },
      set(newVal) {
        const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
        this.setRequestObj([['CommunicateTime', 'First'], key]);
        this.setRequestObj([['CommunicateTime', 'Second'], value]);
        this.getRecordList();
      },
    },
  },
  data() {
    return {
      dateList: [{ name: '今日沟通', ID: 'today' }, { name: '昨日沟通', ID: 'yesterday' }, { name: '本周沟通', ID: 'curWeek' }, { name: '上周沟通', ID: 'lastWeek' }],
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
    getRecordList() {
      this.$store.dispatch('CommunicationRecord/getCommunicationRecordList');
    },
    setRequestObj(e) {
      this.$store.commit('CommunicationRecord/setCondition4RecordList', e);
    },
    clearRequestObj() {
      this.$store.commit('CommunicationRecord/clearCondition4RecordList');
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
