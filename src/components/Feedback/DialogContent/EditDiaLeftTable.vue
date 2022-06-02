<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    stripe
    tooltip-effect="dark"
    style="width: 100%"
    class="edit-dia-left-table-wrap"
    @selection-change="handleSelectionChange"
  >
    <template v-if="select">
      <el-table-column type="selection"
        class-name='select-column' label-class-name='select-wrap' width="60"></el-table-column>
    </template>
    <el-table-column label="包裹号" show-overflow-tooltip width="160">
      <template slot-scope="scope">{{ scope.row.ID }}</template>
    </el-table-column>
    <el-table-column prop="Logistics.BillNo" show-overflow-tooltip label="运单号" width="196">
    </el-table-column>
    <el-table-column prop="ProductAmount" label="产品数量" sortable min-width="108"></el-table-column>
    <el-table-column
      prop="TotalAmount" label="金额" sortable class-name='is-origin' width="146"></el-table-column>
    <el-table-column
      prop="UnPaidAmount" label="代收金额" sortable class-name='is-origin' width="146"></el-table-column>
  </el-table>
</template>

<script>

export default {
  props: {
    /**
     * 传递进来的表格数据
     */
    tableData: {
      type: Array,
      default: () => [],
    },
    SelectionData: {
      type: Array,
      default: () => [],
    },
    select: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      multipleSelection: [],
      h: 206,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('SelectionChange', val); // 使用了这个组件但是没有用vuex
      this.multipleSelection = val;
    },
    // getH() {
    //   setTimeout(() => {
    //     const h1 = document.getElementsByClassName('right-submit-wrap')[0];
    //     if (h1 && h1.offsetHeight) this.h = 362 - h1.offsetHeight;
    //   }, 0);
    // },
  },
  watch: {
    SelectionData(nVal) {
      if (nVal) {
        nVal.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
  },
  mounted() {
    // this.getH();
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.edit-dia-left-table-wrap{
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
                padding-left: 10px !important;
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
