<template>
  <el-table
    class="mp-erp-period-new-special-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="dataList"
    key="mp-erp-period-new-special-page-main-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column label="操作内容" min-width="260" prop="Summary" label-class-name='left-title-cow'>
      <span slot-scope="scope" class="ctrl-content">{{scope.row.Summary}}</span>
    </el-table-column>
    <el-table-column label="操作时间" width="260" prop="ItemName">
      <template slot-scope="scope">{{scope.row.AddTime | format2MiddleLangTypeDate}}</template>
    </el-table-column>
    <el-table-column label="操作人" width="260" prop="OperatorUserName"></el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  props: {
    dataList: {
      default: () => [],
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
  },
  mixins: [tableMixin, recordScrollPositionMixin('.mp-erp-period-manage-new-special-manage-log-list-page .el-table__body-wrapper')],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('header', 160, '.mp-erp-period-manage-new-special-manage-log-list-page');
      this.h = tempHeight;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-period-new-special-page-main-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  .el-table__header-wrapper thead tr th {
    .cell {
      line-height: 36px;
      font-size: 14px;
      &.left-title-cow {
        text-align: left;
        padding-left: 30px !important;
      }
    }
    &.menu-column {
      .cell {
        text-align: left;
        padding-left: 425px !important;
      }
    }
  }
  .el-table__body-wrapper {
    .el-table__row {
      width: 100%;
      > td {
        > .cell {
          font-size: 12px;
          height: 30px;
          color: #585858;
          .ctrl-content {
            display: block;
            padding-left: 20px;
            text-align: left;
          }
        }
      }
    }
  }
}
</style>
