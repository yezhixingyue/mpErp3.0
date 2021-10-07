<template>
  <div class="order-list-page-wrap">
    <Table />
    <div class="footer">
      <div class="is-font-size-14">
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
      >
        <span class="is-blue" @click="handleDownloadClick('normal')">
          导出Excel表格
          <i class="el-icon-download"></i>
        </span>
        <span class="is-blue" @click="handleDownloadClick('finance')">
          导出财务报表
          <i class="el-icon-download"></i>
        </span>
     </Count>
    </div>
    <OrderListDialog />
    <ServiceDialog key="order-list-page" className='show-black' />
  </div>
</template>

<script>
import OrderListDialog from '@/components/order/Main/OrderListDialog.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Table from '@/components/order/Main/Table2.vue';
import Count from '@/components/common/Count.vue';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    Table,
    Count,
    OrderListDialog,
    ServiceDialog: () => import(/* webpackChunkName: "async" */ '@/components/order/DialogContent/ServiceDialog.vue'),
  },
  mixins: [recordScrollPositionMixin('.order-list-page-wrap .el-table__body-wrapper')],
  computed: {
    ...mapState('orderModule', ['orderTotalCount', 'orderTotalAmount', 'isTableLoading', 'objForOrderList', 'orderListData']),
    ...mapGetters('timeSelectModule', ['TodayDate']),
    // ...mapGetters('layout', ['curTabPagesNameList']),
    // ...mapState
  },
  methods: {
    ...mapActions('orderModule', ['getOrderTableData', 'getOrderListData2Excel']),
    handlePageChange(page) {
      this.getOrderTableData({ page, type: 'get' });
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
  },
  mounted() {
    // if (!this.curTabPagesNameList.find(it => it === this.$route.path)) {
    //   this.$store.commit('orderModule/setSelectTime', ['TodayDate', 1]);
    //   this.getOrderTableData();
    // }
    // console.log('mounted order page', this.curTabPagesNameList);
    this.$store.commit('orderModule/setSelectTime', ['TodayDate', 1]);
    this.$store.commit('orderModule/clearConfigObj');
    this.getOrderTableData();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
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
