<template>
  <el-table
    class="mp-fund-bill-page-main-balace-table"
    :max-height="h"
    :height="h"
    :data="balanceTypeDataList"
    border
    stripe
    fit
    style="width: 100%"
  >
    <el-table-column prop="ThirdTradeCode" label="交易单号" width="150" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="OutTradeCode" label="微信/支付宝号" width="230" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="Customer.CustomerSN" label="客户编号" width="90"></el-table-column>
    <el-table-column prop="Customer.CustomerName" label="客户" width="140" show-overflow-tooltip>
    </el-table-column>
    <el-table-column
     show-overflow-tooltip prop="Customer.Type.Second" label="客户类型" width="76"></el-table-column>
     <el-table-column
     show-overflow-tooltip prop="Customer.Grade.Second" label="客户等级" width="76"></el-table-column>
    <el-table-column label="类型" width="65">
     <span
      slot-scope="scope"
      :class="{ 'is-success': scope.row.Type === BillTypeEnumObj.Disbursement, 'is-red': scope.row.Type === BillTypeEnumObj.Income }"
     >{{ getTypeText(scope.row.Type) }}</span>
    </el-table-column>
    <el-table-column label="方式" width="65">
      <template slot-scope="scope">{{getModeText(scope.row.Mode)}}</template>
    </el-table-column>
    <el-table-column label="时间" width="125">
      <span class="is-gray" slot-scope="scope">{{
        scope.row.OperateTime | format2MiddleLangTypeDate
      }}</span>
    </el-table-column>
    <el-table-column label="客户账户" width="70" show-overflow-tooltip>
      <span slot-scope="scope">{{getAmountTypeText(scope.row.BillAccount)}}</span>
    </el-table-column>
    <el-table-column prop="name" label="金额" width="88" show-overflow-tooltip>
      <span
       :class="{ 'is-success': scope.row.Type === BillTypeEnumObj.Disbursement, 'is-red': scope.row.Type === BillTypeEnumObj.Income }"
        slot-scope="scope"><i class="is-font-size-13">{{ scope.row.Amount}}</i>{{getIsBeanType(scope.row.BillAccount) ? '个' : '元'}}</span>
    </el-table-column>
    <el-table-column  label="账户余额"  width="110">
      <template slot-scope="scope">{{ scope.row.NewAmount}}{{getIsBeanType(scope.row.BillAccount) ? '个' : '元'}}</template>
    </el-table-column>
    <el-table-column prop="Remark" label="备注" width="135">
        <span class="is-gray" slot-scope="scope">{{scope.row.Remark}}</span>
    </el-table-column>
    <el-table-column label="销售区域" width="140" show-overflow-tooltip>
      <span slot-scope="scope" v-if="scope.row.Customer">{{ getAdd(scope.row.Customer.SellArea) }}</span>
    </el-table-column>
    <el-table-column label="操作人" width="60">
      <template slot-scope="scope">{{
        scope.row.Operator ? scope.row.Operator.StaffName : ''
      }}</template>
    </el-table-column>
    <el-table-column prop="OrderIDString" label="订单号" min-width="90">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" :content="scope.row.OrderIDString" placement="left">
          <span>
            {{ scope.row.OrderIDString }}
          </span>
        </el-tooltip>
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!isBalanceDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { BillTypeEnumList, BillModeEnumList, BillTypeEnumObj, BillAccountEnumObj, BillAccountEnumList } from '@/packages/enums/billEnumList.js';

export default {
  computed: {
    ...mapState('fundBill', ['balanceTypeDataList', 'isBalanceDataLoading', 'condition4BalanceType']),
  },
  mixins: [tableMixin],
  data() {
    return {
      BillTypeEnumObj,
    };
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-fund-bill-page-balance-type-page-comp-wrap > header', 122);
      this.h = tempHeight;
    },
    getAdd(SellArea) {
      const { RegionalName, CityName, CountyName } = SellArea;
      return `${RegionalName}${CityName}${CountyName}`;
    },
    getTypeText(type) {
      return BillTypeEnumList.find(it => it.ID === type)?.Name || '';
    },
    getModeText(mode) {
      return BillModeEnumList.find(it => it.ID === mode)?.Name || '';
    },
    getIsBeanType(BillAccount) {
      return BillAccount === BillAccountEnumObj.PrintBean;
    },
    getAmountTypeText(BillAccount) {
      return BillAccountEnumList.find(it => it.ID === BillAccount)?.Name || '';
    },
  },
};
</script>

<style lang='scss'>
.mp-fund-bill-page-main-balace-table {
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }

  .el-table__body-wrapper .el-table__body tbody tr td > .cell {
    padding: 0 2px;
  }
}
</style>
