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
    <el-table-column label="名称" width="260" prop="ItemName"></el-table-column>
    <el-table-column label="条件" min-width="300">
      <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false' slot-scope="scope">
        <div slot="content">
          <p class="if-box"><span class="is-origin">如果</span> {{scope.row.FilterTypeText}}：</p>
          <template v-if="Array.isArray(scope.row._ConditionText)">
            <p v-for="(it, i) in scope.row._ConditionText" :key="it.name + 'tips' + i">
              <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
              <span class="name">{{it.name}}</span>
              <span class="is-origin">{{it.operator}}</span>
              <span class="val">{{it.val}}</span>
              <span v-if="i === scope.row._ConditionText.length - 1" style="margin-left:2px"> 。</span>
              <span v-else style="margin-left:2px">；</span>
            </p>
          </template>
          <p v-else>{{scope.row._ConditionText || '无'}}</p>
          <p class="if-box" style="margin-right:5px">
            <span class="is-origin">则</span>
          </p>
          <p>该条生效</p>
        </div>
        <div class="common-property-condition-text-content-box" style="text-align:left;margin-left:12px">
          <p class="if-box"><span class="is-origin">如果</span> {{scope.row.FilterTypeText}}</p>
          <template v-if="Array.isArray(scope.row._ConditionText)">
            <p v-for="(it, i) in scope.row._ConditionText" :key="it.name + 'content' + i">
              <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
              <span>{{it.name}}</span>
              <span>{{it.operator}}</span>
              <span>{{it.val}}</span>
            </p>
          </template>
          <p v-else>{{scope.row._ConditionText || '无'}}</p>
          <p class="if-box" style="margin-left:10px;margin-right:5px">
            <span class="is-origin">则</span>
          </p>
          <p>该条生效</p>
        </div>
      </el-tooltip>
    </el-table-column>
    <el-table-column label="类型" width="130">
      <template slot-scope="scope">{{getSpecialTypeContent(scope.row)}}</template>
    </el-table-column>
    <el-table-column label="处理方式" width="320">
      <template slot-scope="scope">{{getHandlerContent(scope.row)}}</template>
    </el-table-column>
    <el-table-column label="优先级" width="100" prop="Priority"></el-table-column>
    <el-table-column prop="AreaDescribe" label="操作" width="260">
      <template slot-scope="scope" v-if="localPermission.PayTimeSetup">
        <div class="ctrl">
          <div class="log" @click="onLogClick(scope.row)">
            <i class="el-icon-tickets"></i>
            <span>操作记录</span>
          </div>
          <CtrlMenus @edit='onSetupClick(scope.row)' @remove='onRemoveClick(scope.row)' />
        </div>
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
import { NewSpecialTypeEnumList, NewSpecialTypeEnumObj, SpecialTimeTypeEnumObj } from '../../../store/Period/ItemClass/NewSpecialPanelClass';

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
  mixins: [tableMixin, recordScrollPositionMixin('.mp-erp-period-manage-new-special-manage-list-page .el-table__body-wrapper')],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('header', this.localPermission.PayTimeSetup ? 130 : 70, '.mp-erp-period-manage-new-special-manage-list-page');
      this.h = tempHeight;
    },
    onSetupClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelBox('确定删除该条特殊情况吗', `名称：[ ${item.ItemName} ]`, () => {
        this.$emit('remove', item);
      });
    },
    onLogClick(item) {
      this.$emit('log', item);
    },
    getSpecialTypeContent({ SpecialType }) {
      return this.$utils.getNameFromListByIDs(SpecialType, NewSpecialTypeEnumList);
    },
    getHandlerContent({ SpecialType, TimeType, TimeChange, StartTime, EndTime, LatestPayChange, ProduceStartChange }) {
      const arr = [];
      if (SpecialType === NewSpecialTypeEnumObj.lastPay.ID) { // 更改最晚付款时间
        if (LatestPayChange) {
          arr.push(`付款时间偏移 ${LatestPayChange} 小时`);
        }
        if (ProduceStartChange) {
          arr.push(`生产开始时间偏移 ${ProduceStartChange} 小时`);
        }
      } else if (TimeType === SpecialTimeTypeEnumObj.fixedTime.ID) {
        const { First, Second } = TimeChange;
        if (First || Second) {
          arr.push(`时间延长${First ? ` ${First} 天` : ''}${Second ? ` ${Second} 小时` : ''}`);
        }
      } else if (TimeType === SpecialTimeTypeEnumObj.dateRange.ID) {
        if (StartTime && EndTime) {
          arr.push(`影响范围：${this.$utils.getDateFormat(StartTime)} - ${this.$utils.getDateFormat(EndTime)}`);
        }
      }
      return arr.join('；');
    },
  },
  created() {
    this.$store.dispatch('common/getExpressList');
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
          .ctrl {
            display: flex;
            align-items: center;
            justify-content: center;
            .log {
              display: flex;
              align-items: center;
              margin-right: 20px;
              i {
                color: #26bcf9;
                font-size: 15px;
                font-weight: 700;
                margin-right: 5px;
              }
              span {
                color: #989898;
              }
              &:hover {
                cursor: pointer;
                span {
                  color: #444;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
