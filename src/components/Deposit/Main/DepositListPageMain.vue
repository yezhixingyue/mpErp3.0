<template>
  <div class="mp-erp-deposit-list-page-main-wrap">
    <deposit-list-page-main-table />
    <!-- <Count /> -->
  </div>
</template>

<script>
// import Count from '@/components/common/Count.vue';
import DepositListPageMainTable from './DepositListPageMainTable.vue';

export default {
  components: {
    DepositListPageMainTable,
    // Count,
  },
};
</script>

<style>
/* .mp-erp-deposit-list-page-main-wrap {
  padding: 0 5px;
} */

</style>
