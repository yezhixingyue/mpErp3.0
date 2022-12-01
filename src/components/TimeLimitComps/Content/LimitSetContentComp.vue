<template>
  <article class="mp-erp-time-limit-set-page-content-wrap">
    <ProductSelectComp :ProductList="TimeLimitData.ProductList" :ProductClass="TimeLimitData.ProductClass" />
    <!-- <AdAreaComp /> -->
    <SchemaListComp />
    <CraftSchemaComp />
  </article>
</template>

<script>
// import AdAreaComp from '@/components/common/NewComps/AdAreaComp.vue';
import ProductSelectComp from '../Comps/SetComps/ProductSelectComp.vue';
import SchemaListComp from '../Comps/SetComps/SchemaListComp.vue';
import CraftSchemaComp from '../Comps/SetComps/CraftSchemaComp.vue';

export default {
  props: {
    TimeLimitData: {
      type: Object,
      required: true,
    },
  },
  components: {
    ProductSelectComp,
    SchemaListComp,
    CraftSchemaComp,
    // AdAreaComp,
  },
};
</script>

<style lang='scss'>
.mp-erp-time-limit-set-page-content-wrap {
  > section {
    display: flex;
    align-items: flex-start;
    > header {
      color: #444;
      font-weight: 700;
      flex: 0 0 auto;
      line-height: 19px;
      margin-right: 6px;
    }
    // > div {
    // }
  }
}
</style>
