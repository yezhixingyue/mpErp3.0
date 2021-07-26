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
    />
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
      const { ProductID, name, moduleIndex } = this.$route.params;
      this.ProductID = ProductID;
      this.ProductName = name;
      this.moduleIndex = +moduleIndex;
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
