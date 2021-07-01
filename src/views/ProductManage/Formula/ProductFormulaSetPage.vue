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
    />
</template>

<script>
import { mapState } from 'vuex';
import FormulaPanelComp from '@/components/common/FormulaAndConditionComps/FormulaPanelComp.vue';

export default {
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      moduleIndex: '',
      titleType: '', // 产品 | 部件
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
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type, moduleIndex } = this.$route.params;
      if (!ProductID || !PartID || !name || !type || !moduleIndex) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.moduleIndex = +moduleIndex;
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
