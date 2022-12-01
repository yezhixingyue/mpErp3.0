<template>
  <header>
    <div>
      <OrderChannelSelector
        label='发票类型'
        withEmpty
        :options='InvoiceTypeEnumList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['InvoiceType', '']]"
        :value='condition4InvoiceMakeUpList.InvoiceType'
        :defaultProps="{label: 'Name',value: 'ID'}"
        class="invoice-type-filter-wrap"
      />
      <OrderChannelSelector
        label='发票状态'
        withEmpty
        :options='localInvoiceStatusEnumList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['InvoiceStatus', '']]"
        :value='condition4InvoiceMakeUpList.InvoiceStatus'
        :defaultProps="{label: 'Name',value: 'ID'}"
      />
    </div>
    <div>
      <LineDateSelectorComp
        :changePropsFunc='setCondition'
        :requestFunc='getList'
        :typeList="[['DateType', ''], ['InvoiceApplyTime', 'First'], ['InvoiceApplyTime', 'Second']]"
        :dateValue='condition4InvoiceMakeUpList.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        :dateList="dateList"
        isFull
        label="申请时间" />
      <SearchInputComp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :word='condition4InvoiceMakeUpList.KeyWords'
        @reset='clearCondition'
        :searchWatchKey="InvoiceMakeUpList"
        title='关键词'
        placeholder='请输入搜索关键词'
      />
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import OrderChannelSelector from '../../common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '../../common/SelectorComps/LineDateSelectorComp.vue';
import { InvoiceStatusEnumList, InvoiceStatusEnums, InvoiceTypeEnumList } from '../../../packages/InvoiceComps/enums';

export default {
  components: {
    OrderChannelSelector,
    LineDateSelectorComp,
    SearchInputComp,
  },
  computed: {
    ...mapState('invoice', ['condition4InvoiceMakeUpList', 'InvoiceMakeUpList']),
    UserDefinedTimeIsActive() {
      return this.condition4InvoiceMakeUpList.DateType === ''
       && !!this.condition4InvoiceMakeUpList.InvoiceApplyTime.First && !!this.condition4InvoiceMakeUpList.InvoiceApplyTime.Second;
    },
  },
  data() {
    return {
      InvoiceTypeEnumList,
      localInvoiceStatusEnumList: InvoiceStatusEnumList.filter(it => it.ID !== InvoiceStatusEnums.canceled.ID),
      dateList: [
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '前天', ID: 'beforeyesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
      ],
    };
  },
  methods: {
    getList() {
      this.$store.dispatch('invoice/getInvoiceMakeUpList');
    },
    setCondition(e) {
      this.$store.commit('invoice/setCondition4InvoiceMakeUpList', e);
    },
    clearCondition() {
      this.$store.commit('invoice/clearCondition4InvoiceMakeUpList');
    },
  },
};
</script>
<style lang='scss'>
.invoice-type-filter-wrap .mp-common-select-comp-wrap {
  input {
    width: 150px;
  }
}
</style>
