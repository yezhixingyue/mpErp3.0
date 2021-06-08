<template>
  <section class="mp-statistic-analyse-add-edit-page-form-wrap widen">
    <header>
      <span>数据：</span>
      <SingleRadioGroupComp  v-model="DataType" :list='StatisticalCustomerTypeList' />
    </header>
    <div>
      <checkbox-group-comp
         title="订单状态"
        :itemList='StatisticalCustomerOrderStatusList'
         v-model='orderStatusList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
      <checkbox-group-comp
         title="下单方式"
        :itemList='StatisticalOrderCreateTypeList'
         v-model='orderCreateTypeList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
      <MinMaxValueInputComp title='客户订单总金额' v-model="orderMinMaxValList" /> <!-- 客户订单总金额 -->
      <MinMaxValueInputComp title="客户订单损失总金额" v-model="orderLossMinMaxValList" /> <!-- 客户订单损失总金额 -->
      <div class="area-product-select-box">
        <span>产品筛选：</span>
        <div>
          <ProductDialogTreeSelectComp v-model="ProductList" />
        </div>
      </div>
      <div class="area-product-select-box">
        <span>区域筛选：</span>
        <div>
          <AreaDialogTreeSelectComp v-model="AreaList" />
        </div>
      </div>
      <checkbox-group-comp
         title="客户分类"
        :itemList='userTypeListNoneEmpty'
         v-model='selectUserTypeList'
        />
      <checkbox-group-comp
         title="客户等级"
        :itemList='userRankListNoneEmpty'
         v-model='selectUserRankList'
        />
      <checkbox-group-comp
        class="express-box"
         title="物流方式"
        :itemList='subExpressList'
         v-model='selectExpressList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ProductDialogTreeSelectComp from '@/components/common/SelectorComps/ProductDialogTreeSelectComp.vue';
import AreaDialogTreeSelectComp from '@/components/common/SelectorComps/AreaDialogTreeSelectComp.vue';
import SingleRadioGroupComp from '@/components/common/SingleRadioGroupComp.vue';
import CheckboxGroupComp from '@/components/common/CheckboxGroupComp.vue';
import MinMaxValueInputComp from '@/components/common/SelectorComps/MinMaxValueInputComp.vue';

export default {
  components: {
    CheckboxGroupComp,
    MinMaxValueInputComp,
    SingleRadioGroupComp,
    AreaDialogTreeSelectComp,
    ProductDialogTreeSelectComp,
  },
  data() {
    return {
      // DataType: '', // 数据   客户数量 | null
      // orderStatusList: [], // 订单状态
      // orderCreateTypeList: [], // 客户下单方式
      // orderMinMaxValList: ['', ''], // 客户订单总金额
      // orderLossMinMaxValList: ['', ''], // 客户订单损失总金额
      // ProductList: [], // 产品筛选
      // AreaList: [], // 区域筛选
      // selectUserTypeList: [], // 客户类型
      // selectUserRankList: [], // 客户等级
      // selectExpressList: [], // 物流方式
    };
  },
  computed: {
    ...mapState('common', ['StatisticalCustomerTypeList', 'userTypeListNoneEmpty', 'userRankListNoneEmpty',
      'StatisticalOrderCreateTypeList', 'AfterSalesTypeList', 'StatisticalCustomerOrderStatusList']),
    ...mapState('statistic', ['condition4SaveForm']),
    ...mapGetters('common', ['subExpressList']),
    DataType: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.DataType;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'DataType'], val]);
      },
    },
    orderStatusList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.orderStatusList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'orderStatusList'], val]);
      },
    },
    orderCreateTypeList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.orderCreateTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'orderCreateTypeList'], val]);
      },
    },
    orderMinMaxValList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.orderMinMaxValList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'orderMinMaxValList'], val]);
      },
    },
    orderLossMinMaxValList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.orderLossMinMaxValList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'orderLossMinMaxValList'], val]);
      },
    },
    ProductList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.ProductList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'ProductList'], val]);
      },
    },
    AreaList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.AreaList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'AreaList'], val]);
      },
    },
    selectUserTypeList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.selectUserTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'selectUserTypeList'], val]);
      },
    },
    selectUserRankList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.selectUserRankList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'selectUserRankList'], val]);
      },
    },
    selectExpressList: {
      get() {
        return this.condition4SaveForm.OrderCustomerFormData.selectExpressList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderCustomerFormData', 'selectExpressList'], val]);
      },
    },
  },
};
</script>
<style lang='scss'>
</style>
