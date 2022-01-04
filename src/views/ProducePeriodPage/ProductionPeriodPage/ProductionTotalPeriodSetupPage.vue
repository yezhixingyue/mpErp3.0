<template>
  <section class="mp-product-production-total-period-setup-page">
    <CommonFormulaSetupPageComp
      :Condition4getProperty='Condition4ProptertyList'
      :FormulaConditionPropertyList='PeriodItemConditionPropertyList'
      :curEditItemData='curEditFormulaData'
      @successSubmit='handleFormulaSuccessSubmit'
    >
      <template #header>
        <h2>当前产品：{{curSetupProduct.Name}}</h2>
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
        UseModule: 10,
        ProductID: this.curSetupProduct.ID,
      };
    },
  },
  methods: {
    handleFormulaSuccessSubmit([isEdit, data, ID]) {
      this.$store.commit('periodManage/setPeriodItemFormulaListItemChange', { isEdit, data, ID, isTotal: true });
    },
  },
};
</script>
<style lang='scss'>
.mp-product-production-total-period-setup-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
