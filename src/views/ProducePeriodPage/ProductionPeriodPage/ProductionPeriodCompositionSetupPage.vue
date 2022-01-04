<template>
  <section class="mp-product-production-period-composition-setup-page">
    <CommonFormulaSetupPageComp
      :Condition4getProperty='Condition4ProptertyList'
      :FormulaConditionPropertyList='PeriodItemConditionPropertyList'
      :curEditItemData='curEditFormulaData'
      @successSubmit='handleFormulaSuccessSubmit'
    >
      <template #header>
        <h2>当前产品：{{curSetupProduct.Name}}</h2>
        <span>工期组成方案：{{$route.params.ProduceItemName}}</span>
      </template>
    </CommonFormulaSetupPageComp>
  </section>
</template>

<script>
import CommonFormulaSetupPageComp from '@/components/common/FormulaAndConditionComps/CommonFormulaSetupPageComp';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'ProductionPeriodCompositionSetupPage',
  components: {
    CommonFormulaSetupPageComp,
  },
  computed: {
    ...mapGetters('periodManage', ['curSetupProduct']),
    ...mapState('periodManage', ['curEditFormulaData', 'PeriodItemConditionPropertyList']),
    Condition4ProptertyList() {
      return {
        ProduceItemID: this.$route.params.ProduceItemID,
        UseModule: 9,
        ProductID: this.curSetupProduct.ID,
      };
    },
  },
  methods: {
    handleFormulaSuccessSubmit([isEdit, data, ID]) {
      this.$store.commit('periodManage/setPeriodItemFormulaListItemChange', { isEdit, data, ID });
    },
  },
};
</script>
<style lang='scss'>
.mp-product-production-period-composition-setup-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
