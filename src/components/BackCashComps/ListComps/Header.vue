<template>
  <header>
    <el-button type="primary" @click="onAddClick" v-if="localPermission.Setup">添加消费返现</el-button>
    <div class="list">
      <AreaSelector
        title="销售区域"
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
  </header>
</template>

<script>
import { mapState } from 'vuex';
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import OrderChannelSelector from '../../common/SelectorComps/OrderChannelSelector.vue';
import { CategoryEnumsList } from '../../../store/printBean/PrintBeanClassType';

export default {
  components: {
    AreaSelector,
    ProductSelector,
    OrderChannelSelector,
  },
  data() {
    return {
      CategoryEnumsList,
    };
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapState('common', ['Permission']),
    ...mapState('cashback', ['conditionForDataList']),
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
  },
};
</script>
<style lang='scss'>
</style>
