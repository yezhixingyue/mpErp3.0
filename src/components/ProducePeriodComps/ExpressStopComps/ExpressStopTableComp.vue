<template>
  <el-table
    class="mp-erp-period-special-day-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localDataList"
    key="mp-erp-period-special-day-page-main-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column label="区域" min-width="240">
      <span class="left" slot-scope="scope" :title="scope.row.AreaDescribe">{{scope.row.AreaDescribe.replaceAll('\r\n', '、')}}</span>
    </el-table-column>
    <el-table-column label="配送方式" min-width="200">
      <span class="left" slot-scope="scope" :title="scope.row.ExpressList | formatExpressList(subExpressList)">
        {{scope.row.ExpressList | formatExpressList(subExpressList)}}
      </span>
    </el-table-column>
    <el-table-column prop="DateRangeContent" label="停发时间" width="290">
      <span class="left" slot-scope="scope" :title="scope.row.DateRangeContent">
        {{scope.row.DateRangeContent}}
      </span>
    </el-table-column>
    <el-table-column prop="Tips" label="客户提示" width="240">
      <span class="left" slot-scope="scope" :title="scope.row.Tips">
        {{scope.row.Tips}}
      </span>
    </el-table-column>
    <el-table-column prop="Tips" label="添加时间" width="150">
      <span slot-scope="scope">
        {{scope.row.AddTime | format2MiddleLangTypeDate}}
      </span>
    </el-table-column>
    <el-table-column prop="OperatorUserName" label="操作人" width="100"></el-table-column>
    <el-table-column label="操作" width="180" v-if="localPermission.DiliveryStopSetup">
      <template slot-scope="scope" >
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
import { mapGetters, mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/filters';

export default {
  mixins: [tableMixin, recordScrollPositionMixin('.mp-erp-period-special-day-page-main-table-comp-wrap .el-table__body-wrapper')],
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
    ...mapGetters('common', ['subExpressList', 'allAdAreaTreeList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
    localDataList() {
      if (Array.isArray(this.dataList)) {
        return this.dataList.map(it => ({
          ...it,
          DateRangeContent: this.getDateRangeContent(it),
          AreaDescribe: this.$utils.getTreeTextDisplayContent(it.AreaList, this.allAdAreaTreeList),
        }));
      }
      return this.dataList;
    },
  },
  methods: {
    setHeight() {
      const d = this.localPermission.DiliveryStopSetup ? 130 : 70;
      const tempHeight = this.getHeight('header', d, '.mp-erp-period-manage-special-day-manage-list-page');
      this.h = tempHeight;
    },
    onSetupClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelNullMsg('确定删除该条设置吗', () => {
        this.$emit('remove', item);
      });
    },
    getDateRangeContent({ StartTime, EndTime }) {
      const end = format2MiddleLangTypeDateFunc2(EndTime);
      const begin = end ? format2MiddleLangTypeDateFunc2(StartTime) : '';
      const dateContent = `${begin}${end ? ' 至 ' : ''}${end}`;
      return dateContent;
    },
  },
  mounted() {
    this.$store.dispatch('common/fetchAdAreaList');
  },
};
</script>
<style lang='scss'>
.mp-erp-period-special-day-page-main-table-comp-wrap {
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
            .range-title {
              display: inline-block;
              min-width: 5em;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>
