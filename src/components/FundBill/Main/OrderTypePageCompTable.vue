<template>
  <el-table
    class="mp-fund-bill-page-main-order-table"
    :max-height="h"
    :height="h"
    :data="orderTypeDataList"
    border
    stripe
    fit
    style="width: 100%"
  >
    <el-table-column prop="OrderID" label="订单号" width="110" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="Customer.CustomerSN" label="客户编号" width="110" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="Customer.CustomerName" label="客户" width="175"></el-table-column>
    <el-table-column
     show-overflow-tooltip prop="Customer.Type.Second" label="客户类型" width="80"></el-table-column>
     <el-table-column
     show-overflow-tooltip prop="Customer.Grade.Second" label="客户等级" width="80"></el-table-column>
    <el-table-column prop="Customer.CustomerName" label="类型" width="90" show-overflow-tooltip>
      <span
        slot-scope="scope"
        :class="{ 'is-success': scope.row.Type === 21, 'is-red': scope.row.Type === 12 }"
      >{{ scope.row.Type | formatFundBillOrderType }}</span>
    </el-table-column>
    <el-table-column label="渠道" width="90">
     <template slot-scope="scope">{{scope.row.Currency | formatFundBillOrderCurrency}}</template>
    </el-table-column>
    <el-table-column label="现金" width="120">
      <span
       :class="{'is-success': scope.row.CashAmount < 0,'is-red': scope.row.CashAmount > 0}"
        slot-scope="scope"><i class="is-font-size-13">{{ scope.row.CashAmount}}</i>元</span>
    </el-table-column>
    <el-table-column label="印豆" width="120">
      <span
       :class="{'is-success': scope.row.BeanNumber < 0,'is-red': scope.row.BeanNumber > 0}"
        slot-scope="scope"><i class="is-font-size-13">{{ scope.row.BeanNumber}}</i>个</span>
    </el-table-column>
    <el-table-column prop="date" label="未付金额" width="120">
      <template slot-scope="scope">{{ scope.row.UnPayAmount}}元</template>
    </el-table-column>
    <el-table-column prop="name" label="订单总金额" width="130" show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.TotalAmount}}元</template>
    </el-table-column>
    <el-table-column prop="date" label="时间" width="125">
      <span class="is-gray" slot-scope="scope">{{
        scope.row.CreateTime | format2MiddleLangTypeDate
      }}</span>
    </el-table-column>
    <el-table-column label="销售区域" width="180" show-overflow-tooltip>
      <template slot-scope="scope" v-if="scope.row.Customer">{{
        getAdd(scope.row.Customer.SellArea) }}</template>
    </el-table-column>
    <el-table-column prop="Remark" label="备注" min-width="190" show-overflow-tooltip>
        <span class="is-gray" slot-scope="scope">{{scope.row.Remark}}</span>
    </el-table-column>
    <div slot="empty">
      <span v-show="!isOrderDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  computed: {
    ...mapState('fundBill', ['orderTypeDataList', 'isOrderDataLoading']),
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
.mp-fund-bill-page-main-order-table {
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
}
</style>
