<template>
  <section class="mp-erp-price-module-price-table-common-set-page-wrap">
    <header>
      <h2>{{$route.params.name}}</h2>
      <span></span>
      <span></span>
      <span></span>
    </header>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CraftPriceTableItemSet',
  data() {
    return {
      productData: null,
    };
  },
  computed: {
    ...mapState('priceManage', ['curSolutionItem', 'curEditPriceItemData', 'curPriceItem']), // curEditPriceItemData 为null时为添加
    curPriceCraft() {
      if (!this.productData?.PartList || !this.curSolutionItem?.ApplyRange || !this.curSolutionItem.ApplyRange.CraftID) return null;
      const PartID = this.curSolutionItem?.ApplyRange?.PartID;
      if (!PartID && Array.isArray(this.productData?.CraftList)) {
        return this.productData.CraftList.find(it => it.ID === this.curSolutionItem.ApplyRange.CraftID);
      }
      if (PartID) {
        const t1 = this.productData.PartList.find(it => it.ID === PartID);
        if (t1 && Array.isArray(t1.CraftList)) {
          return t1.CraftList.find(_it => _it.ID === this.curSolutionItem.ApplyRange.CraftID);
        }
      }
      return null;
    },
  },
  methods: {
    async getProductData() {
      this.productData = await this.$store.dispatch('priceManage/getProductCraftData', this.$route.params.id);
      console.log(this.productData);
    },
  },
  mounted() {
    this.getProductData();
  },
};
</script>
<style lang='scss' scoped>
.mp-erp-price-module-price-table-common-set-page-wrap {

}
</style>
