<template>
  <el-table
    :max-height="h" :height="h" :data="tableData" stripe class="mp-payment-module-table"
    :cell-class-name="initStyle" border>
    <el-table-column prop="PayCode" label="付款单号" minWidth="130"></el-table-column>
    <el-table-column prop="Customer.SN" label="客户编号" minWidth="90"></el-table-column>
    <el-table-column
     show-overflow-tooltip prop="Customer.Name" label="客户" minWidth="140"></el-table-column>
     <el-table-column
     show-overflow-tooltip prop="Customer.Type.Second" label="客户类型" minWidth="80"></el-table-column>
     <el-table-column
     show-overflow-tooltip prop="Customer.Grade.Second" label="客户等级" minWidth="80"></el-table-column>
    <el-table-column
      class-name='md-font-item' prop="OrderCount" label="订单数量" minWidth="75"></el-table-column>
    <el-table-column class-name='md-font-item' label="总金额(含运费)" minWidth="109">
      <template slot-scope="scope">
        {{scope.row.FullPayout}}元
      </template>
    </el-table-column>
    <el-table-column class-name='md-font-item' label="运费" minWidth="60">
      <template slot-scope="scope">
        {{scope.row.Freight}}元
      </template>
    </el-table-column>
    <el-table-column class-name='md-font-item' label="使用余额" minWidth="87">
      <template slot-scope="scope">
        {{scope.row.BalanceAmount}}元
      </template>
    </el-table-column>
    <el-table-column class-name='md-font-item' label="使用印豆" minWidth="87">
      <template slot-scope="scope">
        {{scope.row.PaidBeanNumber}}个
      </template>
    </el-table-column>
    <el-table-column class-name='md-font-item' label="在线支付" minWidth="92">
      <template slot-scope="scope">
        {{scope.row.PayOnlineAmount}}元
      </template>
    </el-table-column>
    <el-table-column class-name='md-font-item' label="状态" minWidth="63">
      <template slot-scope="scope">
        {{$utils.getPaymentStatus(scope.row.Status, PayStatusList)}}
      </template>
    </el-table-column>
    <!-- <el-table-column prop="Payment" class-name='md-font-item' label="支付方式" minWidth="100">
      <template slot-scope="scope">
        {{getPayType(scope.row.Payment)}}
      </template>
    </el-table-column> -->
    <el-table-column class-name='md-font-item' prop="OrderCreateType" label="下单方式" minWidth="70">
      <template slot-scope="scope">
        {{getOrderType(scope.row.OrderType)}}
      </template>
    </el-table-column>
    <el-table-column prop="OrderTaker.Value" label="创建人" minWidth="80" show-overflow-tooltip></el-table-column>
    <el-table-column
      prop="OrderCreateTime" class-name='time-item' label="创建时间" minWidth="125"></el-table-column>
    <el-table-column
      prop="OrderFinishTime" class-name='time-item' label="支付时间" minWidth="125"></el-table-column>
    <el-table-column  width="215" label="操作">
      <ul class="payment-table-handle-menu-wrap" slot-scope="scope">
        <li class="handle-menu-item">
          <span @click="onMenuClick(scope.row, 0)">
            <img src="@/assets/images/detail.png" class="detail" alt="">详情</span>
        </li>
        <li
          v-if="localPermission.Pay"
          class="handle-menu-item"
        >
          <span
            v-if="scope.row.Status !== 2 && scope.row.Status !== 255
             && curTime < new Date(scope.row.ValidTime).getTime()"
            @click="onMenuClick(scope.row, 1)">
            <img src="@/assets/images/pay.png" alt="">付款
          </span>
          <span v-else class="is-cancel"><img src="@/assets/images/unpay.png" alt="">付款</span>
        </li>
        <li class="handle-menu-item" v-if="localPermission.Pay">
          <span
            v-if="scope.row.Status !== 255 && scope.row.Status !== 2"
            @click="onMenuClick(scope.row, 2)">
            <img src="@/assets/images/cancel.png" alt="">取消
          </span>
          <span v-else class="is-cancel"><img src="@/assets/images/cancelstop.png" alt="">取消</span>
        </li>
        <!-- <li class="handle-menu-item" style="width: 80px;">
          <div v-show="scope.row.Status === 255" >
            <span @click="onMenuClick(scope.row, 3)"
             v-if="!scope.row.HaveBackOrderPrepare && makeTrue(scope.row.CreateTime)">
              <img src="@/assets/images/pending.png" alt="">加入待下单
            </span>
            <span v-if="scope.row.HaveBackOrderPrepare">已加入待下单</span>
          </div>
        </li> -->
      </ul>
    </el-table-column>
    <div slot="empty">
      <span v-show="!paymentDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
/* eslint-disable max-len */
import { mapState, mapMutations, mapActions } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
// import { getPaymentStatus } from '@/assets/js/util';

export default {
  mixins: [tableMixin],
  computed: {
    ...mapState('paymentModule', ['tableData', 'PayDetailOrderList', 'PayDetailData', 'orderCreateTypeList', 'canLoadingMore', 'paymentDataLoading']),
    ...mapState('common', ['PayTypeList', 'PayStatusList', 'Permission', 'curTime']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionPayment?.Obj) {
        return this.Permission.PermissionList.PermissionPayment.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapMutations('paymentModule', ['setID2Del', 'setIsShow2PayDialog', 'setIsShow2DetailDialog', 'setPayAmount', 'setPayImgSrc', 'setPayDetailData', 'setCurPayCode']),
    ...mapMutations('common', ['setPayOrderCreateTime', 'setValidTime', 'setIsLoading']),
    ...mapActions('paymentModule', ['getPaymentListTableData', 'cancelPaymentOrder', 'transferToPrepareOrder', 'getPaymentOrderDetail', 'getPaymentOrderDetailByPayCode']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-payment-list-header', 60);
      this.h = tempHeight;
    },
    initStyle(rowData) {
      if (rowData.columnIndex === 11) {
        const data = rowData.row;
        if (data.Status === 255) return 'canc-gray';
        if (data.Status === 1) return 'pend-red';
        if (data.Status === 2) return 'paid-green';
      }
      return '';
    },
    onMenuClick(row, code) { // 按钮区操作
      if (code === 2) { // 取消  ok
        this.cancelOrder(row);
      } else if (code === 3) { // 加入待下单
        this.moveOrder2PendingList(row);
      } else if (code === 0) { // 详情
        this.go2OrderDetail(row);
      } else { // 付款 - 打开付款页面
        this.go2PayOrder(row);
      }
    },
    makeTrue(time) {
      const createTimeStamp = this.$utils.getTimeStamp(time);
      const curTimeStamp = new Date(new Date().getTime()).setHours(0, 0, 0, 0); // 当天0点
      if (createTimeStamp > curTimeStamp) return true;
      return false;
    },
    getPayFundInfo(row) {
      const { Name } = row.Customer;
      const {
        PayQRCode, PayOnlineAmount, BalanceAmount, PaidBeanNumber, PayOnDelivery, FullPayout, // 应付、余额、货到付款、总金额
      } = row;
      this.setPayAmount({
        PayOnlineAmount, BalanceAmount, PaidBeanNumber, PayOnDelivery, FullPayout, Name,
      });
      this.setPayImgSrc(PayQRCode);
    },
    async go2OrderDetail(row) { // 操作付款单详情  this.getPaymentOrderDetail(row.PayCode)
      this.setCurPayCode(row.PayCode);
      let key = true;
      this.setIsLoading(true);
      this.setIsShow2DetailDialog(true);
      await Promise.all([this.getPaymentOrderDetailByPayCode(row.PayCode)])
        .catch((error) => {
          key = false;
          this.messageBox.handleLoadingError(
            error,
            () => {
              this.setIsLoading(false);
              this.setIsShow2DetailDialog(false);
            },
            () => {
              this.setIsLoading(false);
              this.setIsShow2DetailDialog(false);
            },
          );
        }); // 根据付款单号获取订单列表 /Api/PaymentOrder/OrderList
      if (key) this.setIsLoading(false);
      this.setPayDetailData(row);
      this.setValidTime(row.ValidTime);
      //  console.log(this.PayDetailOrderList, 'PayDetailOrderList');
      //  console.log(this.PayDetailData, 'PayDetailData');
      this.setPayOrderCreateTime(this.PayDetailData.CreateTime);
    },
    go2PayOrder(row) { // 操作付款
      this.setCurPayCode(row.PayCode);
      this.getPayFundInfo(row);
      this.setValidTime(row.ValidTime);
      this.setIsShow2PayDialog(true);
    },
    cancelOrder(row) { // 取消付款单弹窗
      this.setID2Del(row.PayCode); // 数据可以移入到then中，此步可以取消
      this.messageBox.warnCancelBox('确定取消此付款单吗 ?', `客户名称：${row.Customer.Name}`, () => this.delTargetOrder(row.PayCode));
    },
    delTargetOrder(PayCode) { // 确定取消付款单
      this.cancelPaymentOrder(PayCode);
    },
    moveOrder2PendingList(row) { // 是否移入待下单弹窗提示
      // this.setID2Del(row.PayCode); // 数据可以移入到then中，此步可以取消
      this.messageBox.warnCancelBox('确定将此单加入待下单吗 ?', `客户名称：${row.Customer.Name}`, () => this.moving(row));
    },
    moving(row) { // 进行移入待下单操作
      this.transferToPrepareOrder(row.PayCode);
    },
    getPayType(payment) { // 转换支付方式
      const list = this.PayTypeList;
      for (let i = 0, len = list.length; i < len; i += 1) {
        if (+payment === list[i].ID) return list[i].name;
      }
      return '';
    },
    getOrderType(orderType) { // 获取下单方式
      if (!orderType) return '';
      for (let i = 0; i < this.orderCreateTypeList.length; i += 1) {
        // console.log(this.orderCreateTypeList[i]);
        if (this.orderCreateTypeList[i].ID === orderType) return this.orderCreateTypeList[i].name;
      }
      return '';
    },
  },
  mounted() {
    // this.$store.commit('paymentModule/clearConfigObj');
    // this.getPaymentListTableData();
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-payment-module-table {
  width: 100%;
  // user-select: none;
  border: none;
  .el-table__header-wrapper{
    thead {
      tr {
        th {
          text-align: center;
          color: $--color-text-regular;
          font-weight: 600;
          padding: 8px 0;
          background-color: $--bg-color-base;
          border-right: none;
          font-size: 14px;
        }
      }
    }
  }
  .el-table__body-wrapper{
    font-size: 12px;
    width: 100%;
    color: $--color-text-regular;
    .el-table__body{
      tbody{
        tr{
          td{
            padding: 8px 0;
            text-align: center;
            border: none;
            > .cell{
              line-height: 24px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              word-break: keep-all !important;
              padding: 0px 5px;
            }
            &.time-item{
              color: $--color-text-table-time;
            }
            &.md-font-item{
              font-size: 14px;
            }
            //下面3种颜色用于付款状态栏的显示
            &.pend-red{
              color: $--color-text-table-pending;
            }
            &.canc-gray{
              color: $--color-text-table-cancel;
            }
            &.paid-green{
              color: $--color-text-table-completed;
            }
          }
          &:hover {
              td {
                background-color: $--color-text-table-hover
              }
            }
        }
      }
    }
  }
  .payment-table-handle-menu-wrap {
    display: flex;
    // padding: 0 35px 0 50px;
    padding: 0 12px;
    justify-content: space-between;
    &:before,
    &:after {
      content: '';
      display: block;
    }
    user-select: none;
    color: $--color-text-table-time;
    .handle-menu-item {
      cursor: pointer;
      padding: 0 6px;
      span {
        img{
          margin-right: 5px;
          position: relative;
          top: 3px;
          &.detail{
            width: 15px;
            height: 15px;
          }
        }
      }
      &:hover{
        color: $--color-text-regular;
      }
    }
  }
  &.el-table::before{
    display: none;
  }
  .is-cancel{
    cursor: not-allowed;
  }
}
</style>
