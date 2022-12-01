<template>
  <el-table
    class="mp-erp-review-force-exit-list-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="localList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="120px" prop="Name" show-overflow-tooltip label="姓名"></el-table-column>
    <el-table-column min-width="120px" prop="totalTimes" show-overflow-tooltip label="强退总次数"></el-table-column>
    <el-table-column min-width="120px"  prop="lastMonthTimes" show-overflow-tooltip label="上月强退次数"></el-table-column>
    <el-table-column min-width="120px"  prop="curMonthTimes" show-overflow-tooltip label="本月强退次数"></el-table-column>
    <el-table-column min-width="160px"  prop="lastForceExitTime" show-overflow-tooltip label="最后一次强退时间" class-name="is-gray"></el-table-column>
    <el-table-column width="260px" label="操作" v-if="localPermission.SetupPrintBean">
      <template slot-scope="scope">
        <CtrlMenus :showList="['detail']" detailText="查看详情" @detail="onDetailClick(scope.row)" />
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
      if (this.Permission?.PermissionList?.PermissionManagePrintBean?.Obj) {
        return this.Permission.PermissionList.PermissionManagePrintBean.Obj;
      }
      return {};
    },
    localList() {
      if (Array.isArray(this.list)) {
        return this.list.map(it => ({
          ...it,
          totalTimes: it.List.length,
          curMonthTimes: this.getMonthTimes(it.List, true),
          lastMonthTimes: this.getMonthTimes(it.List),
          lastForceExitTime: this.getLastTime(it.List),
        }));
      }
      return [];
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-force-exit-record-list-page-wrap > header', 72);
      this.h = tempHeight;
    },
    onDetailClick(item) {
      this.$emit('detail', item);
    },
    getMonthTimes(list, isCurrentMonth) {
      const date = isCurrentMonth ? new Date() : new Date().setMonth(new Date().getMonth() - 1);
      const y = new Date(date).getFullYear();
      const m = new Date(date).getMonth();
      const _list = list.filter(it => {
        const _y = new Date(it.Time.replace('Z', '')).getFullYear();
        const _m = new Date(it.Time.replace('Z', '')).getMonth();
        return _y === y && _m === m;
      });
      return _list.length;
    },
    getLastTime(list) {
      const str = list && list.length > 0 ? list[0].Time || '' : '';
      return this.$utils.getTimeContentWithChiness(str);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-review-force-exit-list-page-table-comp-wrap {
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
