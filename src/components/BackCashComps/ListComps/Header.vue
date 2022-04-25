<template>
  <header>
    <div class="f">
      <el-button type="primary" @click="onAddClick" v-if="localPermission.Setup">添加消费返现</el-button>
    </div>
    <div class="list">
      <AreaSelector
        title="区域"
        :changePropsFunc="setCondition"
        :requestFunc="getList"
        :RegionalID="conditionForDataList.SellArea.RegionalID"
        :CityID="conditionForDataList.SellArea.CityID"
        :CountyID="conditionForDataList.SellArea.CountyID"
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
      />
      <ProductSelector
        :changePropsFunc='setCondition'
        :requestFunc='getList'
        :ClassID='conditionForDataList.Product.ClassID'
        :TypeID='conditionForDataList.Product.TypeID'
        :ProductID='conditionForDataList.Product.ProductID'
        :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
      />
      <OrderChannelSelector
        label='客户种类'
        withEmpty
        :options='CategoryEnumsList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['Category', '']]"
        :value='conditionForDataList.Category'
        :defaultProps="{label: 'Name',value: 'ID'}"
      />
      <OrderChannelSelector
        label='客户类型'
        :options='userTypeList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['CustomerType', '']]"
        :value='conditionForDataList.CustomerType'
        :defaultProps="{label: 'CategoryName',value: 'CategoryID'}"
      />
      <OrderChannelSelector
        label='客户等级'
        :options='userRankList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['CustomerGrade', '']]"
        :value='conditionForDataList.CustomerGrade'
        :defaultProps="{label: 'CategoryName',value: 'CategoryID'}"
      />
    </div>
    <div class="s">
      <SearchInputComp
        spaceBetween
        class="search-section"
        :typeList="[['KeyWords', '']]"
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :word='conditionForDataList.KeyWords'
        @reset='clearCondition'
        :searchWatchKey="DataList"
        title='关键词'
        placeholder='请输入搜索关键词'
      />
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import OrderChannelSelector from '../../common/SelectorComps/OrderChannelSelector.vue';
import SearchInputComp from '../../common/SearchInputComp.vue';
import { CategoryEnumsList } from '../../../store/printBean/PrintBeanClassType';

export default {
  components: {
    AreaSelector,
    ProductSelector,
    OrderChannelSelector,
    SearchInputComp,
  },
  data() {
    return {
      CategoryEnumsList,
    };
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('common', ['Permission']),
    ...mapState('cashback', ['conditionForDataList', 'DataList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionConsumeReturnCash?.Obj) {
        return this.Permission.PermissionList.PermissionConsumeReturnCash.Obj;
      }
      return {};
    },
  },
  methods: {
    onAddClick() {
      this.$emit('setup', null);
    },
    getList() {
      this.$store.dispatch('cashback/getConsumeReturnCashList');
    },
    setCondition(data) {
      this.$store.commit('cashback/setConditonForDataList', data);
    },
    clearCondition() {
      this.$store.commit('cashback/clearConditonForDataList');
    },
  },
};
</script>
<style lang='scss'>
</style>
