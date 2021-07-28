<template>
  <FormulaPanelComp
    v-if="ProductID && (moduleIndex || moduleIndex === 0)"
    class="mp-erp-product-module-formula-set-page-wrap"
    :PositionID='ProductID'
    PositionType='ProductID'
    :moduleIndex='moduleIndex'
    :NowEditFormulaData='curEditFormulaData'
    :curEditSubFormulaData='curEditSubFormulaData'
    :curSubFormulaAddProperty='curSubFormulaAddProperty'
    :pageTitle='ProductName'
    pageLabel='当前产品'
    @goback='onGoBackClick'
    @successSubmit='onSuccessSubmit'
   >
   <template #title>
      <span class="name" v-if="formulaTarget">{{formulaTarget}}</span>
      <span class="name">{{showFormulaName}}</span>
    </template>
  </FormulaPanelComp>
</template>

<script>
import { mapState } from 'vuex';
import FormulaPanelComp from '@/components/common/FormulaAndConditionComps/FormulaPanelComp.vue';

export default {
  name: 'PriceFormulaSetPage',
  data() {
    return {
      ProductID: '',
      ProductName: '',
      moduleIndex: '',
      formulaTarget: '-- 公式目标：产品',
      showFormulaName: '',
    };
  },
  components: {
    FormulaPanelComp,
  },
  computed: {
    ...mapState('priceManage', ['curEditFormulaData', 'curEditSubFormulaData', 'curSubFormulaAddProperty']),
  },
  methods: {
    getPositionID() {
      const { ProductID, name, moduleIndex, isSubFormula } = this.$route.params;
      this.ProductID = ProductID;
      this.ProductName = name;
      this.moduleIndex = +moduleIndex;
      if (!isSubFormula || isSubFormula === 'false') {
        const text = this.curEditFormulaData ? this.curEditFormulaData.Name : '新增公式';
        this.showFormulaName = `公式：${text}`;
      } else if (isSubFormula === true || isSubFormula === 'true') {
        const text = this.curEditSubFormulaData ? this.curEditSubFormulaData.Name : '新增子公式';
        this.showFormulaName = `子公式：${text}`;
        if (this.curSubFormulaAddProperty) {
          this.formulaTarget = `-- 子公式目标：${this.curSubFormulaAddProperty.DisplayContent.replace(/\[|\]/g, '')}`;
        } else if (this.curEditSubFormulaData) {
          this.formulaTarget = `-- 子公式目标：${this.curEditSubFormulaData.Target || '未知目标'}`;
        }
      }
    },
    onGoBackClick(type) {
      if (type === 'success') {
        const path = `/PriceFormulaList/${this.ProductID}/${this.ProductName}/${Date.now()}`;
        this.$router.push(path);
      } else {
        this.$goback();
      }
    },
    onSuccessSubmit() {
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
</style>
