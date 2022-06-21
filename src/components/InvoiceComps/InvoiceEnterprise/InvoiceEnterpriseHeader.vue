<template>
  <header v-if="conditon">
    <LineDateSelectorComp
      :changePropsFunc='setCondition'
      :requestFunc='getList'
      :typeList="[['DateType', ''], ['AuditTime', 'First'], ['AuditTime', 'Second']]"
      :dateValue='conditon.DateType'
      :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
      :dateList="dateList"
      isFull
      label="审核通过时间" />
    <SearchInputComp
      class="search-section"
      :typeList="[['KeyWords', '']]"
      :requestFunc='getList'
      :changePropsFunc='setCondition'
      :word='conditon.KeyWords'
      :searchWatchKey="list"
      @reset='clearCondition'
      title='关键词'
      placeholder='请输入搜索关键词'
    />
  </header>
</template>

<script>
import LineDateSelectorComp from '../../common/SelectorComps/LineDateSelectorComp.vue';
import SearchInputComp from '../../common/SearchInputComp.vue';

export default {
  props: {
    conditon: {
      type: Object,
      default: null,
    },
    getList: {
      type: Function,
      default: () => {},
    },
    list: {
      type: Array,
      default: null,
    },
    clearCondition: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    LineDateSelectorComp,
    SearchInputComp,
  },
  computed: {
    UserDefinedTimeIsActive() {
      return this.conditon.DateType === ''
       && !!this.conditon.AuditTime.First && !!this.conditon.AuditTime.Second;
    },
  },
  data() {
    return {
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
    setCondition(e) {
      if (!this.conditon) return;
      this.conditon.setCondition(e);
    },
  },
};
</script>
<style lang='scss'>
</style>
