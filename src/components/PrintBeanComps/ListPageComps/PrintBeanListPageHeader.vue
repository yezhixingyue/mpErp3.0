<template>
  <header>
    <div>
      <el-button type="primary" @click="onAddClick">添加印豆设置</el-button>
      <AreaSelector
        :changePropsFunc='setCondtiion'
        :requestFunc='getList'
        :RegionalID='condition.SellArea.RegionalID'
        :CityID='condition.SellArea.CityID'
        :CountyID='condition.SellArea.CountyID'
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
      <OrderChannelSelector
        label='客户种类'
        withEmpty
        :options='CategoryEnumsList'
        :requestFunc='getList'
        :changePropsFunc='setCondtiion'
        :typeList="[['Category', '']]"
        :value='condition.Category'
        :defaultProps="{label: 'Name',value: 'ID'}"
      />
      <OrderChannelSelector
        label='客户类型'
        :options='userTypeList'
        :requestFunc='getList'
        :changePropsFunc='setCondtiion'
        :typeList="[['CustomerType', '']]"
        :value='condition.CustomerType'
        :defaultProps="{label: 'CategoryName',value: 'CategoryID'}"
      />
      <OrderChannelSelector
        label='客户等级'
        :options='userRankList'
        :requestFunc='getList'
        :changePropsFunc='setCondtiion'
        :typeList="[['CustomerGrade', '']]"
        :value='condition.CustomerGrade'
        :defaultProps="{label: 'CategoryName',value: 'CategoryID'}"
      />
    </div>
    <div>
      <RadioButtonGroupComp
        :radioList="statusEnumList"
        :requestFunc="getList"
        v-model="Status"
        :isFull="true"
        title="购买状态"
      />
      <SearchInputComp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        :requestFunc='getList'
        :changePropsFunc='setCondtiion'
        :word='condition.KeyWords'
        @reset='clearCondition'
        :searchWatchKey="searchWatchKey"
        title='关键词'
        placeholder='请输入搜索关键词'
      />
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import AreaSelector from '../../common/SelectorComps/AreaSelectorIndex.vue';
import OrderChannelSelector from '../../common/SelectorComps/OrderChannelSelector.vue';
import { CategoryEnumsList } from '../../../store/printBean/PrintBeanClassType';
import SearchInputComp from '../../common/SearchInputComp.vue';
import RadioButtonGroupComp from '../../common/RadioButtonGroupComp.vue';
import { PrintBeanBuyStatusEnumsList } from '../../../store/printBean/ConditonClass4ListData';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    searchWatchKey: {},
  },
  components: {
    AreaSelector,
    OrderChannelSelector,
    SearchInputComp,
    RadioButtonGroupComp,
  },
  data() {
    return {
      CategoryEnumsList,
    };
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    Status: {
      get() {
        return this.condition.Status;
      },
      set(newVal) {
        this.setCondtiion([['Status', ''], newVal]);
      },
    },
    statusEnumList() {
      const list = PrintBeanBuyStatusEnumsList.map(it => ({ ID: it.ID, name: it.Name }));
      return [{ ID: '', name: '不限' }, ...list];
    },
  },
  methods: {
    onAddClick() {
      this.$emit('add');
    },
    getList() {
      this.$store.dispatch('printBean/getPrintBeanList');
    },
    setCondtiion(data) {
      this.$store.commit('printBean/setCondition', data);
    },
    clearCondition(data) {
      this.$store.commit('printBean/clearCondition', data);
    },
  },
};
</script>
<style lang='scss'>
</style>
