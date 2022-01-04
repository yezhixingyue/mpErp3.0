<template>
  <el-table
    class="mp-erp-period-holiday-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localDataList"
    key="mp-erp-period-holiday-page-main-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column label="名称" prop="ItemName" width="260"></el-table-column>
    <el-table-column label="月份" width="120" prop="YearMonth">
      <template slot-scope="scope">{{scope.row.YearMonth | formatYearMonth}}</template>
    </el-table-column>
    <el-table-column label="工作日设置" min-width="220">
      <span class="left" slot-scope="scope" :title="scope.row.workDayContent">
        {{scope.row.workDayContent ? scope.row.workDayContent.replaceAll('\r\n', ' 、') : ''}}
      </span>
    </el-table-column>
    <el-table-column prop="timeContent" label="最晚付款时间" width="210"></el-table-column>
    <el-table-column prop="ProduceDelayTime" label="可生产工期" width="130">
      <template slot-scope="scope">
        {{scope.row.ProductionTime}} 小时
      </template>
    </el-table-column>
    <el-table-column prop="ProduceDelayTime" label="客户提示" min-width="180">
      <span slot-scope="scope" :title="scope.row.Tips">{{scope.row.Tips}}</span>
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template slot-scope="scope">
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
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import { formatTimeObjToStringFunc } from '@/assets/js/filters/filters';
import { mapGetters } from 'vuex';

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
    dateSetList: {
      default: () => [],
      type: Array,
    },
  },
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapGetters('common', ['subExpressList']),
    localDataList() {
      if (Array.isArray(this.dataList)) {
        return this.dataList.map(it => ({ ...it, timeContent: this.getTimeContent(it), workDayContent: this.getWorkDayContent(it) }));
      }
      return [];
    },
  },
  filters: {
    formatYearMonth(YearMonth) {
      if (YearMonth) {
        const _YearMonth = `${YearMonth}`;
        const y = _YearMonth.slice(0, 4);
        const m = _YearMonth.slice(-2);
        return `${y}-${m}月`;
      }
      return '';
    },
  },
  mixins: [tableMixin, recordScrollPositionMixin('.mp-erp-period-holiday-page-main-table-comp-wrap .el-table__body-wrapper')],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('header', 130, '.mp-erp-period-holiday-page-wrap');
      this.h = tempHeight;
    },
    onSetupClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelBox('确定删除该条节假日设置吗', `名称：${item.ItemName}`, () => {
        this.$emit('remove', item);
      });
    },
    getTimeContent({ DelayType, LatestTime, ChangeTime }) { // 获取最晚付款时间显示内容
      const t = this.dateSetList.find(it => it.ID === DelayType);
      if (t) {
        if (t.Name === '固定时间') {
          const time = formatTimeObjToStringFunc(LatestTime);
          if (time) return `每天最晚付款时间：${time}`;
        }
        if (t.Name === '时间推移' && (ChangeTime || ChangeTime === 0)) {
          return `推移${ChangeTime}小时`;
        }
      }
      return '';
    },
    getWorkDayContent({ WorkDateList, RestDateList }) { // 获取工作日设置显示内容
      const _WorkDateList = Array.isArray(WorkDateList) ? WorkDateList.map(it => ({ Day: it, status: 'work' })) : [];
      const _RestDateList = Array.isArray(RestDateList) ? RestDateList.map(it => ({ Day: it, status: 'rest' })) : [];
      const _SummaryList = [..._WorkDateList, ..._RestDateList].sort((prev, next) => prev.Day - next.Day);
      const getSummaryList = (list, isGettingRest = false) => {
        if (!list || list.length === 0) return '';
        const _list = [];
        let _index = 0;
        list.forEach(it => {
          const { Day } = it;
          if (!_list[_index]) {
            _list[_index] = [];
          }
          if (_list[_index].length === 0) {
            _list[_index].push({ ...it });
          } else {
            const lastDay = _list[_index][_list[_index].length - 1].Day;
            if (Day === lastDay + 1) {
              _list[_index].push({ ...it });
            } else {
              _index += 1;
              _list[_index] = [{ ...it }];
            }
          }
        });
        return _list.map(arr => {
          if (arr.length === 1) return `${arr[0].Day}号${arr[0].status === 'rest' && !isGettingRest ? '休息' : ''}`;
          const min = arr[0].Day;
          const max = arr[arr.length - 1].Day;
          if (!isGettingRest) {
            const restList = arr.filter(it => it.status === 'rest');
            if (restList.length > 0) {
              if (restList.length === arr.length) {
                return `${min}-${max}号 ( 全为休息 )`;
              }
              const restContent = getSummaryList(restList, true).join('、');
              return `${min}-${max}号 ( ${restContent}休息 )`;
            }
          }
          return `${min}-${max}号`;
        });
      };
      const res = getSummaryList(_SummaryList);
      return Array.isArray(res) ? res.join('\r\n') : '无';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-period-holiday-page-main-table-comp-wrap {
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
