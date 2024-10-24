<template>
  <div class="order-list-page-wrap">
    <Table @ServiceAfterSalesClick="ServiceAfterSalesClick"
    @FreightWriteOff="FreightWriteOff"
    @CancelProductionClick="CancelProductionClick"
    @TerminateProductionClick="TerminateProductionClick"
    />
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
    <OrderListDialog :CertificateList="CertificateList"
     @prodProgress="onProdProgressClick" @anewUpload="onAnewUploadClick" @setCertificateList=setCertificateList />
    <!-- 工厂进度弹窗 -->
    <NodePicDialog v-if="orderDetailData"
     :visible="processVisible" @update:visible="(val) => processVisible = val" :targetID="orderDetailData.OrderID" :item="null" :targetType="2" />
    <!-- 申请售后弹窗 -->
    <!-- <ServiceAfterSalesDialog :visible='ServiceAfterSalesVisible'
    :ServiceAfterSales="ServiceAfterSales" @close='ServiceAfterSalesVisible=false; ServiceAfterSales = null;'
    @success="ServiceAfterSalesSuccess"></ServiceAfterSalesDialog> -->
    <ConfirmCancellationDialog :visible='ConfirmCancellationVisible'
    :OrderData="CancelProductionData"
    @close="ConfirmCancellationVisible = false"
    @yes="CancelProduction"
    ></ConfirmCancellationDialog>
    <TerminateProductionDialog :visible='TerminateProductionVisible'
    :OrderData="CancelProductionData"
    @close="TerminateProductionVisible = false"
    @yes="TerminateProduction"
    ></TerminateProductionDialog>
    <!-- <ServiceDialog key="order-list-page" className='show-black' /> -->
    <!-- 重新上传文件再审稿弹窗 -->
    <QuestionHandlerDialog
     :visible.sync="AnewUploadVisible"
     :CustomerID="orderDetailData?.Customer?.CustomerID || ''"
     :CertificateID="CertificateID"
     :CertificateList="CertificateList"
     :CertificateTypeList="CertificateType"
     :handerFunc="AnewUploadHanderFunc"
     @setCertificateList=setCertificateList
     />
  </div>
</template>

<script>
import OrderListDialog from '@/components/order/Main/OrderListDialog.vue';
// import ServiceAfterSalesDialog from '@/components/order/Main/ServiceAfterSalesDialog.vue';
import ConfirmCancellationDialog from '@/components/order/Main/ConfirmCancellationDialog.vue';
import TerminateProductionDialog from '@/components/order/Main/TerminateProductionDialog/index.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Table from '@/components/order/Main/Table2.vue';
import Count from '@/components/common/Count.vue';
import NodePicDialog from '@/components/common/NodePicDialog/NodePicDialog.vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import QuestionHandlerDialog from '@/components/order/Main/QuestionHandlerDialog/QuestionHandlerDialog.vue';

export default {
  components: {
    Table,
    Count,
    OrderListDialog,
    // ServiceAfterSalesDialog,
    NodePicDialog,
    QuestionHandlerDialog,
    ConfirmCancellationDialog,
    TerminateProductionDialog,
    // ServiceDialog: () => import(/* webpackChunkName: "async" */ '@/components/order/DialogContent/ServiceDialog.vue'),
  },
  mixins: [recordScrollPositionMixin('.order-list-page-wrap .el-table__body-wrapper')],
  computed: {
    ...mapState('orderModule', ['orderTotalCount', 'orderTotalAmount', 'isTableLoading', 'objForOrderList', 'orderListData', 'orderDetailData']),
    ...mapGetters('timeSelectModule', ['TodayDate']),
    ...mapState('common', ['Permission', 'CertificateType']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageOrder?.Obj) {
        return this.Permission.PermissionList.PermissionManageOrder.Obj;
      }
      return {};
    },
    CertificateID() {
      if (this.orderDetailData && this.orderDetailData.CertificateFileList && this.orderDetailData.CertificateFileList.length) {
        return this.orderDetailData.CertificateFileList[0];
      }

      return '';
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
      ConfirmCancellationVisible: false,
      TerminateProductionVisible: false,
      // 要被取消生产的订单
      CancelProductionData: null,
      // 要被取消生产的index
      CancelProductionIndex: null,
      CertificateList: [],
    };
  },
  methods: {
    ...mapActions('orderModule', ['delTargetOrder', 'getOrderTableData', 'getOrderListData2Excel']),
    setCertificateList(list) {
      this.CertificateList = list;
    },
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
    // 停止生产
    TerminateProduction() {
      this.TerminateProductionVisible = false;
      this.messageBox.successSingle(
        '取消成功',
        this.getOrderTableData,
        this.getOrderTableData,
      );
    },
    // 取消生产
    CancelProduction() {
      this.delTargetOrder(this.CancelProductionIndex);
      this.ConfirmCancellationVisible = false;
      // this.messageBox.successSingle(
      //   '取消成功',
      //   this.getOrderTableData,
      //   this.getOrderTableData,
      // );
    },
    // 取消生产点击 =》 弹框提示
    CancelProductionClick(index, Order) {
      this.CancelProductionData = Order;
      this.CancelProductionIndex = index;
      this.ConfirmCancellationVisible = true;
    },
    // 停止生产点击 =》 弹框提示
    TerminateProductionClick(index, Order) {
      this.CancelProductionData = Order;
      this.CancelProductionIndex = index;
      this.TerminateProductionVisible = true;
    },
    ServiceAfterSalesClick(data) {
      // this.ServiceAfterSalesVisible = true;
      // this.ServiceAfterSales = data;
      this.$router.push({ name: 'applyAfterSales',
        query: {
          OrderID: data.OrderID,
        },
      });
    },
    FreightWriteOff(data) {
      this.$router.push({ name: 'FreightWriteOffPage',
        params: {
          Weight: data.Weight,
          ProductID: data.ProductID,
          CustomerID: data.CustomerID,
          OrderID: data.OrderID,
          OrderData: data,
          ProductPrice: data.Funds.FinalPrice,
        },
      });
    },
    onProdProgressClick() {
      this.processVisible = true;
    },
    onAnewUploadClick() { // 重新上传文件再审稿
      this.AnewUploadVisible = true;
    },
    AnewUploadHanderFunc(data) {
      return this.$store.dispatch('orderModule/setOrderReCheckFile', data);
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
