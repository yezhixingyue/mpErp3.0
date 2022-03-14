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
    <el-table-column prop="ProduceDelayTime" label="类型" width="160">
      <span class="left" slot-scope="scope" :class="{'is-pink': scope.row.SpecialType === SpecialTypeEnums.stop.ID}">
        {{scope.row.SpecialContent}}
      </span>
    </el-table-column>
    <el-table-column prop="DateRangeContent" label="时间范围" width="360">
      <span class="left" slot-scope="scope" :title="scope.row.DateRangeContent">
        <i class="range-title">{{scope.row.DateRangeTitle}}</i>
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
    <el-table-column label="操作" width="180">
      <template slot-scope="scope" v-if="localPermission.DiliverySpecialSetup">
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
import { SpecialTypeEnums, DelayTypeEnumList } from '@/store/Period/ItemClass/SpecialDayItemClass';
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
  data() {
    return {
      SpecialTypeEnums,
    };
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
    localDataList() {
      if (Array.isArray(this.dataList)) {
        return this.dataList.map(it => ({
          ...it,
          SpecialContent: this.formatSpecialType(it),
          DateRangeTitle: this.getDateRangeTitle(it),
          DateRangeContent: this.getDateRangeContent(it),
        }));
      }
      return this.dataList;
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('header', 130, '.mp-erp-period-manage-special-day-manage-list-page');
      this.h = tempHeight;
    },
    onSetupClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelBox('确定删除该条特殊情况吗', `类型：${item.SpecialContent}`, () => {
        this.$emit('remove', item);
      });
    },
    formatSpecialType({ SpecialType, DelayTime }) {
      if (SpecialType === SpecialTypeEnums.stop.ID) return SpecialTypeEnums.stop.Name;
      if (SpecialType === SpecialTypeEnums.delay.ID) return `${SpecialTypeEnums.delay.Name} ${DelayTime || DelayTime === 0 ? DelayTime : '未知'}小时`;
      return '';
    },
    getDateRangeContent({ StartTime, EndTime, SpecialType }) {
      let end = format2MiddleLangTypeDateFunc2(EndTime);
      let begin = end ? format2MiddleLangTypeDateFunc2(StartTime) : '';
      if (SpecialType !== SpecialTypeEnums.delay.ID) {
        end = end ? end.slice(0, 10) : '';
        begin = begin ? begin.slice(0, 10) : '';
      }
      const dateContent = `${begin}${end ? ' 至 ' : ''}${end}`;
      return dateContent;
    },
    getDateRangeTitle({ SpecialType, DelayType }) {
      let title = '';
      if (SpecialType === SpecialTypeEnums.delay.ID) {
        const t = DelayTypeEnumList.find(it => it.ID === DelayType);
        if (t) title = `${t.Name.slice(0, 4)}：`;
      } else {
        title = '停发时间：';
      }
      return title;
    },
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
