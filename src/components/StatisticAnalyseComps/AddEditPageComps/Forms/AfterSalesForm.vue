<template>
  <section class="mp-statistic-analyse-add-edit-page-form-wrap widen">
    <header>
      <span>数据：</span>
      <SingleRadioGroupComp  v-model="DataType" :list='StatisticalAfterSalesDataTypeList' />
    </header>
    <div>
      <checkbox-group-comp
         title="售后单类型"
        :itemList='AfterSalesTypeList'
         v-model='selectAfterSalesOrderTypeList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
      <checkbox-group-comp
         title="下单方式"
        :itemList='StatisticalOrderCreateTypeList'
         v-model='orderCreateTypeList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
      <MinMaxValueInputComp title='单个订单金额' v-model="singleOrderMinMaxValList" /> <!-- 单个订单金额 -->
      <MinMaxValueInputComp title="单个订单损失金额" v-model="singleOrderLossMinMaxValList" /> <!-- 单个订单损失金额 -->
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
      <div class="area-product-select-box">
        <span>问题筛选：</span>
        <div>
          <QuestionComp v-model="questionList" />
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
import QuestionComp from './QuestionComp.vue';

export default {
  components: {
    QuestionComp,
    CheckboxGroupComp,
    MinMaxValueInputComp,
    SingleRadioGroupComp,
    AreaDialogTreeSelectComp,
    ProductDialogTreeSelectComp,
  },
  data() {
    return {
      // questionList: [],
      // DataType: '', // 数据   客户数量 | null
      // selectAfterSalesOrderTypeList: [], // 售后单类型
      // orderCreateTypeList: [], // 下单方式
      // singleOrderMinMaxValList: ['', ''], // 单个订单金额
      // singleOrderLossMinMaxValList: ['', ''], // 单个订单损失金额
      // ProductList: [], // 产品筛选
      // AreaList: [], // 区域筛选
      // selectUserTypeList: [], // 客户类型
      // selectUserRankList: [], // 客户等级
      // selectExpressList: [], // 物流方式
    };
  },
  computed: {
    ...mapState('common', ['StatisticalAfterSalesDataTypeList', 'userTypeListNoneEmpty', 'userRankListNoneEmpty',
      'StatisticalOrderCreateTypeList', 'AfterSalesTypeList']),
    ...mapGetters('common', ['subExpressList']),
    ...mapState('statistic', ['condition4SaveForm']),
    DataType: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.DataType;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'DataType'], val]);
      },
    },
    selectAfterSalesOrderTypeList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.selectAfterSalesOrderTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'selectAfterSalesOrderTypeList'], val]);
      },
    },
    orderCreateTypeList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.orderCreateTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'orderCreateTypeList'], val]);
      },
    },
    singleOrderMinMaxValList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.singleOrderMinMaxValList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'singleOrderMinMaxValList'], val]);
      },
    },
    singleOrderLossMinMaxValList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.singleOrderLossMinMaxValList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'singleOrderLossMinMaxValList'], val]);
      },
    },
    ProductList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.ProductList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'ProductList'], val]);
      },
    },
    AreaList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.AreaList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'AreaList'], val]);
      },
    },
    questionList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.questionList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'questionList'], val]);
      },
    },
    selectUserTypeList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.selectUserTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'selectUserTypeList'], val]);
      },
    },
    selectUserRankList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.selectUserRankList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'selectUserRankList'], val]);
      },
    },
    selectExpressList: {
      get() {
        return this.condition4SaveForm.AfterSalesFormData.selectExpressList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['AfterSalesFormData', 'selectExpressList'], val]);
      },
    },
  },
};
</script>
<style lang='scss'>
</style>
