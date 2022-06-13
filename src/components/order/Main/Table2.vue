<template>
  <el-table
    class="mp-table-wrap"
    :max-height="h" :height="h"
    border
    fit
    ref="oElTable"
    :data="orderListData"
    @header-dragend='onHeaderDragend'
    stripe
    :key="tableKey"
    style="width: 100%"
  >
    <el-table-column width="115px" prop="OrderID" label="订单编号" fixed="left">
      <span
        slot-scope="scope"
       >{{ scope.row.OrderID }}</span>
    </el-table-column>
    <TableColumnItem v-for="colItem in tableColData.filter(it => it.show)" :key="colItem.label" :colItem='colItem' />
    <el-table-column width="260px" prop="handle" label="操作" fixed="right">
      <template slot="header">
        <TableInfoDefindHeaderColumnScope @onClick="onInfoClick" />
      </template>
      <ul class="handle-menus" slot-scope="scope">
        <li>
          <span @click="onMenuClick(scope.row, 1)">
            <img src="@/assets/images/detail.png" alt />
          进度/详情/包裹</span>
        </li>
        <li v-if="localPermission.ApplyAfterSales">
          <span  @click="ServiceAfterSalesClick(scope.row)" v-if="scope.row.AllowAfterSale">
            <img src="@/assets/images/service.png" alt />售后
          </span>
          <!-- <span  @click="jump2Service(scope.row)" v-if="scope.row.AllowAfterSales">
            <img src="@/assets/images/service.png" alt />售后a
          </span> -->
          <span v-else class="disbaled">
            <img src="@/assets/images/servicestop.png" alt />售后
          </span>
        </li>
        <li v-if="localPermission.CancleOrder">
          <span
            v-if="[20, 30, 35, 40].includes(scope.row.Status)"
            @click="onOrderDel(scope.row, scope.$index)">
            <img src="@/assets/images/cancel.png" alt />取消
          </span>
          <span v-else class="disbaled">
            <img src="@/assets/images/cancelstop.png" alt />取消
          </span>
        </li>
      </ul>
    </el-table-column>
    <div slot="empty">
      <span v-show="!orderDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import {
  mapState, mapMutations, mapActions,
} from 'vuex';
import TableColumnItem from '@/components/common/Table/TableColumnItem.vue';
import TableInfoDefindHeaderColumnScope from '@/components/common/Table/TableInfoDefindHeaderColumnScope.vue';
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { formatListItemSize, formatListItemCraft } from '@/assets/js/filters/filters';
import { formarProductAmountFunc } from '@/packages/commonFilters';

export default {
  computed: {
    ...mapState('orderModule', ['orderListData', 'OrderStatusList', 'expressArr', 'areaList', 'orderTotalCount', 'orderListCanLoadMore', 'orderDataLoading']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageOrder?.Obj) {
        return this.Permission.PermissionList.PermissionManageOrder.Obj;
      }
      return {};
    },
  },
  components: {
    TableColumnItem,
    TableInfoDefindHeaderColumnScope,
  },
  mixins: [mixin, tableMixin],
  methods: {
    // eslint-disable-next-line max-len
    ...mapMutations('orderModule', ['setOrderListDialogShow', 'setOrderListDialogHide', 'setCurOrderStatus', 'setCurOrderProductName', 'setIsDelPopShowTrue', 'setOrderID2Del', 'setOrderListData', 'setOrderTotalCount', 'setCurOrderID', 'setIsShowServiceDiaTrue', 'setIsShowServiceDiaFail']),
    ...mapMutations('service', ['clearServiceFormInfo']),
    ...mapMutations('common', ['setIsLoading']),
    ...mapActions('orderModule', ['delTargetOrder', 'getOrderDetail', 'selectOrderProgress', 'getServiceOrderHistory']),
    ...mapActions('orderModule', { getPackageListByOrderID2OrderModule: 'getPackageListByOrderID' }),
    ...mapActions('service', ['getQuestionTypeList', 'getPackageListByOrderID']),
    setHeight() {
      const tempHeight = this.getHeight('.order-manage-header', 60);
      this.h = tempHeight;
    },
    open(index, OrderID) {
      this.messageBox.warnCancelBox('确定取消此订单吗 ?', `订单号：[ ${OrderID} ]`, () => this.delTargetOrder(index), null);
    },
    ServiceAfterSalesClick(data) {
      this.$emit('ServiceAfterSalesClick', data);
    },
    onOrderDel(data, index) {
      this.setOrderID2Del(data.OrderID);
      this.open(index, data.OrderID);
    },
    setStateStyle(Status) {
      if ((Status === 254 || Status === 255)) return 'is-cancel';
      if (Status === 10) return 'is-pending';
      if (Status === 200) return 'is-completed';
      return '';
    },
    getTimeClass(ProducePeriod, Status) {
      if (!ProducePeriod) return '';
      const { TotalTime, IncludeDiliveryTime } = ProducePeriod;
      const _time = TotalTime;
      if (!_time) return '';
      const endTime = new Date(_time.replace('Z', '')).getTime();
      const now = Date.now();
      if (endTime - now < 0) {
        if (IncludeDiliveryTime && ![200, 254, 255, 35].includes(Status)) return 'is-pink';
        if (!IncludeDiliveryTime && [20, 30, 40, 45, 50, 55].includes(Status)) return 'is-pink';
        return '';
      }
      return '';
    },
  },
  data() {
    return {
      tableColData: [ // 使用对象形式自动启用列拖拽功能 开启该功能还需在el-table中添加 :key="tableKey" 以实现动态渲染
        {
          label: '电商单号',
          prop: 'OutPlate',
          width: '',
          minWidth: '88px',
          sortable: false,
          showOverflowTooltip: true,
          scope: null,
          show: true,
        },
        {
          label: '客户编号',
          prop: 'CustomerNo',
          minWidth: '90px',
          sortable: true,
          show: true,
        },
        {
          label: '客户',
          prop: 'CustomerName',
          minWidth: '125px',
          showOverflowTooltip: true,
          show: true,
        },
        {
          label: '产品名称',
          minWidth: '125px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.ProductName}</span>,
          show: true,
        },
        {
          label: '数量',
          minWidth: '68px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{formarProductAmountFunc(scope.row)}</span>,
          show: true,
        },
        {
          label: '工艺',
          minWidth: '82px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{formatListItemCraft(scope.row.CraftList)}</span>,
          show: true,
        },
        {
          label: '尺寸',
          minWidth: '82px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{formatListItemSize(scope.row.SizeList)}</span>,
          show: true,
        },
        {
          label: '文件内容',
          minWidth: '130px',
          showOverflowTooltip: true,
          scope: (scope) => <span class="is-gray">{scope.row.Content}</span>,
          show: true,
        },
        {
          label: '原价',
          minWidth: '68px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.Funds.OriginalPrice}元</span>,
          show: true,
        },
        {
          label: '优惠券',
          minWidth: '68px',
          showOverflowTooltip: true,
          scope: (scope) => <span class={scope.row.Funds.CouponAmount > 0 && 'is-pink'}>{-scope.row.Funds.CouponAmount}元</span>,
          show: true,
        },
        {
          label: '活动',
          minWidth: '68px',
          showOverflowTooltip: true,
          scope: (scope) => (<span class={(scope.row.Funds.DiscountPrice - scope.row.Funds.CouponAmount).toFixed(2) > 0 && 'is-pink'}>
            {-(scope.row.Funds.DiscountPrice - scope.row.Funds.CouponAmount).toFixed(2)}元
          </span>),
          show: true,
        },
        {
          label: '成交价',
          prop: 'Funds.FinalPrice',
          minWidth: '68px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.Funds.FinalPrice}元</span>,
          show: true,
        },
        {
          label: '已付现金',
          prop: 'Funds.PaidCashAmount',
          minWidth: '68px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.Funds.PaidCashAmount}元</span>,
          show: true,
        },
        {
          label: '已付印豆',
          prop: 'Funds.PaidBeanNumber',
          minWidth: '68px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.Funds.PaidBeanNumber}个</span>,
          show: true,
        },
        {
          label: '未付',
          prop: 'Funds.Unpaid',
          minWidth: '68px',
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.Funds.Unpaid}元</span>,
          show: true,
        },
        {
          label: '已退现金',
          prop: 'Funds.RefundCashAmount',
          minWidth: '80px',
          sortable: true,
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.Funds.RefundCashAmount}元</span>,
          show: true,
        },
        {
          label: '已退印豆',
          prop: 'Funds.RefundBeanNumber',
          minWidth: '80px',
          sortable: true,
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.Funds.RefundBeanNumber}个</span>,
          show: true,
        },
        {
          label: '售后优惠',
          prop: 'Funds.Reduced',
          minWidth: '78px',
          sortable: true,
          showOverflowTooltip: true,
          scope: (scope) => <span>{scope.row.Funds.Reduced}元</span>,
          show: true,
        },
        {
          label: '状态',
          minWidth: '76px',
          sortable: true,
          showOverflowTooltip: true,
          scope: (scope) => <span class={this.setStateStyle(scope.row.Status)}>
            { this.$options.filters.formatStatus(scope.row.Status)}
          </span>,
          show: true,
        },
        {
          label: '配送方式',
          prop: 'Express',
          minWidth: '76px',
          show: true,
        },
        {
          label: '预计工期',
          minWidth: '120px',
          showOverflowTooltip: true,
          scope: (scope) => [254, 255].indexOf(scope.row.Status) === -1 && <span class={this.getTimeClass(scope.row.ProducePeriod, scope.row.Status)}>
            { this.$options.filters.formatProducePeriod(scope.row.ProducePeriod)}
          </span>,
          show: true,
        },
        {
          label: '销售区域',
          minWidth: '130px',
          sortable: true,
          showOverflowTooltip: true,
          scope: (scope) => <span class="is-gray">{scope.row.SellArea}</span>,
          show: true,
        },
        {
          label: '接单员',
          prop: 'Taker',
          minWidth: '76px',
          show: true,
        },
        {
          label: '下单时间',
          minWidth: '120px',
          scope: (scope) => <span class="is-gray">
            { this.$options.filters.formatDate(scope.row.CreateTime)}
          </span>,
          show: true,
        },
        {
          label: '付款时间',
          minWidth: '120px',
          scope: (scope) => <span class="is-gray">
            { this.$options.filters.formatDate(scope.row.PayTime)}
          </span>,
          show: true,
        },
        {
          label: '下单渠道',
          minWidth: '76px',
          scope: (scope) => (<span>
            {scope.row.OrderType === 1
              ? this.$options.filters.formatOrderTypeToText(scope.row.OrderType) : this.$options.filters.formatTerminalType(scope.row.Terminal)}
          </span>),
          show: true,
        },
      ],
      tableName: 'orderTable',
    };
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-table-wrap {
  height: 100%;
  border-color: #e5e5e5;
  border-bottom: 1px solid #e5e5e5 !important;
  &.el-table::before{
    display: none;
  }
  &::after {
    display: none;
  }
  > .el-table__header-wrapper {
    .has-gutter > tr > th:not(:last-of-type) {
      background-color: $--bg-color-base;
      color: $--color-text-regular;
      font-weight: 600;
      border: none;
      border-bottom: 1px solid $--border-color-base;
      position: relative;
      &::after{
        content: '';
        width: 1px;
        height: 15px;
        display: inline-block;
        position: absolute;
        right: 0;
        top: 10px;
        background-color: rgba(0,0,0,0.15);
        pointer-events: none;
      }
    }
  }
  .handle-menus {
    display: flex;
    list-style: none;
    justify-content: space-between;
    &:before,
      &:after {
          content: '';
          display: block;
    }
    font-size: 12px;
    color: $--color-text-light;
    padding-left: 9px;
    padding-right: 9px;
    box-sizing: border-box;
    > li {
      text-align: center;
      user-select: none;
      flex: none;
      padding: 0 6px;
      &:hover {
        color: $--color-text-table;
      }
      span{
        cursor: pointer;
        display: inline-block;
      }
      span.disbaled {
        cursor: not-allowed;
        color: $--color-text-secondary;
      }
      img {
        margin-right: 5px;
        position: relative;
        top: 3px;
        // height: 14px;
        width: 15px;
      }
      &:nth-of-type(3) {
        // width: 21%;
        img {
          top: 2px;
          width: 18px;
        }
      }
      &:nth-of-type(2),
      &:nth-of-type(1) {
        // width: 21%;
        img {
          width: 15px;
        }
      }
      &:nth-of-type(1) {
        img {
          top: 4px;
          width: 16px;
        }
      }
      &:nth-of-type(2) {
        img {
          width: 15px;
        }
      }
      &:nth-of-type(4),
      &:nth-of-type(5) {
        // width: 19%;
        img {
          width: 16px;
        }
      }
      &:nth-of-type(5) {
        img {
          width: 15px;
        }
      }
    }
  }
  &.el-table {
    table > thead > tr > th {
      padding: 0;
      .cell {
        line-height: 35px;
        height: 35px;
        font-size: 14px;
        > span{
          width: 5px;
          height: 30px;
          margin-right: 10px;
          margin-left: -4px;
        }
      }
    }
    td,
    th {
      padding: 6px 0;
      font-size: 12px;
      color: $--color-text-table;
      .is-sm-font {
        // font-size: 12px;
        color: $--color-text-table-time;
      }
      .is-lg-font {
        font-size: 14px;
      }
      .is-cancel {
        color: $--color-text-table-cancel;
      }
      .is-pending {
        color: $--color-text-table-pending;
      }
      .is-completed {
        color: $--color-text-table-completed;
      }
      .cell {
        overflow: hidden;
        // text-overflow: ellipsis;
        white-space: nowrap;
        word-break: keep-all !important;
        line-height: 24px;
        padding-left: 1px;
        padding-right: 1px;
        text-align: center;
        // cursor: pointer;

        // &:hover {
        //   color: $--color-text-table-hover;
        // }
      }
    }
    tr {
      td {
        border: none;
      }
      &:hover {
        td {
          background-color: $--color-text-table-hover
        }
      }
      // &.el-table__row--striped:hover {
      //   td {
      //     background-color: $--bg-color-base !important;
      //   }
      // }
    }
    .ascending .sort-caret{
      &.ascending{
        border-bottom-color: $--color-primary;
      }
    }
    .sort-caret{
      border-width: 4px !important;
    }
  }
  .el-table__fixed::before, .el-table__fixed-right::before {
    display: none;
  }
}
</style>
