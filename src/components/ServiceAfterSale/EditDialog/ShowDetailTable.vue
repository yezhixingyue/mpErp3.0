<template>
  <el-table
    :data="tableData"
    :span-method="objectSpanMethod"
    class="mp-service-detail-table-wrap"
    border stripe
    style="width: 835px"
    :max-height="h"
  >
    <el-table-column prop="ID" label="包裹号" width="150"></el-table-column>
    <el-table-column label="运单号" width="188">
      <template slot-scope="scope">
        {{scope.row.Logistics && scope.row.Logistics.BillNo}}
      </template>
    </el-table-column>
    <el-table-column prop="ProductAmount" label="产品数量" width="100"></el-table-column>
    <el-table-column class-name='is-origin' label="金额" width="115">
      <template slot-scope="scope">
        {{scope.row.TotalAmount}}元
      </template>
    </el-table-column>
    <el-table-column class-name='is-origin' label="代收金额" width="115">
      <template slot-scope="scope">
        {{scope.row.UnPaidAmount}}元
      </template>
    </el-table-column>
    <el-table-column class-name='loss-col' label="损失金额" width="165">
      <template>
        <span>总共：</span>
        <span class="is-red">{{LossAmount}}元</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    h: {
      type: Number,
      default: 0,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    LossAmount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    objectSpanMethod({ rowIndex, columnIndex }) {
      const len = this.tableData.length;
      if (columnIndex !== 5) return '';
      if (rowIndex === 0) return { rowspan: len, colspan: 1 };
      return { rowspan: 0, colspan: 0 };
    },
  },
  mounted() {
    this.$emit('getHeight');
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-service-detail-table-wrap{
  border: 1px solid $--border-color-light;
  border-bottom: none;
  .el-table__header-wrapper {
    .el-table__header{
      thead{
        tr {
          th{
            padding: 3px 0;
            .cell {
              padding: 0px;
              &.select-wrap{
                position: relative;
                &::after{
                  content: '全选';
                  position: absolute;
                  height: 20px;
                  font-size: 12px;
                  font-weight: 400;
                  padding-left: 5px;
                  color: $--color-text-table;
                }
                text-align: left;
                padding-left: 10px;
                overflow: unset;
              }
              .caret-wrapper{
                height: 22px;
                .sort-caret.ascending{
                  top: 0;
                }
                .sort-caret.descending{
                  bottom: 0;
                }
              }
            }
            &.is-sortable{
              padding-left: 10px;
            }
          }
        }
      }
    }
  }
  .el-table__body-wrapper{
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $--border-color-base;
      border-radius: 4px;
      &:hover {
        background-color: $--color-text-secondary;
      }
    }
    .el-table__body {
      tbody {
        tr {
          td {
            padding: 5px 0;
            &.loss-col{
                background-color: #fff !important;
                border-left: 1px solid #eee;
                font-size: 14px;
                .is-red{
                  color: $--color-text-table-pending;
                  font-weight: 600;
                }
            }
            .cell{
              padding: 0;
            }
            &.select-column{
              text-align: left;
              padding-left: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
