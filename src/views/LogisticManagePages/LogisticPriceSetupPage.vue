<template>
  <section class="mp-erp-logistic-item-price-setup-page">
    <CommonFormulaSetupPageComp
      :Condition4getProperty='Condition4ProptertyList'
      :FormulaConditionPropertyList='logisticItemConditionPropertyList'
      :showCompareProp='false'
      :curEditItemData='curEditFormulaData'
      :nameList='nameList'
      productLevel2
      showName
      :showNameMaxLength='40'
      @successSubmit='handleFormulaSuccessSubmit'
    >
      <template #header>
        <p class="mp-common-title-wrap">设置{{Name}}配送方式价格</p>
      </template>
    </CommonFormulaSetupPageComp>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CommonFormulaSetupPageComp from '../../components/common/FormulaAndConditionComps/CommonFormulaSetupPageComp.vue';

export default {
  name: 'LogisticPriceSetupPage',
  components: {
    CommonFormulaSetupPageComp,
  },
  computed: {
    ...mapState('basicSet', ['curEditFormulaData', 'logisticItemConditionPropertyList', 'logisticItemFormulaList']),
    Condition4ProptertyList() {
      return {
        UseModule: 100,
        LogisticsID: this.$route.params.id,
      };
    },
    nameList() {
      return this.logisticItemFormulaList.filter(it => it.ID !== this.curEditFormulaData?.ID).map(it => it.Name);
    },
  },
  data() {
    return {
      LogisticsID: '',
      Name: '',
    };
  },
  methods: {
    getInitData() {
      const { id, name } = this.$route.params;
      this.LogisticsID = id;
      this.Name = name;
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
