<!--
 * @Author: your name
 * @Date: 2020-03-21 10:19:17
 * @LastEditTime: 2021-05-07 16:17:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/views/PackageListPage1.vue
-->
<template>
  <div class="order-list-page-wrap">
    <Table />
    <Count :watchPage='objForOrderList.PayListPage'
     :showLoading='isTableLoading' :handlePageChange='handlePageChange' :count='PackTotalCount' />
    <OrderListDialog />
    <ServiceDialog />
  </div>
</template>

<script>
import OrderListDialog from '@/components/order/Main/OrderListDialog.vue';
// import ServiceDialog from '@/components/order/DialogContent/ServiceDialog.vue';
import Table from '@/components/Package/TableTransport.vue';
import Count from '@/components/common/Count.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'PaymentListPage',
  components: {
    Table,
    OrderListDialog,
    ServiceDialog: () => import(/* webpackChunkName: "async" */ '@/components/order/DialogContent/ServiceDialog.vue'),
    Count,
  },
  computed: {
    ...mapState('orderModule', ['PackTotalCount', 'isTableLoading', 'objForOrderList']),
  },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     vm.$store.commit('orderModule/setIsExpressListPage', true);
  //   });
  // },
  // beforeRouteLeave(to, from, next) {
  //   this.$store.commit('orderModule/setIsExpressListPage', false);
  //   next();
  // },
  methods: {
    ...mapActions('orderModule', ['getExpressTableData']),
    handlePageChange(page) {
      this.getExpressTableData({ page, type: 'get' });
    },
  },
  mounted() {
    console.log('mounted packagelist page');
    // this.$store.commit('orderModule/clearConfigObj');
    this.$store.commit('orderModule/setSelectTime', ['TodayDate', 1]);
    this.getExpressTableData();
  },
  // created() {
  //   const { token } = this.$route.params;
  //   if (!token) return;
  //   if (sessionStorage.getItem('token')) sessionStorage.removeItem('token');
  //   sessionStorage.setItem('token', JSON.stringify(token));
  // },
};
</script>

<style>
</style>
