<template>
  <div class="mp-deposit-list-page-wrap">
    <deposit-list-page-header />
    <deposit-list-page-main />
  </div>
</template>

<script>
import DepositListPageHeader from '@/components/Deposit/Header/DepositListPageHeader.vue';
import DepositListPageMain from '@/components/Deposit/Main/DepositListPageMain.vue';

export default {
  name: 'DepositListPage',
  components: {
    DepositListPageHeader,
    DepositListPageMain,
  },

};
</script>

<style lang='scss'>
.mp-deposit-list-page-wrap {
  height: 100%;
  width: 100%;
  background-color: rgb(245, 245, 245);
}
</style>
