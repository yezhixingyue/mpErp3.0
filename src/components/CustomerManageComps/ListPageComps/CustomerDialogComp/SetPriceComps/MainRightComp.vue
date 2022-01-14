<template>
  <section class="mp-erp-comps-customer-detail-display-dialog-comp-set-price-index-main-right-comp-wrap" v-if="customer">
    充值
  </section>
</template>

<script>
export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-detail-display-dialog-comp-set-price-index-main-right-comp-wrap {
  flex: 1 !important;
  border-left: 1px solid #eee;
}
</style>
