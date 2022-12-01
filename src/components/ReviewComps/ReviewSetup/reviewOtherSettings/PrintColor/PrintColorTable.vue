<template>
  <el-table
    class="mp-erp-review-manage-list-page-comps-other-print-color-table-set-up-comp-wrap"
    :max-height="400"
    fit
    :data="list"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="180px" prop="_PropDisplayContent" show-overflow-tooltip label="元素选项"></el-table-column>
    <el-table-column min-width="110px" prop="_ColorDisplayContent" show-overflow-tooltip label="映射印色"></el-table-column>
    <el-table-column width="180px" label="操作">
      <template slot-scope="scope">
        <CtrlMenus
          @edit='onEditClick(scope.row, scope.$index)'
          @remove='onRemoveClick(scope.row, scope.$index)'
        />
      </template>
    </el-table-column>
    <div slot="empty">
      <span >暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import CtrlMenus from '../../../../common/NewComps/CtrlMenus/index.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CtrlMenus,
  },
  methods: {
    onEditClick(data, index) {
      this.$emit('edit', { data, index });
    },
    onRemoveClick(data, index) {
      this.messageBox.warnCancelBox('确定删除该条印色设置吗 ?', `[ ${data._PropDisplayContent} ] 映射至：[ ${data._ColorDisplayContent} ]`, () => {
        this.$emit('remove', { data, index });
      }, null);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-review-manage-list-page-comps-other-print-color-table-set-up-comp-wrap {
  margin-right: 2px;
  border: 1px solid $--border-color-base;
  margin-top: 12px;
  &.el-table::before {
    display: none;
  }
  .el-table__header-wrapper .el-table__header thead {
    tr {
      th {
        font-size: 14px;
        .cell {
          height: 34px;
          line-height: 34px;
          color: $--color-text-primary;
        }
      }
    }
  }
  .el-table__body-wrapper .el-table__body tbody tr td {
    color: $--color-text-primary;
    &.is-gray > .cell {
      font-size: 12px;
      color: #989898;
    }
    > .cell {
      color: #585858;
      height: 24px;
      line-height: 24px;
    }
  }
}

  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
    // white-space: pre;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 16px;
  }
</style>
