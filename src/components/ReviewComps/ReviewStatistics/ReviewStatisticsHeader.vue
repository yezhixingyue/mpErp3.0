<template>
  <header class="mp-erp-review-statistics-list-page-header-wrap">
    <LineDateSelectorComp
      :changePropsFunc='setCondition'
      :requestFunc='getList'
      :isFull="true"
      :typeList="[['DateType', ''], ['TimeRange', 'MinValue'], ['TimeRange', 'MaxValue']]"
      :dateValue='condition.DateType'
      :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
      :dateList="dateList"
      label="时间范围"
    />
    <div class="show-box">
      <span>显示内容：</span>
      <el-checkbox v-model="ShowOrderCount">订单数量</el-checkbox>
      <el-checkbox v-model="ShowKind">款数</el-checkbox>
      <el-checkbox v-model="ShowAmount">金额</el-checkbox>
    </div>
  </header>
</template>

<script>
import LineDateSelectorComp from '../../common/SelectorComps/LineDateSelectorComp.vue';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    setCondition: {
      type: Function,
      default: () => {},
    },
    getList: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    LineDateSelectorComp,
  },
  data() {
    return {
      dateList: [
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '前天', ID: 'beforeyesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
        { name: '最近2个月', ID: 'last2Month' },
      ],
    };
  },
  computed: {
    UserDefinedTimeIsActive() {
      return this.condition.DateType === '' && !!this.condition.TimeRange.MinValue && !!this.condition.TimeRange.MaxValue;
    },
    ShowOrderCount: {
      get() {
        return this.condition.ShowOrderCount;
      },
      set(val) {
        this.setCondition([['ShowOrderCount'], val]);
      },
    },
    ShowKind: {
      get() {
        return this.condition.ShowKind;
      },
      set(val) {
        this.setCondition([['ShowKind'], val]);
      },
    },
    ShowAmount: {
      get() {
        return this.condition.ShowAmount;
      },
      set(val) {
        this.setCondition([['ShowAmount'], val]);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-statistics-list-page-header-wrap {
  padding: 20px 0;
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  .mp-line-date-selector-wrap {
    margin-right: 28px;
    min-width: 680px;
    flex: none;
    .mp-radio-group-full-box.el-radio-group > .el-radio-button {
      width: auto;
      .el-radio-button__inner {
        padding: 7px 22px;
      }
    }
  }
  .show-box {
    line-height: 28px;
    white-space: nowrap;
    > span {
      font-weight: 700;
      font-size: 14px;
      color: #444;
      margin-right: 15px;
    }
    > .el-checkbox {
      margin-right: 16px;
      .el-checkbox__label {
        font-size: 12px;
        padding-left: 8px;
      }
    }
  }
}
</style>
