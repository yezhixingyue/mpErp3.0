<template>
  <el-table
    class="mp-erp-review-members-list-page-table-comp-wrap"
    :max-height="h"
    fit
    :data="list"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column width="270px" prop="Name" show-overflow-tooltip label="姓名">
      <template slot-scope="scope">
        {{scope.row.Name}} ( {{scope.row.UnCheckedNumber}}单 )
      </template>
    </el-table-column>
    <el-table-column min-width="100px" prop="totalTimes" show-overflow-tooltip label="分配状态">
      <span slot-scope="scope" class="status-box" :class="!scope.row.IsDistributionSuspended?'ing':'stop'"></span>
    </el-table-column>
    <el-table-column min-width="100px" prop="totalTimes" show-overflow-tooltip label="在线状态">
      <span slot-scope="scope" class="status-box online" :class="scope.row.IsOnline?'ing':'stop'"></span>
    </el-table-column>
    <el-table-column min-width="110px" label="操作" v-if="hasPermission">
      <template slot-scope="scope">
        <span :class="scope.row.UnCheckedNumber===0?'red-span':'is-gray'" @click="onDelClick(scope.row)">删除</span>
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasPermission: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-review-group-members-manage-list-page-wrap > header', 280);
      this.h = tempHeight;
    },
    onDelClick(item) {
      if (!item || item.UnCheckedNumber > 0) return;
      this.messageBox.warnCancelBox('确定删除该成员吗 ?', `姓名：[ ${item.Name} ]`, () => {
        this.$emit('remove', item);
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-review-members-list-page-table-comp-wrap {
  margin-right: 2px;
  border: 1px solid $--border-color-base;
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
      .status-box {
        margin-top: 5px;
        &.online {
          &.ing {
            background: #70B603;
          }
          &.stop {
            background-color: #ccc;
            display: none;
          }
        }
      }
      span.is-gray {
        user-select: none;
      }
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
