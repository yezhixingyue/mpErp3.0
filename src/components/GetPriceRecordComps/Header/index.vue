<template>
  <header>
    <div>
      <OrderChannelSelector
        :options='progressList'
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
        label="时间筛选"
        dateType="date" />
      <SearchInputComp
        :typeList="[['KeyWords', '']]"
        :requestFunc='getRecordList'
        :changePropsFunc='setRequestObj'
        :word='condition4RecordList.KeyWords'
        @reset='clearRequestObj'
        :searchWatchKey="RecordDataList" />
    </div>
  </header>
</template>

<script>
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { mapState } from 'vuex';

export default {
  components: {
    SearchInputComp,
    LineDateSelectorComp,
    OrderChannelSelector,
  },
  computed: {
    ...mapState('PriceRecord', ['condition4RecordList', 'RecordDataList']),
    ...mapState('common', ['TerminalTypeList']),
    UserDefinedTimeIsActive() {
      return this.condition4RecordList.DateType === '' && !!this.condition4RecordList.CalculateDate.First && !!this.condition4RecordList.CalculateDate.Second;
    },
    progressList() {
      if (!this.TerminalTypeList || this.TerminalTypeList.length === 0) return [];
      return [{ name: '不限', ID: '' }, ...this.TerminalTypeList];
    },
  },
  data() {
    return {
      dateList: [{ name: '今日报价', ID: 'today' }, { name: '昨日报价', ID: 'yesterday' }, { name: '本周报价', ID: 'curWeek' }, { name: '上周报价', ID: 'lastWeek' }],
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
};
</script>
<style lang='scss'>
</style>
