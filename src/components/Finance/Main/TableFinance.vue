<template>
  <el-table
    ref="multipleTable"
    class="mp-finance-page-main-table"
    :max-height="h"  :height="h"
    fit
    :data="PackageList"
    stripe
    border
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" :selectable="(row)=>!row.HaveWriteOff"
      class-name='select-column'  width="43"></el-table-column>
    <el-table-column min-width="112px" sortable prop="PackageID" label="包裹号"></el-table-column>
    <el-table-column min-width="120px" prop="Waybill" label="运单号"></el-table-column>
    <el-table-column min-width="85px" prop="OrderID" label="订单号"></el-table-column>
    <el-table-column
      min-width="90px" prop="CustomerSN" label="客户编号"></el-table-column>
    <el-table-column
     show-overflow-tooltip min-width="106px" prop="CustomerName" label="客户"></el-table-column>
    <el-table-column show-overflow-tooltip min-width="125px"
      class-name="is-font-size-14" prop="ProductName" label="产品名称">
    </el-table-column>
    <el-table-column min-width="60px" class-name="is-font-size-14" label="数量">
      <template slot-scope="scope">{{scope.row.Number}}{{scope.row.Unit}}</template>
    </el-table-column>

    <el-table-column min-width="71px" class-name="is-font-size-14" label="金额">
      <template slot-scope="scope">{{scope.row.TotalAmount}}元</template>
    </el-table-column>
    <el-table-column min-width="71px" class-name="is-font-size-14" label="预付">
      <template slot-scope="scope">{{scope.row.PaidAmount}}元</template>
    </el-table-column>
    <el-table-column min-width="71px" class-name="is-font-size-14" label="应收">
      <template slot-scope="scope">
        <span
         :class="scope.row.ReceiveAmount===0?'':'is-red'"
        >{{scope.row.ReceiveAmount}}元</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip
      min-width="90px" class-name="is-font-size-14" prop="ExpressText" label="配送方式">
    </el-table-column>
    <el-table-column min-width="125px" prop="StationName" show-overflow-tooltip label="区域编号"></el-table-column>
    <el-table-column min-width="123px" class-name='is-gray' label="入库时间">
      <template slot-scope="scope">
        {{ scope.row.OutstoreTime | formatDate }}
      </template>
    </el-table-column>
    <el-table-column min-width="122px" class-name='is-gray' label="签收时间">
      <template slot-scope="scope">
        {{ scope.row.ReceiveTime | formatDate }}
      </template>
    </el-table-column>
    <el-table-column min-width="65px" class-name="is-font-size-14" prop="Status" label="状态">
      <template slot-scope="scope">
        <span
         :class="scope.row.Status==='已完成'?'is-success':''"
        >{{scope.row.Status}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="70px" class-name="is-font-size-14 writeoff" label="销账状态">
      <template slot-scope="scope">
        <span
         :class="scope.row.HaveWriteOff?'is-gray':'is-red'"
         >{{scope.row.HaveWriteOff ? '已销账':'未销账'}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="75px" prop="WriteOffOperator" label="销账人" show-overflow-tooltip></el-table-column>
    <el-table-column width="90px" class-name="is-font-size-14" label="操作">
      <template slot-scope="scope">
        <div class="menu-box" style="padding-right: 8px">
            <span @click="onSingleWriteClick(scope.row)"
             v-if="!scope.row.HaveWriteOff && localPermission.WriteOff" class="normal">
              <img src="@/assets/images/write.png" alt="">
              <i>销账</i>
            </span>
            <span v-else-if="localPermission.WriteOff" class="disabled">
              <img src="@/assets/images/write.png" alt="">
              <i>销账</i>
            </span>
        </div>
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!financeDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  computed: {
    ...mapState('finance', ['financeDataLoading', 'PackageList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionFinance?.Obj) {
        return this.Permission.PermissionList.PermissionFinance.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapMutations('finance', ['setWill2WriteCheckedList']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-finance-page-header', 127);
      this.h = tempHeight;
    },
    handleSelectionChange(list) {
      this.setWill2WriteCheckedList(list);
    },
    async handleSingleWrite(id) {
      if (!id) return;
      this.$store.dispatch('finance/setWriteOffChecked', id);
    },
    onSingleWriteClick(item) {
      let msg = item.Status === '已完成' ? '' : '该包裹 [ 未签收 ]';
      if (item.UnpaidAmount > 0) msg = '该包裹 [ 未结清 ]';
      if (msg) this.messageBox.warnCancelBox('确定对该包裹进行销账吗 ?', msg, () => this.handleSingleWrite(item.PackageID), null);
      else this.messageBox.warnCancelNullMsg('确定对该包裹进行销账吗 ?', () => this.handleSingleWrite(item.PackageID), null);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-finance-page-main-table {
    border: none;
    border-top: 1px solid $--border-color-base;
    &.el-table::before{
      display: none;
    }
    .el-table__header-wrapper .el-table__header thead{
      tr {
        th {
          font-size: 14px;
          .cell{
            height: 34px;
            line-height: 34px;
            color: $--color-text-primary;
          }
        }
      }
    }
   .el-table__body-wrapper .el-table__body tbody tr td  {
     color: $--color-text-primary;
     &.writeoff {
      //  padding-right: 10px;
       box-sizing: border-box;
     }
     > .cell {
        .el-checkbox.is-checked {
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #fff;
            border-color: #26bcf9;
            &::after{
              border-color: #26bcf9;
            }
          }
        }
        .menu-box {
          display: flex;
          justify-content: center;
          > span {
            display: flex;
            align-items: center;
            > img {
              margin-right: 4px;
            }
            &.normal {
              color: #a2a2a2;
              cursor: pointer;
              &:hover {
                color: #444;
              }
            }
            &.disabled {
              user-select: none;
              color: #cbcbcb;
              pointer-events: none;
              > img {
                opacity: 0.45;
                filter: gray;
                filter: grayscale(88%);
              }
            }
          }
        }
     }
   }
}
</style>
