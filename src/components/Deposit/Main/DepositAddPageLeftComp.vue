<template>
  <div class="mp-deposit-add-page-content-left-comp-wrap mp-scroll-wrap">
    <NewAreaTreeSpreadComp isLevel2 v-model="ProductRange" :list='allProductClassify4Customer' title="产品" leftWidth='7em' rightItemWidth='10em' />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import NewAreaTreeSpreadComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp';

export default {
  components: {
    NewAreaTreeSpreadComp,
  },
  computed: {
    ...mapGetters('common', ['allProductClassify4Customer']),
    ...mapState('deposit', ['objForDepositAdd']),
    ProductRange: {
      get() {
        return {
          IsIncludeIncreased: this.objForDepositAdd ? this.objForDepositAdd.IsIncludeIncreasedProduct : false,
          List: this.objForDepositAdd ? this.objForDepositAdd.ProductClassList : [],
        };
      },
      set(val) {
        const { IsIncludeIncreased, List } = val;
        this.$store.commit('deposit/setObjForDepositAdd', [['IsIncludeIncreasedProduct', ''], IsIncludeIncreased || false]);
        this.$store.commit('deposit/setObjForDepositAdd', [['ProductClassList', ''], List || []]);
      },
    },
  },
  mounted() {
    this.$store.dispatch('common/getProductClassifyData', { key: 2 });
    this.$store.dispatch('common/getAllProductNames');
  },
};
</script>

<style lang='scss'>
.mp-deposit-add-page-content-left-comp-wrap {
  width: 100%;
  height: 100%;
  padding-left: 25px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
