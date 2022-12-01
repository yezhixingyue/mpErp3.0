<template>
  <div class="mp-common-comps-el-date-range-selector-comp-wrap" :class="type">
    <label>{{title}}：</label>
    <el-date-picker
      v-model="localValue"
      :type="type"
      align="left"
      :offset='-100'
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-ddTHH:mm:ss"
      :format="format"
      :picker-options="pickerOptions"
      :default-time='defaultTime'
      :clearable='clearable'
      :popper-class="popperClassName"
      @change='onChange'
      size="mini"
    >
    </el-date-picker>
    <span class="d" v-if="text">- {{text}}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'daterange',
    },
    title: {
      type: String,
      default: '时间筛选',
    },
    menus: { // 日期筛选按钮列表
      type: Array,
      default: () => [
        { text: '不限', key: 'all' },
        { text: '今天', key: 'TodayDate' },
        { text: '昨天', key: 'YesterdayDate' },
        { text: '前天', key: 'BeforeYesterdayTimeDate' },
        { text: '本周', key: 'curWeekDate' },
        { text: '上周', key: 'lastWeekDate' },
        { text: '本月', key: 'curMonthDate' },
        { text: '上月', key: 'lastMonthDate' },
      ],
    },
    maxSpan: { // 最大时间跨度，如订单管理最大不能超出一年
      type: Number,
      default: 0, // 天数
    },
    condition: {
      type: Object,
      default: null,
    },
    initText: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters('timeSelectModule', [
      'TodayDate', 'YesterdayDate', 'BeforeYesterdayTimeDate', 'curWeekDate', 'lastWeekDate', 'curMonthDate', 'lastMonthDate',
    ]),
    localValue: {
      get() {
        return this.value ? this.value.map(it => (it ? it.split('.')[0] : '')) : [];
      },
      set(val) {
        const _list = val ? val.map((it, i) => (it ? `${it}.${i === 0 ? '000Z' : '997Z'}` : '')) : [];
        this.$emit('input', _list);
      },
    },
    defaultTime() { // 后续的特殊处理？
      return ['00:00:00', '23:59:59'];
    },
    format() {
      if (this.type === 'daterange') return 'yyyy-MM-dd';
      return 'yyyy-MM-dd HH:mm';
    },
    pickerOptions() { // 全部选项包括：不限、今天、昨天、前天、本周、上周、本月、上月
      const shortcuts = this.menus.map(({ key, text }) => {
        if (key === 'all') {
          return {
            text,
            onClick: picker => {
              if (this.text === text) this.temp = text;
              picker.$emit('pick', ['', '']);
            },
          };
        }
        if (this[key]) {
          const _date = this[key];
          return {
            text,
            onClick: picker => {
              if (this.text !== text) this.temp = text;
              const start = new Date(_date.First?.replace('Z', ''));
              const end = new Date(_date.Second?.replace('Z', ''));
              picker.$emit('pick', [start, end]);
            },
          };
        }
        return null;
      }).filter(it => it);
      return {
        shortcuts,
        firstDayOfWeek: 1,
        onPick: this.onPick,
        disabledDate: this.getDisabledDate,
      };
    },
    clearable() { // 是否显示清除按钮，当menus中包含不限选项的时候可以清除
      const keys = this.menus.map(it => it.key);
      return keys.includes('all');
    },
    popperClassName() {
      const arr = ['mp-date-range-common-comp-wrap'];
      if (!this.clearable) arr.push('unable-clear');
      return arr.join(' ');
    },
  },
  data() {
    return {
      temp: '',
      text: '',
      curPickDate: null, // 当前正在选择的日期范围（非选定）
    };
  },
  methods: {
    onChange() {
      this.text = this.temp;
      this.temp = '';
    },
    onPick(e) {
      this.curPickDate = e;
    },
    getDisabledDate(e) {
      if (new Date(new Date(e).toDateString()).getTime() > Date.now()) return true;
      if (this.maxSpan > 0 && this.curPickDate) {
        const { minDate, maxDate } = this.curPickDate;
        if (!maxDate) {
          const oneDay = 24 * 60 * 60 * 1000;
          const diff = Math.ceil((Math.abs(new Date(new Date(minDate).toDateString()).getTime() - new Date(new Date(e).toDateString()).getTime())) / oneDay);
          return diff >= this.maxSpan;
        }
      }
      return false;
    },
  },
  watch: {
    condition: {
      handler(val) {
        this.text = val && val.initDateText ? val.initDateText : this.initText;
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-common-comps-el-date-range-selector-comp-wrap {
  display: flex;
  align-items: center;
  > label {
    min-width: 5em;
    font-size: 14px;
    font-weight: 600;
    color: #444444;
    line-height: 24px;
    margin-right: 15px;
    text-align: right;
  }
  > .el-date-editor {
    border-radius: 2px;
    width: 305px;
    > input {
      font-size: 13px;
      // color: #26bcf9;
      &::placeholder {
        color: #cbcbcb;
        color: #a2a2a2;
      }
    }
    .el-range-separator {
      color: #989898;
      font-weight: 700;
    }
  }
  > .d {
    font-size: 14px;
    font-weight: 700;
    // color: #428dfa;
    margin-left: 8px;
    color: #585858;
    // color: #26bcf9;
  }
  &.datetimerange {
    > .el-date-editor {
      width: 335px;
    }
  }
}
.el-picker-panel.mp-date-range-common-comp-wrap {
  .today.start-date, .today.end-date {
    > div > span {
      color: #fff !important;
    }
  }
  &.unable-clear {
    .el-picker-panel__footer {
      .el-button--text {
        display: none;
      }
    }
  }
  &.finance-use {
    .el-date-range-picker__editors-wrap {
      .el-date-range-picker__time-picker-wrap:last-of-type {
        pointer-events: none;
        .el-input__inner {
          background-color: #eee;
          color: #989898;
        }
      }
    }
  }
}
</style>
