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
    <el-table-column prop="ThirdTradeCode" label="交易单号" min-width="150" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="OutTradeCode" label="微信/支付宝号" min-width="230" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="Customer.CustomerSN" label="客户编号" min-width="90"></el-table-column>
    <el-table-column prop="Customer.CustomerName" label="客户" min-width="140" show-overflow-tooltip>
    </el-table-column>
    <el-table-column
     show-overflow-tooltip prop="Customer.Type.Second" label="客户类型" min-width="76"></el-table-column>
     <el-table-column
     show-overflow-tooltip prop="Customer.Grade.Second" label="客户等级" min-width="76"></el-table-column>
    <el-table-column label="类型" min-width="70">
     <span
      slot-scope="scope"
      :class="{ 'is-success': scope.row.Type === 21, 'is-red': scope.row.Type === 11 }"
     >{{ scope.row.Type | formatFundBillBalanceType }}</span>
    </el-table-column>
    <el-table-column label="方式" min-width="70">
      <template slot-scope="scope">{{scope.row.Currency | formatFundBillBalanceCurrency}}</template>
    </el-table-column>
    <el-table-column label="时间" min-width="125">
      <span class="is-gray" slot-scope="scope">{{
        scope.row.OperateTime | format2MiddleLangTypeDate
      }}</span>
    </el-table-column>
    <el-table-column prop="name" :label="isBeanType ? '印豆数量' : '金额'" min-width="100" show-overflow-tooltip>
      <span
       :class="{ 'is-success': scope.row.Amount < 0, 'is-red': scope.row.Amount > 0 }"
        slot-scope="scope"><i class="is-font-size-13">{{ scope.row.Amount}}</i>{{isBeanType ? '个' : '元'}}</span>
    </el-table-column>
    <!-- <el-table-column label="原账户余额" min-width="110">
      <template slot-scope="scope">{{ scope.row.CurrentAmount}}{{isBeanType ? '个' : '元'}}</template>
    </el-table-column> -->
    <el-table-column  :label="isBeanType ? '印豆余额' : '账户余额'"  min-width="122">
      <template slot-scope="scope">{{ scope.row.NewAmount}}{{isBeanType ? '个' : '元'}}</template>
    </el-table-column>
    <el-table-column prop="Remark" label="备注" min-width="125">
        <span class="is-gray" slot-scope="scope">{{scope.row.Remark}}</span>
    </el-table-column>
    <el-table-column label="销售区域" min-width="160" show-overflow-tooltip>
      <span slot-scope="scope" v-if="scope.row.Customer">{{ getAdd(scope.row.Customer.SellArea) }}</span>
    </el-table-column>
    <el-table-column label="操作人" min-width="80">
      <template slot-scope="scope">{{
        scope.row.Operator ? scope.row.Operator.StaffName : ''
      }}</template>
    </el-table-column>
    <el-table-column prop="OrderIDString" label="订单号" min-width="100">
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

export default {
  computed: {
    ...mapState('fundBill', ['balanceTypeDataList', 'isBalanceDataLoading', 'condition4BalanceType']),
    isBeanType() {
      return this.condition4BalanceType.BillType === 0;
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-fund-bill-page-balance-type-page-comp-wrap > header', 122);
      this.h = tempHeight;
    },
    getAdd(SellArea) {
      const { RegionalName, CityName, CountyName } = SellArea;
      return `${RegionalName}${CityName}${CountyName}`;
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
}
</style>
