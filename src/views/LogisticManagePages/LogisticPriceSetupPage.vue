<template>
  <section class="mp-erp-logistic-item-price-setup-page">
    <CommonFormulaSetupPageComp
      :Condition4getProperty='Condition4ProptertyList'
      :FormulaConditionPropertyList='logisticItemConditionPropertyList'
      :showCompareProp='false'
      :curEditItemData='curEditFormulaData'
      showName
      @successSubmit='handleFormulaSuccessSubmit'
    >
      <template #header>
        <!-- <h2>当前产品：{{curSetupProduct.Name}}</h2>
        <span>工期组成方案：{{$route.params.ProduceItemName}}</span> -->
        <p class="mp-common-title-wrap">设置{{name}}配送方式价格</p>
      </template>
    </CommonFormulaSetupPageComp>
  </section>
</template>

<script>
import CommonFormulaSetupPageComp from '@/components/common/FormulaAndConditionComps/CommonFormulaSetupPageComp';
import { mapState } from 'vuex';

export default {
  name: 'LogisticPriceSetupPage',
  components: {
    CommonFormulaSetupPageComp,
  },
  computed: {
    ...mapState('basicSet', ['curEditFormulaData', 'logisticItemConditionPropertyList']),
    Condition4ProptertyList() {
      return {
        UseModule: 100,
        LogisticsID: this.$route.params.id,
      };
    },
  },
  data() {
    return {
      LogisticsID: '',
      name: '',
    };
  },
  methods: {
    getInitData() {
      const { id, name } = this.$route.params;
      this.LogisticsID = id;
      this.name = name;
    },
    handleFormulaSuccessSubmit([isEdit, data, ID]) {
      const temp = {
        LogisticsID: this.LogisticsID,
        isEdit,
        data,
        ID,
      };
      this.$store.commit('basicSet/setLogisticsItemFormulaListItemChange', temp);
    },
  },
  mounted() {
    this.getInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-logistic-item-price-setup-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .mp-erp-common-module-formula-setup-page-comp-wrap > header {
    padding-bottom: 4px;
  }
}
</style>
