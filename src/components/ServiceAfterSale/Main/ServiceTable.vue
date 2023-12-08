<template>
  <el-table
    class="mp-service-page-main-table"
    :max-height="h"  :height="h"
    fit
    :data="tableData"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column prop="AfterSaleCode" minWidth="72" label="售后单号"></el-table-column>
    <el-table-column prop="OrderID" minWidth="80" label="订单号"></el-table-column>
    <el-table-column prop="CustomerNo" minWidth="90" label="客户编号"></el-table-column>
    <el-table-column show-overflow-tooltip prop="CustomerName" minWidth="80" label="客户">
    </el-table-column>
    <el-table-column show-overflow-tooltip
      prop="Order.Content" class-name='is-gray' minWidth="110" label="文件内容">
      <template slot-scope="scope">{{scope.row.Content }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="ProductName"
      minWidth="108" label="产品名称"></el-table-column>
    <el-table-column minWidth="85" label="金额">
      <template slot-scope="scope">
        {{scope.row.FinalPrice}}元
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip minWidth="70" label="售后类型">
      <template slot-scope="scope">
        <template v-for="(item,i) in scope.row.SolutionTypes" >
          <span :key="i">
            <span v-if="i>0">、</span>
            <span v-if="item === 2">退款</span>
            <span v-else-if="item === 7">补印</span>
            <span v-else-if="item === 8">赠送优惠券</span>
            <span v-else-if="item === 255">其他</span>
          </span>
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="ReprintOrderID" minWidth="80" label="补印单号">
      <template slot-scope="scope">
        {{scope.row.ReprintOrderID || "--"}}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip minWidth="72" label="订单退款">
      <template slot-scope="scope">
        {{scope.row.RefundAmount  === null ? '--' : scope.row.RefundAmount + '元'}}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip minWidth="70" label="运费退款">
      <template slot-scope="scope" >
        {{scope.row.RefundFreightAmount === null ? '--' : scope.row.RefundFreightAmount + '元'}}
      </template>
    </el-table-column>
    <el-table-column minWidth="100" label="优惠券">
      <template slot-scope="scope" >
        <span v-if="scope.row.CouponList && scope.row.CouponList.length">
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              <p v-for="(it,i) in scope.row.CouponList" :key="i" >
                  <!-- <span class="is-pink">{{it.Amount}}</span>元
                  满<span class="MinPayAmount">{{it.MinPayAmount}}</span>元使用
                  （ <i class="is-origin">{{it.Number}}</i>张 ） -->
                  满{{it.MinPayAmount}}减{{it.Amount}}券{{it.Number}}张、
              </p>
            </div>
            <p class="CouponList">
              <span v-for="(it,i) in scope.row.CouponList" :key="i">
                满{{it.MinPayAmount}}减{{it.Amount}}券{{it.Number}}张、
                <!-- {{it.Amount}}元-满{{it.MinPayAmount}}元使用-（ <i class="is-origin">{{it.Number}}</i>张 ）、 -->
              </span>
            </p>
          </el-tooltip>
        </span>
        <span v-else>--</span>
      </template>
    </el-table-column>
    <el-table-column class-name='lossfund' prop="LossAmount" minWidth="72" label="损失金额" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.LossAmount === null ? '--' : scope.row.LossAmount + '元'}}
      </template>
    </el-table-column>
    <el-table-column class-name='sm-font' show-overflow-tooltip minWidth="132" label="销售区域">
      <template slot-scope="scope">
        {{scope.row.SellArea}}
      </template>
    </el-table-column>
    <el-table-column class-name='sm-font' prop="CustomerName" minWidth="75" label="下单方式">
      <template slot-scope="scope">
        <span v-if="scope.row.Terminal === 0">客户端</span>
        <span v-if="scope.row.Terminal === 1">网页版</span>
        <span v-if="scope.row.Terminal === 2">手机端</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip
      class-name='sm-font' prop="CustomerName" minWidth="75" label="下单人"></el-table-column>
    <el-table-column class-name='sm-font is-gray' minWidth="115" label="处理时间">
      <template slot-scope="scope" v-if="scope.row.OperateTime">
        {{scope.row.OperateTime | formatDate}}
      </template>
      <span v-else>--</span>
    </el-table-column>
    <el-table-column prop="OperaterUserName" minWidth="75" label="处理人">
      <template slot-scope="scope">
        {{scope.row.OperaterUserName}}
      </template>
    </el-table-column>
    <el-table-column prop="OperaterUserName" minWidth="75" label="评价星级">
      <template slot-scope="scope">
        {{scope.row.Score ? `${scope.row.Score}星` : '--'}}
      </template>
    </el-table-column>
    <el-table-column prop="OperaterUserName" minWidth="75" label="复核状态" fixed="right">
      <template slot-scope="scope">
        {{scope.row.LossConfirmStatus ? `已确认` : '未确认'}}
      </template>
    </el-table-column>
    <el-table-column label-class-name='menu-header' prop="handle" width="260" label="操作" fixed="right">
      <div class="handle-menus-wrap"  slot-scope="scope">
        <span @click="jump2ServiceDetail(scope.row)">
          <img src="@/assets/images/detail.png" alt />查看详情
        </span>
        <template v-if="localPermission.UpdateQuestion">
          <span v-if="scope.row.AfterSaleStatus === 30" @click="onChangeQuestionClick(scope.row)">
            <img src="@/assets/images/Compile.png" alt />问题修改
          </span>
          <span v-else class="not-allowed">
            <img src="@/assets/images/Compile-disabled.png" alt />问题修改
          </span>
        </template>
        <span v-if="scope.row.IsEvaluate" @click="onSeeEstimateClick(scope.row)">
          <img src="@/assets/images/seeEvaluation.png" alt />查看评价
        </span>
        <span v-else class="not-allowed">
          <img src="@/assets/images/seeEvaluation-disabled.png" alt />查看评价
        </span>
        <!-- <template v-if="localPermission.LossConfirm">
          <span v-if="scope.row.AfterSaleStatus === 30" @click="onLossAssessmentClick(scope.row)">
            <i class="iconfont icon-dingsunqueren"></i> {{scope.row.LossConfirmStatus ? `复核查看` : '复核确认'}}
          </span>
          <span v-else class="not-allowed">
            <i class="iconfont icon-dingsunqueren"></i> {{scope.row.LossConfirmStatus ? `复核查看` : '复核确认'}}
          </span>
        </template> -->
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
    // IsOperaterQuestion() { // 非本人订单不能修改
    //   const staffDetailData = JSON.parse(localStorage.getItem('staffDetailData'));
    //   return (ID) => staffDetailData.StaffID === ID;
    // },
  },
  methods: {
    ...mapMutations('service', ['setIsShowServiceDetailOpen', 'setIsShowServiceDetailClose']),
    ...mapMutations('orderModule', ['setCurOrderID']),
    ...mapMutations('common', ['setIsLoading']),
    ...mapActions('orderModule', ['getOrderDetail']),
    // ...mapActions('service', ['getServiceDetail']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-service-page-header', 57);
      this.h = tempHeight;
    },
    async jump2ServiceDetail(itemData) {
      this.$router.push({ name: 'ServiceInfo', params: { paramsData: itemData } });
    },
    onChangeQuestionClick(data) {
      this.$emit('changeQuestion', data);
    },
    onSeeEstimateClick(data) { // 查看评价
      this.$emit('seeEstimate', data);
    },
    onLossAssessmentClick(data) { // 查看评价
      this.$emit('LossAssessment', data);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-service-page-main-table {
    border-color: #e5e5e5;
    border-bottom: 1px solid #e5e5e5 !important;
    &.el-table::before{
      display: none;
    }
    .CouponList{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-table{
      .el-table__fixed-right{
        tr:first-child{
          line-height: 36px;
          font-size: 14px;
        }
      }
    }
      .el-table__header-wrapper,.el-table__fixed-header-wrapper{
      .el-table__header{
        tr {
          th{
            .cell{
                font-size: 14px;
                color: $--color-text-primary;
                padding: 6px 2px !important;
            }
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
    .el-table__fixed-body-wrapper{
      .el-table__body{
        tr {
          td{
            .cell{
              padding:0 5px;
              line-height: 23px;
            }
          }
        }
      }
    }
    .el-table__fixed-header-wrapper{
      .el-table__header{
        tr {
          th{
            .cell{
              padding: 6px 2px !important;
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
      i{
        font-size: 12px;
        color: #06b3f9;
      }
      &:before,
        &:after {
          content: '';
          display: block;
        }
      > span {
        color: $--color-text-table-time;
        font-size: 12px;
        margin: 0 2px;
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
      .not-allowed:hover{
        cursor:not-allowed;
        color: #989898;
      }
    }
}
</style>
