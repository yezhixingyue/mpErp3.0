<template>
  <FormulaPanelComp
    v-if="ProductID"
    class="mp-erp-product-module-formula-set-page-wrap mp-erp-price-module-quotation-scheme-set-page-wrap"
    :PositionID='ProductID'
    :PriceID='PriceID'
    PositionType='ProductID'
    :moduleIndex='6'
    :NowEditFormulaData='curQuotationSchemeData'
    :pageTitle='ProductName'
    :Condition4getProperty='Condition4getFormulaProperty'
    pageLabel='当前产品'
    FormulaLabel='报价方案名称'
    hiddenUnit
    @goback='onGoBackClick'
    @successSubmit='onSuccessSubmit'
    >
    <template #title>
      <span class="name">价格名称：{{PriceName}}</span>
      <span class="name">报价方案：{{curQuotationSchemeName}}</span>
    </template>
  </FormulaPanelComp>
</template>

<script>
import { mapState } from 'vuex';
import FormulaPanelComp from '@/components/common/FormulaAndConditionComps/FormulaPanelComp.vue';

export default {
  name: 'QuotationSchemeSet',
  components: {
    FormulaPanelComp,
  },
  computed: {
    ...mapState('priceManage', ['curPriceItem', 'curQuotationSchemeData']),
    curQuotationSchemeName() {
      return this.curQuotationSchemeData ? this.curQuotationSchemeData.Name : '新加方案';
    },
    Condition4getFormulaProperty() {
      return {
        ProductID: this.ProductID,
        PriceID: this.PriceID,
        UseModule: 6,
      };
    },
  },
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      // ProductData: null,
    };
  },
  methods: {
    onGoBackClick(type) {
      if (type === 'success') {
        this.$router.push({
          name: 'QuotationScheme',
          params: { ...this.$route.params, timer: Date.now() },
        });
      } else {
        this.$goback();
      }
    },
    onSuccessSubmit(e) {
      if (!e) return;
      this.$store.commit('priceManage/setPriceItemSolutionListChange', [this.ProductID, this.PriceID, ...e]);
    },
  },
  mounted() {
    if (!this.curPriceItem) {
      this.$goback();
      return;
    }
    const { ID, Name } = this.curPriceItem;
    this.PriceID = ID;
    this.PriceName = Name;
    this.ProductID = this.$route.params.id;
    this.ProductName = this.$route.params.name;
    // this.getProductData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-quotation-scheme-set-page-wrap {
  > header {
    .name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
      & + .name {
        margin-left: 40px;
      }
    }
  }
}
</style>
