<template>
  <el-table
    class="mp-erp-review-group-manage-list-page-comps-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="list"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="120px" prop="Name" show-overflow-tooltip label="组名称"></el-table-column>
    <el-table-column min-width="150px" prop="TotalNumber" show-overflow-tooltip label="成员人数">
      <template slot-scope="scope">
        {{scope.row.TotalNumber}}人
      </template>
    </el-table-column>
    <el-table-column min-width="150px" show-overflow-tooltip label="在线">
      <template slot-scope="scope">
        {{scope.row.OnlineNumber}}人
      </template>
    </el-table-column>
    <el-table-column min-width="150px" prop="TotalNumber" show-overflow-tooltip label="正常分配">
      <template slot-scope="scope">
        {{(scope.row.TotalNumber - scope.row.StopDistributionNumber).toFixed(0)}}人
      </template>
    </el-table-column>
    <el-table-column min-width="150px"  show-overflow-tooltip label="停止分配">
      <template slot-scope="scope">
        {{scope.row.StopDistributionNumber}}人
      </template>
    </el-table-column>
    <el-table-column width="375px" label="操作">
      <template slot-scope="scope">
        <CtrlMenus
          :canRemove='scope.row.TotalNumber===0'
          :showList="showList"
          detailText="查看成员"
          @edit='onEditClick(scope.row, scope.$index)'
          @remove='onRemoveClick(scope.row, scope.$index)'
          @detail="onMemberViewClick(scope.row.ID)"
        />
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import CtrlMenus from '../../../common/NewComps/CtrlMenus/index.vue';

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
  },
  mixins: [tableMixin],
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionCheckFileMemberGroup?.Obj || {};
    },
    showList() {
      const arr = [];
      if (this.localPermission.QueryMember) {
        arr.push('detail');
      }
      if (this.localPermission.GroupSetup) {
        arr.push('edit');
        arr.push('del');
      }
      return arr;
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-review-group-manage-list-page-wrap > header', 53);
      this.h = tempHeight;
    },
    onEditClick(data, index) {
      this.$emit('edit', [data, index]);
    },
    onRemoveClick(data, index) {
      this.messageBox.warnCancelBox('确定删除该分组吗 ?', `组名称：${data.Name}`, () => {
        this.$emit('remove', [data, index]);
      }, null);
    },
    onMemberViewClick(id) {
      this.$emit('member', id);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-review-group-manage-list-page-comps-main-table-comp-wrap {
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
    }
    > .cell {
      color: #585858;
      height: 24px;
      line-height: 24px;
    }
    &.left {
      text-align: left;
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
