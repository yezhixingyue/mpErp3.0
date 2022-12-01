<template>
  <ul class="mp-statistic-date-and-chart-type-setup-comp-wrap">
    <li>
      <span class="title">日期范围：</span>
      <div @click="onDateTypeClick">
        <span class="select-item" data-type='curMonthDate' :class="dateType==='curMonthDate'?'active':''">本月</span>
        <span class="select-item" data-type='lastMonthDate' :class="dateType==='lastMonthDate'?'active':''">上月</span>
        <span class="select-item" data-type='custom' :class="dateType==='custom'?'active':''" style="width: 130px">自定义时间</span>
        <el-date-picker
          :disabled="dateType!=='custom'"
          v-model="customDate"
          type="daterange"
          align="center"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
        <i>（ 包含起止日期 ）</i>
      </div>
    </li>
    <li>
      <span class="title">图标样式：</span>
      <div @click="onChartTypeClick">
        <span
         class="select-item"
         :data-type='it.ID'
         :class="+chartType===it.ID?'active':''"
         v-for="it of StatisticalIconStyleList"
         :key='it.key'>{{it.name}}</span>
        <el-button type="primary" @click="onSubmitClick">生成图表</el-button>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

export default {
  data() {
    return {
      dateType: 'curMonthDate', // curMonthDate | lastMonthDate | custom
      chartType: '0', // 0 | 1 | 2  对应StatisticalIconStyleList列表ID
      customDate: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          },
        }],
      },
    };
  },
  computed: {
    ...mapState('common', ['StatisticalIconStyleList']),
  },
  methods: {
    onDateTypeClick(e) {
      if (e.target.nodeName === 'SPAN' && e.target.classList.contains('select-item')) {
        const { type } = e.target.dataset;
        this.dateType = type;
      }
    },
    onChartTypeClick(e) {
      if (e.target.nodeName === 'SPAN' && e.target.classList.contains('select-item')) {
        const { type } = e.target.dataset;
        if (type) this.chartType = type;
      }
    },
    getDateRange() {
      let date = null;
      if (this.dateType !== 'custom') {
        date = this.$store.getters[`timeSelectModule/${this.dateType}`];
      } else if (this.customDate && Array.isArray(this.customDate) && this.customDate.length === 2) {
        const _first = ConvertTimeFormat(this.customDate[0]);
        const _second = ConvertTimeFormat(this.customDate[1]);
        date = { First: `${_first}T00:00:00.000Z`, Second: `${_second}T23:59:59.997Z` };
      } else {
        this.messageBox.failSingleError('生成图表失败', '[ 请设置自定义时间 ]');
        return null;
      }
      if (!date) this.messageBox.failSingleError('生成图表失败', '[ 未获取到日期范围 ]');
      // if (date) 如果需要转换时间在此进行
      return date;
    },
    onSubmitClick() {
      // const date = this.getDateRange(); // 获取日期范围
      // if (!date) return;
      // console.log(date); // 日期范围
      // console.log(this.chartType); // 图表类型 ---  该值为字符串类型
    },
  },
};
</script>
<style lang='scss'>
ul.mp-statistic-date-and-chart-type-setup-comp-wrap {
  display: flex;
  margin-left: -3px;
  flex-wrap: wrap;
  > li {
    padding-top: 15px;
    display: flex;
    align-items: center;
    flex: none;
    height: 35px;
    > span.title {
      color: #444;
      font-weight: 700;
      font-size: 14px;
      margin-right: 10px;
      flex: none;
    }
    > div {
      flex: none;
      > span.select-item {
        display: inline-block;
        font-size: 14px;
        color: #585858;
        width: 90px;
        text-align: center;
        border: 1px solid #E6E6E6;
        background-color: #f5f5f5;
        height: 28px;
        box-sizing: border-box;
        border-right: none;
        line-height: 26px;
        transition: 0.1s ease-in-out;
        user-select: none;
        cursor: pointer;
        &:last-of-type {
          border-right: 1px solid #E6E6E6;
        }
        &.active {
          border-color: #26BCF9;
          background-color: #fff;
          color: #26BCF9;
          & + span.select-item {
            border-left-color: #26BCF9;
          }
        }
      }
      > .el-button {
        width: 120px;
        height: 35px;
        padding: 0;
        border-radius: 2px;
        margin-left: 40px;
      }
      > .el-date-editor {
        margin-left: 19px;
        border-radius: 0px;
        height: 28px;
        line-height: 28px;
        .el-range-separator, .el-range__icon, .el-range__close-icon {
          line-height: 20px;
        }
      }
      > i {
        color: #a2a2a2;
        font-size: 12px;
        margin-left: 8px;
      }
    }
    &:first-of-type {
      width: 896px;
    }
  }
}
</style>
