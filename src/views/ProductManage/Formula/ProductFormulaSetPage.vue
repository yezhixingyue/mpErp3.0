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
    :pageLabel='`当前${titleType}`'
    @goback='onGoBackClick'
    @successSubmit='onSuccessSubmit'
   >
   <template #title>
      <!-- <span class="name">公式目标：产品</span> -->
      <span class="name" v-if="formulaTarget">{{formulaTarget}}</span>
      <span class="name">{{showFormulaName}}</span>
    </template>
  </FormulaPanelComp>
</template>

<script>
import { mapState } from 'vuex';
import FormulaPanelComp from '@/components/common/FormulaAndConditionComps/FormulaPanelComp.vue';

export default {
  name: 'ProductFormulaSetPage',
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      moduleIndex: '',
      titleType: '', // 产品 | 部件
      showFormulaName: '',
      formulaTarget: '-- 公式目标：产品',
    };
  },
  components: {
    FormulaPanelComp,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'curEditFormulaData', 'curEditSubFormulaData', 'curSubFormulaAddProperty']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
  },
  methods: {
    getPositionID() {
      const { ProductID, PartID, name, type, moduleIndex, isSubFormula } = this.$route.params;
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.moduleIndex = +moduleIndex;
      if (!isSubFormula || isSubFormula === 'false') {
        const text = this.curEditFormulaData ? this.curEditFormulaData.Name : '新加公式';
        this.showFormulaName = `公式：${text}`;
      } else if (isSubFormula === true || isSubFormula === 'true') {
        const text = this.curEditSubFormulaData ? this.curEditSubFormulaData.Name : '新加子公式';
        this.showFormulaName = `子公式：${text}`;
        if (this.curSubFormulaAddProperty) {
          this.formulaTarget = `-- 子公式目标：${this.curSubFormulaAddProperty.DisplayContent.replace(/\[|\]/g, '')}`;
        } else if (this.curEditSubFormulaData) {
          this.formulaTarget = `-- 子公式目标：${this.curEditSubFormulaData.Target || '未知目标'}`;
        }
      }
    },
    onGoBackClick() {
      const path = `/ProductFormulaList/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/${Date.now()}`;
      this.$router.push(path);
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
