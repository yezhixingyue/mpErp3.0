<template>
  <el-table
    :data="tableData"
    max-height="240px"
    class="mp-common-table-styles mp-coupon-generate-dialog-table-comp-wrap mp-scroll-wrap"
  >
    <el-table-column label="生成时间" width="150">
      <template slot-scope="scope">
        <span class="is-gray">{{scope.row.CreateTime | format2MiddleLangTypeDate}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="Number" label="生成数量" width="85"></el-table-column>
    <el-table-column prop="ReceiveUser.StaffName" label="领取人" width="85"></el-table-column>
    <el-table-column prop="OperateUser.StaffName" label="操作人" width="85"></el-table-column>
    <el-table-column label="状态" width="85">
      <template slot-scope="scope">
        <span v-if="scope.row.HaveExported" class="is-success">已导出</span>
        <span v-if="!scope.row.HaveExported" class="is-red">未导出</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="208">
      <template slot-scope="scope">
        <normal-btn-full
         class="btn"
         title="导出"
         @click.native='handleExport2Excel(scope.row, scope.$index)' />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import normalBtnFull from '@/components/common/normalBtnFull.vue';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    amount: { // 优惠券金额
      type: Number,
      default: -1,
    },
    minPayAmount: { // 优惠券满多少可用
      type: Number,
      default: -1,
    },
    ValidEndTime: {
      type: String,
      default: '',
    },
  },
  components: {
    normalBtnFull,
  },
  methods: {
    handleExport2Excel(data, index) {
      if (!data) return;
      this.$store.dispatch('couponStore/getAccountReceivableExcel', [data, this.amount, this.minPayAmount, this.ValidEndTime, () => {
        this.$emit('changeGeneratedCouponList', index);
      }]);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-coupon-generate-dialog-table-comp-wrap {
  width: 700px;
  border: 1px solid $--border-color-base;
  .el-table__row td {
    border-bottom: 1px solid $--border-color-base !important;
    box-sizing: border-box;
    > .cell {
      > button.btn {
        background-color: $--color-primary;
        margin: 0;
        border: none;
        width: 70px;
        height: 20px;
        font-size: 12px;
        line-height: 17px;
        border-radius: 2px;
      }
    }
  }
}
</style>
