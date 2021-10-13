<template>
  <section class="mp-statistic-analyse-add-edit-page-form-wrap">
    <header>
      <span>数据：</span>
      <SingleRadioGroupComp  v-model="DataType" :list='StatisticalDataTypeList' />
    </header>
    <div>
      <checkbox-group-comp
         title="订单状态"
        :itemList='StatisticalOrderStatusList'
         v-model='orderStatusList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
      <checkbox-group-comp
         title="下单方式"
        :itemList='StatisticalOrderCreateTypeList'
         v-model='orderCreateTypeList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
      <MinMaxValueInputComp v-model="singleOrderMinMaxValList" />
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
// import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';
import SingleRadioGroupComp from '@/components/common/SingleRadioGroupComp.vue';
import CheckboxGroupComp from '@/components/common/CheckboxGroupComp.vue';
import MinMaxValueInputComp from '@/components/common/SelectorComps/MinMaxValueInputComp.vue';
// import ProductsCheckoutDiaComp from '@/components/common/ProductsCheckoutDiaComp.vue';
import AreaDialogTreeSelectComp from '@/components/common/SelectorComps/AreaDialogTreeSelectComp.vue';
import ProductDialogTreeSelectComp from '@/components/common/SelectorComps/ProductDialogTreeSelectComp.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    SingleRadioGroupComp,
    CheckboxGroupComp,
    MinMaxValueInputComp,
    // ProductsCheckoutDiaComp,
    AreaDialogTreeSelectComp,
    ProductDialogTreeSelectComp,
  },
  // data() {
  //   return {
  //     // DataType: '', // 数据类型 总金额 | 实际金额 等
  //     // orderStatusList: [], // 订单状态
  //     // orderCreateTypeList: [], // 下单方式
  //     // singleOrderMinMaxValList: ['', ''], // 单个订单金额范围： 最小 - 最大
  //     // ProductList: [], // 选择产品
  //     // AreaList: [], // 区域筛选
  //     // selectUserTypeList: [], // 客户分类
  //     // selectUserRankList: [], // 客户等级
  //     // selectExpressList: [], // 物流方式
  //   };
  // },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('common', ['StatisticalDataTypeList', 'StatisticalOrderStatusList', 'StatisticalOrderCreateTypeList', 'userTypeListNoneEmpty', 'userRankListNoneEmpty']),
    ...mapState('statistic', ['condition4SaveForm']),
    ...mapGetters('common', ['subExpressList']),
    defaultCheckedKeys() {
      return this.ProductList.map(it => it.ProductID);
    },
    DataType: {
      get() {
        return this.condition4SaveForm.OrderFormData.DataType;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'DataType'], val]);
      },
    },
    orderStatusList: {
      get() {
        return this.condition4SaveForm.OrderFormData.orderStatusList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'orderStatusList'], val]);
      },
    },
    orderCreateTypeList: {
      get() {
        return this.condition4SaveForm.OrderFormData.orderCreateTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'orderCreateTypeList'], val]);
      },
    },
    singleOrderMinMaxValList: {
      get() {
        return this.condition4SaveForm.OrderFormData.singleOrderMinMaxValList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'singleOrderMinMaxValList'], val]);
      },
    },
    ProductList: {
      get() {
        return this.condition4SaveForm.OrderFormData.ProductList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'ProductList'], val]);
      },
    },
    AreaList: {
      get() {
        return this.condition4SaveForm.OrderFormData.AreaList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'AreaList'], val]);
      },
    },
    selectUserTypeList: {
      get() {
        return this.condition4SaveForm.OrderFormData.selectUserTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'selectUserTypeList'], val]);
      },
    },
    selectUserRankList: {
      get() {
        return this.condition4SaveForm.OrderFormData.selectUserRankList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'selectUserRankList'], val]);
      },
    },
    selectExpressList: {
      get() {
        return this.condition4SaveForm.OrderFormData.selectExpressList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['OrderFormData', 'selectExpressList'], val]);
      },
    },
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
</style>
