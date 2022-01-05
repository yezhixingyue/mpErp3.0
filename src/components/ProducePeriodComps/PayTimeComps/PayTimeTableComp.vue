<template>
  <el-table
    class="mp-erp-period-paytime-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="dataList"
    key="mp-erp-period-paytime-page-main-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column label="区域" min-width="300">
      <span class="left" slot-scope="scope" :title="scope.row.AreaDescribe">{{scope.row.AreaDescribe.replaceAll('\r\n', '、')}}</span>
    </el-table-column>
    <el-table-column label="配送方式" min-width="240">
      <span class="left" slot-scope="scope" :title="scope.row.ExpressList | formatExpressList(subExpressList)">
        {{scope.row.ExpressList | formatExpressList(subExpressList)}}
      </span>
    </el-table-column>
    <el-table-column label="最晚付款时间" width="240">
      <template slot-scope="scope">
        {{scope.row.LatestPayTime | formatTimeObjToString}} 之前
      </template>
    </el-table-column>
    <el-table-column prop="ProduceDelayTime" label="生产延后时长" width="240">
      <template slot-scope="scope">
        {{scope.row.ProduceDelayTime}}小时
      </template>
    </el-table-column>
    <el-table-column prop="AreaDescribe" label="操作" width="280">
      <template slot-scope="scope" v-if="localPermission.PayTimeSetup">
        <CtrlMenus @edit='onSetupClick(scope.row)' @remove='onRemoveClick(scope.row)' />
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapGetters, mapState } from 'vuex';

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
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapGetters('common', ['subExpressList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
  },
  mixins: [tableMixin, recordScrollPositionMixin('.mp-erp-period-paytime-page-main-table-comp-wrap .el-table__body-wrapper')],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('header', this.localPermission.PayTimeSetup ? 130 : 70, '.mp-erp-period-manage-pay-time-manage-list-page');
      this.h = tempHeight;
    },
    onSetupClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelNullMsg('确定删除该条付款时间吗', () => {
        this.$emit('remove', item);
      });
    },
  },
  created() {
    this.$store.dispatch('common/getExpressList');
  },
};
</script>
<style lang='scss'>
.mp-erp-period-paytime-page-main-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  .el-table__header-wrapper thead tr th {
    .cell {
      line-height: 36px;
      font-size: 14px;
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
          .left {
            display: inline-block;
            width: 85%;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
