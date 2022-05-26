<!--
 * @Author: your name
 * @Date: 2020-03-25 17:41:47
 * @LastEditTime: 2022-03-22 09:40:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/views/PaymentListPage.vue
-->
<template>
  <div class="mp-payment-list-wrap">
    <PaymentListHeader />
    <div class="mp-payment-list-content">
      <PaymentListContent />
    </div>
  </div>
</template>

<script>
import PaymentListContent from '@/components/PaymentList/content/PaymentListContent.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import PaymentListHeader from '../components/PaymentList/header/PaymentListHeader.vue';

export default {
  name: 'PaymentListPage',
  mixins: [recordScrollPositionMixin('.mp-payment-list-content .el-table__body-wrapper')],
  components: {
    PaymentListContent,
    PaymentListHeader,

  },
  mounted() {
    this.$store.commit('paymentModule/clearConfigObj');
    this.$store.dispatch('paymentModule/getPaymentListTableData');
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-payment-list-wrap {
  padding: 10px;
  background-color: $--bg-color-base;
  width: calc(100% - 180px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    background-color: $--color-white;
    padding: 25px 0 0px 20px;
    .mp-time-serach-wrap .mp-order-time-select-box,
    .mp-time-serach-wrap .mp-order-search-box {
      padding-bottom: 15px;
    }
    > .first-row {
      display: flex;
      flex-wrap: wrap;
      > * {
        margin-bottom: 22px;
      }
      > :nth-child(2),> :nth-child(3){
        margin-right: 45px;
      }
    }
    .text {
      font-size: 14px;
      text-align: right;
      line-height: 25px;
      font-weight: 600;
      color: $--color-text-table;
      width: 5em;
      vertical-align: top;
    }
  }
  > .mp-payment-list-content{
    width: 100%;
    flex: 1;
    padding-top: 10px;
  }
}
</style>
