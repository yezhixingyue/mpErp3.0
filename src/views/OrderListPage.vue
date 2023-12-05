<template>
  <div class="order-list-page-wrap">
    <Table @ServiceAfterSalesClick="ServiceAfterSalesClick"/>
    <div class="footer">
      <div class="is-font-size-14" v-if="localPermission.DisplayTotalAmount">
        <span class="is-primary is-bold">总金额:</span>
        <span class="is-pink is-font-size-16 is-bold"> {{orderTotalAmount}}
          <i class="is-font-size-13">元</i></span>
        <span class="is-gray is-font-size-12"> (不含取消和过期订单)</span>
      </div>
      <Count
        :watchPage='objForOrderList.Page'
        :handlePageChange='handlePageChange'
        :showLoading='isTableLoading'
        :count='orderTotalCount'
        :pageSize='20'
      >
        <span class="is-blue" @click="handleDownloadClick('normal')" v-if="localPermission.ExportExcel">
          导出Excel表格
          <i class="el-icon-download"></i>
        </span>
        <span class="is-blue" @click="handleDownloadClick('finance')" v-if="localPermission.ExportFinancialReport">
          导出财务报表
          <i class="el-icon-download"></i>
        </span>
     </Count>
    </div>
    <OrderListDialog @prodProgress="onProdProgressClick" @anewUpload="onAnewUploadClick" />
    <!-- 工厂进度弹窗 -->
    <NodePicDialog v-if="orderDetailData"
     :visible="processVisible" @update:visible="(val) => processVisible = val" :targetID="orderDetailData.OrderID" :item="null" :targetType="2" />
    <!-- 申请售后弹窗 -->
    <ServiceAfterSalesDialog :visible='ServiceAfterSalesVisible'
    :ServiceAfterSales="ServiceAfterSales" @close='ServiceAfterSalesVisible=false; ServiceAfterSales = null;'
    @success="ServiceAfterSalesSuccess"></ServiceAfterSalesDialog>
    <!-- <ServiceDialog key="order-list-page" className='show-black' /> -->
    <!-- 重新上传文件再审稿弹窗 -->
    <AnewUploadDialog :visible.sync="AnewUploadVisible" :CustomerID="orderDetailData?.Customer?.CustomerID || ''" :handerFunc="AnewUploadHanderFunc" />
  </div>
</template>

<script>
import OrderListDialog from '@/components/order/Main/OrderListDialog.vue';
import ServiceAfterSalesDialog from '@/components/order/Main/ServiceAfterSalesDialog.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Table from '@/components/order/Main/Table2.vue';
import Count from '@/components/common/Count.vue';
import NodePicDialog from '@/components/common/NodePicDialog/NodePicDialog.vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import AnewUploadDialog from '@/components/order/Main/AnewUploadDialog/AnewUploadDialog.vue';

export default {
  components: {
    Table,
    Count,
    OrderListDialog,
    ServiceAfterSalesDialog,
    NodePicDialog,
    AnewUploadDialog,
    // ServiceDialog: () => import(/* webpackChunkName: "async" */ '@/components/order/DialogContent/ServiceDialog.vue'),
  },
  mixins: [recordScrollPositionMixin('.order-list-page-wrap .el-table__body-wrapper')],
  computed: {
    ...mapState('orderModule', ['orderTotalCount', 'orderTotalAmount', 'isTableLoading', 'objForOrderList', 'orderListData', 'orderDetailData']),
    ...mapGetters('timeSelectModule', ['TodayDate']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageOrder?.Obj) {
        return this.Permission.PermissionList.PermissionManageOrder.Obj;
      }
      return {};
    },
    // ...mapGetters('layout', ['curTabPagesNameList']),
    // ...mapState
  },
  data() {
    return {
      ServiceAfterSalesVisible: false,
      ServiceAfterSales: null,
      processVisible: false,
      AnewUploadVisible: false,
    };
  },
  methods: {
    ...mapActions('orderModule', ['getOrderTableData', 'getOrderListData2Excel']),
    handlePageChange(page) {
      this.getOrderTableData({ page, type: 'get' });
    },
    ServiceAfterSalesSuccess() {
      this.getOrderTableData();
      this.ServiceAfterSalesVisible = false;
      this.ServiceAfterSales = null;
    },
    handleActionDownload(type) {
      this.getOrderListData2Excel(type);
    },
    handleDownloadClick(type = 'normal') {
      if (this.objForOrderList.Page === 1
           && this.orderListData.length === 0
           && this.orderTotalCount === 0) {
        this.$message.error('当前条件没有可下载的列表数据!');
        return;
      }
      this.handleActionDownload(type);
    },
    ServiceAfterSalesClick(data) {
      // this.ServiceAfterSalesVisible = true;
      // this.ServiceAfterSales = data;
      this.$router.push({ name: 'applyAfterSales', params: { ServiceAfterSales: data } });
    },
    onProdProgressClick() {
      this.processVisible = true;
    },
    onAnewUploadClick() { // 重新上传文件再审稿
      this.AnewUploadVisible = true;
    },
    AnewUploadHanderFunc(list) {
      return this.$store.dispatch('orderModule/setOrderReCheckFile', list);
    },
  },
  mounted() {
    this.$store.commit('orderModule/setSelectTime', ['TodayDate', 1]);
    this.$store.commit('orderModule/clearConfigObj');
    this.getOrderTableData();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.order-list-page-wrap {
  > .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .count-wrap {
      flex: 1;
      > .is-blue {
        margin-left: 60px;
        margin-right: -20px;
        cursor: pointer;
        // line-height: 46px;
        &:hover {
          color: $--color-primary-light !important;
        }
      }
    }
    > .is-font-size-14 {
      flex: none;
      margin-left: 20px;
    }
  }
}
</style>
