<!--
 * @Author: your name
 * @Date: 2020-03-25 17:58:20
 * @LastEditTime: 2022-01-05 10:25:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/components/PaymentList/content/PaymentListContent.vue
-->
<template>
  <div class="mp-paymentlist-page-content">
    <TablePayment />
    <!-- <Test /> -->
    <Count :watchPage='set2PaymentList.Page'
    :handlePageChange='handlePageChange' :count='totalCount' :showLoading='showTableLoading'>
      <span class="blue-span" @click="handleDownloadClick" v-if="localPermission.ExportExcel">
        导出Excel表格
        <i class="el-icon-download"></i>
      </span>
    </Count>
    <Dialog2Pay />
    <Dialog2Detail />
  </div>
</template>

<script>
import Count from '@/components/common/Count.vue';
import { mapState, mapActions, mapGetters } from 'vuex';
// import Test from '../SmallComp/Test.vue';
import handleExcelDownload from '@/assets/js/upload/downloadExcel';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import TablePayment from './TablePayment.vue';
import Dialog2Pay from './Dialog2Pay.vue';
import Dialog2Detail from './Dialog2Detail.vue';

export default {
  components: {
    TablePayment,
    Count,
    Dialog2Pay,
    Dialog2Detail,
    // Test,
  },
  computed: {
    ...mapState('paymentModule', ['totalCount', 'showTableLoading', 'set2PaymentList']),
    ...mapGetters('timeSelectModule', ['TodayDate']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionPayment?.Obj) {
        return this.Permission.PermissionList.PermissionPayment.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapActions('paymentModule', ['getPaymentListTableData']),
    handlePageChange(page) {
      this.getPaymentListTableData({ page, type: 'get' });
    },
    handleDownloadClick() {
      let fileName = '付款单列表.xls';

      const { First, Second } = this.set2PaymentList.CreateDate;
      if (First && Second) {
        const f = First.split('T')[0];
        let _second = '';
        if (new Date(Second) > new Date()) {
          const PlaceDate = this.TodayDate;
          _second = PlaceDate.Second;
        } else {
          _second = Second;
        }
        const t2 = _second ? ConvertTimeFormat(new Date(new Date(_second).getTime() - 24 * 60 * 60 * 1000)) : '';
        if (f) fileName = `付款单列表(${f}至${t2}).xls`;
      } else {
        fileName = '付款单列表(全部).xls';
      }
      handleExcelDownload(this.set2PaymentList, this.api.getPaymentData2Excel, fileName);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
  .mp-paymentlist-page-content{
    // border: 1px solid $--border-color-base;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background-color: $--color-white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .mp-pagination-wrap {
      margin-right: 50px;
    }
  }
</style>
