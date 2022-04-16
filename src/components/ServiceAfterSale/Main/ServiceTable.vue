<template>
  <el-table
    class="mp-service-page-main-table"
    :max-height="h"  :height="h"
    fit
    :data="list"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column prop="ID" minWidth="72" label="售后单号"></el-table-column>
    <el-table-column prop="Order.OrderID" minWidth="80" label="订单号"></el-table-column>
    <el-table-column prop="Order.CustomerNo" minWidth="90" label="客户编号"></el-table-column>
    <el-table-column show-overflow-tooltip prop="Order.CustomerName" minWidth="122" label="客户">
    </el-table-column>
    <el-table-column show-overflow-tooltip
      prop="Order.Content" class-name='is-gray' minWidth="110" label="文件内容">
      <template slot-scope="scope">{{scope.row.Order}}
        <!-- {{scope.row.Order && scope.row.Order.Content ? scope.row.Order.Content : '无'}} -->
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="Order.ProductName"
      minWidth="108" label="产品名称"></el-table-column>
    <el-table-column minWidth="85" label="金额">
      <template slot-scope="scope">
        {{scope.row.Order}}元
        <!-- {{scope.row.Order.Funds.FinalPrice}}元 -->
      </template>
    </el-table-column>
    <el-table-column minWidth="70" label="售后类型">
      <template slot-scope="scope">
        <!-- {{getServiceTypeText(scope)}} -->
        {{scope.row}}
      </template>
    </el-table-column>
    <el-table-column prop="RePrintOrderID" minWidth="80" label="补印单号"></el-table-column>
    <el-table-column minWidth="72" label="订单减款">
      <template slot-scope="scope">
        {{scope.row.Solution}}元
      </template>
      <!-- <template slot-scope="scope"  v-if="scope.row.Solution.Refund > 0">
        {{scope.row.Solution.Refund}}元
      </template> -->
    </el-table-column>
    <el-table-column minWidth="70" label="运费减款">
      <template slot-scope="scope" >
        {{scope.row.Solution}}元
      </template>
      <!-- <template slot-scope="scope"  v-if="scope.row.Solution.RefundFreight > 0">
        {{scope.row.Solution.RefundFreight}}元
      </template> -->
    </el-table-column>
    <el-table-column minWidth="100" label="优惠券" show-overflow-tooltip>
      <template slot-scope="scope" >
        {{scope.row.Solution}}
      </template>
      <!-- <template slot-scope="scope"  v-if="scope.row.Solution.CouponList">
        {{scope.row.Solution | getCouponList}}
      </template> -->
    </el-table-column>
    <el-table-column class-name='lossfund' prop="LossAmount" minWidth="72" label="损失金额" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.LossAmount}}元
      </template>
    </el-table-column>
    <el-table-column class-name='sm-font' show-overflow-tooltip minWidth="132" label="销售区域">
      <template slot-scope="scope">
        {{scope.row.Order}}
        <!-- {{scope.row.Order.SellArea}} -->
      </template>
    </el-table-column>
    <el-table-column
      class-name='sm-font' prop="Order.Taker" minWidth="75" label="下单人"></el-table-column>
    <el-table-column class-name='sm-font is-gray' minWidth="115" label="处理时间">
      <template slot-scope="scope">
        <!-- {{$utils.getDateFormat(scope.row.CreateTime)}} -->
        {{scope.row.CreateTime | formatDate}}
      </template>
    </el-table-column>
    <el-table-column prop="Operator.Name" minWidth="75" label="处理人"></el-table-column>
    <el-table-column label-class-name='menu-header' prop="handle" width="260" label="操作">
      <div class="handle-menus-wrap"  slot-scope="scope">
        <span @click="jump2ServiceDetail(scope)">
          <img src="@/assets/images/detail.png" alt />查看详情
        </span>
        <span @click="onChangeQuestionClick(scope.row)">
          <img src="@/assets/images/Compile.png" alt />问题修改
        </span>
        <span @click="onSeeEstimateClick(scope.row)">
          <img src="@/assets/images/Compile.png" alt />查看评价
        </span>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-show="!serviceDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  data() {
    return {
      list: [{
      }],
    };
  },
  computed: {
    ...mapState('service', ['canLoadingMore', 'tableData', 'serviceTypeList', 'serviceDataLoading']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageAfterSales?.Obj) {
        return this.Permission.PermissionList.PermissionManageAfterSales.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapMutations('service', ['setIsShowServiceDetailOpen', 'setIsShowServiceDetailClose']),
    ...mapMutations('orderModule', ['setCurOrderID']),
    ...mapMutations('common', ['setIsLoading']),
    ...mapActions('orderModule', ['getOrderDetail']),
    ...mapActions('service', ['getServiceDetail']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-service-page-header', 57);
      this.h = tempHeight;
    },
    // getServiceTypeText({ row }) {
    //   const id = row.Solution.Type;
    //   if (!id) return '';
    //   for (let i = 0; i < this.serviceTypeList.length; i += 1) {
    //     if (this.serviceTypeList[i].ID === id) return this.serviceTypeList[i].Name;
    //   }
    //   return '';
    // },
    async jump2ServiceDetail() {
      console.log(this.$router);
      // this.$router.push('/feedbackInfoPage');
      this.$router.push({ name: 'serviceInfo' });
      // this.setCurOrderID(row.Order.OrderID);
      // let key = true;
      // this.setIsLoading(true);
      // this.setIsShowServiceDetailOpen();
      // await Promise.all([
      //   this.getOrderDetail(), this.getServiceDetail(row.ID), this.$store.dispatch('service/getPayPackageByOrder', row.Order.OrderID),
      // ]).catch((error) => {
      //   key = false;
      //   this.messageBox.handleLoadingError(
      //     error,
      //     () => {
      //       this.setIsLoading(false);
      //       this.setIsShowServiceDetailClose();
      //     },
      //     () => {
      //       this.setIsLoading(false);
      //       this.setIsShowServiceDetailClose();
      //     },
      //   );
      // });
      // if (key) this.setIsLoading(false);
    },
    onChangeQuestionClick(data) {
      this.$emit('changeQuestion', data);
    },
    onSeeEstimateClick(data) { // 查看评价
      this.$emit('seeEstimate', data);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-service-page-main-table {
    border-color: #e5e5e5;
    border-bottom: 1px solid #e5e5e5 !important;
    &.el-table::before{
      display: none;
    }
    .el-table__header-wrapper{
        .el-table__header{
            tr {
                th{
                    .cell{
                        font-size: 14px;
                        color: $--color-text-primary;
                        padding: 6px 2px !important;
                    }
                    // &.menu-header{
                    //     // padding-right: 55px;
                    // }
                }
            }
        }
    }
    .el-table__body-wrapper{
        .el-table__body{
            tr {
                td{
                    .cell{
                        // font-size: 14px;
                        color: $--color-text-regular;
                        padding:0 5px;
                        line-height: 23px;
                        font-size: 12px;
                    }
                    &.sm-font .cell{
                        font-size: 12px;
                    }
                    &.lossfund .cell{
                        color: $--color-text-table-pending;
                    }
                    &.is-gray .cell{
                        color: $--color-text-table-time;
                    }
                }
            }
        }
    }
    .handle-menus-wrap{
      // width: 105px;
      // margin-right: 55px;
      // margin-left: 50px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      &:before,
        &:after {
          content: '';
          display: block;
        }
      > span {
        color: $--color-text-table-time;
        font-size: 12px;
        margin: 0 8px;
        > img {
          vertical-align: middle;
          width: 14px;
          height: 14px;
          margin-right: 4px;
          margin-top: -1px;
        }
        &:hover {
          color: $--color-text-primary;
        }
      }
    }
}
</style>
