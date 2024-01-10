<template>
  <header class="mp-erp-get-price-record-page-header-comp-wrap">
    <div style="justify-content: flex-start;">
      <EpCascaderByProduct
      class="mr-12"
      :getList="getRecordList"
      :setCondition="setRequestObj"
      :First="condition4RecordList.ProductClass.First"
      :Second="condition4RecordList.ProductClass.Second"
      :ProductID="condition4RecordList.ProductID"
      :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]"
      />
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
      <MinMaxNum
        class="mr-12"
        :getList="getRecordList"
        :setCondition="setRequestObj"
        :First="condition4RecordList.Amount.First"
        :Second="condition4RecordList.Amount.Second"
        :typeList="[['Amount', 'First'],['Amount', 'Second']]"
       />
    </div>
    <div>
      <p class="left-box">
        <LineDateSelectorComp
          :changePropsFunc='setRequestObj'
          :requestFunc='getRecordList'
          :typeList="[['DateType', ''], ['CalculateDate', 'First'], ['CalculateDate', 'Second']]"
          :dateValue='condition4RecordList.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          :dateList="dateList"
          isFull
          label="时间筛选" />
        <OrderChannelSelector
          :options='PriceRecordStatus'
          :requestFunc='getRecordList'
          :changePropsFunc='setRequestObj'
          :typeList="[['TrackStatus', '']]"
          :value='condition4RecordList.TrackStatus'
          :defaultProps="{label: 'label',value: 'value'}"
          label="状态"
          isRadio
         />
      </p>
      <SearchInputComp
        :typeList="[['KeyWords', '']]"
        :requestFunc='getRecordList'
        :changePropsFunc='setRequestObj'
        :word='condition4RecordList.KeyWords'
        @reset='clearRequestObj'
        title="报价编号"
        placeholder="请输入报价编号"
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
import EpCascaderByProduct from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';
import MinMaxNum from '@/components/common/min-max-Num.vue';
import EpCascaderByArea from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  props: {
    PriceRecordStatus: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SearchInputComp,
    LineDateSelectorComp,
    OrderChannelSelector,
    EpCascaderByArea,
    EpCascaderByProduct,
    MinMaxNum,
    // ElDateRangeSelector,
  },
  computed: {
    ...mapState('PriceRecord', ['condition4RecordList', 'RecordDataList']),
    ...mapState('common', ['selfHelpOrderTypeList', 'userTypeList', 'userRankList']),
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
    this.$store.dispatch('common/getUserClassify');
  },
};
</script>
<style lang='scss'>
.mp-erp-get-price-record-page-header-comp-wrap {
  padding: 20px 0;
  background-color: #fff;
  .left-box{
    display: flex;
    flex-wrap: wrap;
    .mp-line-date-selector-wrap{
      min-width: 630px;
    }
    .mp-common-comps-order-channel-selector-wrap{
      padding-top: 18px;
      main{
        display: flex;
      }
    }
  }
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
