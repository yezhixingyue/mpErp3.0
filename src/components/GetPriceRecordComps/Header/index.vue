<template>
  <header class="mp-erp-get-price-record-page-header-comp-wrap">
    <div>
      <OrderChannelSelector
        :options='selfHelpOrderTypeList'
        :requestFunc='getRecordList'
        :changePropsFunc='setRequestObj'
        :typeList="[['Terminal', '']]"
        :value='condition4RecordList.Terminal'
        label="报价方式"
        isRadio
       />
    </div>
    <div>
      <LineDateSelectorComp
        :changePropsFunc='setRequestObj'
        :requestFunc='getRecordList'
        :typeList="[['DateType', ''], ['CalculateDate', 'First'], ['CalculateDate', 'Second']]"
        :dateValue='condition4RecordList.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        :dateList="dateList"
        isFull
        label="时间筛选" />
      <!-- <ElDateRangeSelector v-model="conditionDate" :max-span="366" :menus="dateMenus" :condition="condition4RecordList" /> -->
      <SearchInputComp
        :typeList="[['KeyWords', '']]"
        :requestFunc='getRecordList'
        :changePropsFunc='setRequestObj'
        :word='condition4RecordList.KeyWords'
        @reset='clearRequestObj'
        title="关键词"
        placeholder="请输入搜索关键词"
        :searchWatchKey="RecordDataList" />
    </div>
  </header>
</template>

<script>
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState } from 'vuex';

export default {
  components: {
    SearchInputComp,
    LineDateSelectorComp,
    OrderChannelSelector,
    // ElDateRangeSelector,
  },
  computed: {
    ...mapState('PriceRecord', ['condition4RecordList', 'RecordDataList']),
    ...mapState('common', ['selfHelpOrderTypeList']),
    UserDefinedTimeIsActive() {
      return this.condition4RecordList.DateType === ''
       && !!this.condition4RecordList.CalculateDate.First && !!this.condition4RecordList.CalculateDate.Second;
    },
    conditionDate: {
      get() {
        return [this.condition4RecordList.CalculateDate.First, this.condition4RecordList.CalculateDate.Second];
      },
      set(newVal) {
        const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
        this.setRequestObj([['CalculateDate', 'First'], key]);
        this.setRequestObj([['CalculateDate', 'Second'], value]);
        this.getRecordList();
      },
    },
  },
  data() {
    return {
      dateList: [{ name: '今日报价', ID: 'today' }, { name: '昨日报价', ID: 'yesterday' }, { name: '本周报价', ID: 'curWeek' }, { name: '上周报价', ID: 'lastWeek' }],
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
      this.$store.dispatch('PriceRecord/getRecordList');
    },
    setRequestObj(e) {
      this.$store.commit('PriceRecord/setCondition4RecordList', e);
    },
    clearRequestObj() {
      this.$store.commit('PriceRecord/clearCondition4RecordList');
    },
  },
  mounted() {
    this.clearRequestObj();
    this.getRecordList();
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
    &:first-of-type {
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
