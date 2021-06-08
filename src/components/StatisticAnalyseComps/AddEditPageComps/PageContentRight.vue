<template>
  <ul class="mp-statistic-analyse-add-edit-page-content-right-wrap">
    <li>
      <span>日期分组：</span>
      <div>
        <SingleRadioGroupComp  v-model="TimeSpan" :list='StatisticalDateTypeList' />
        <p style="height: 19px">
          <el-checkbox v-show="TimeSpan !== 0" v-model="ShowTimeRate">显示占比</el-checkbox>
          <el-checkbox v-show="TimeSpan === 2" v-model="ShowYoy">显示同比（含增长率）</el-checkbox>
        </p>
      </div>
    </li>
    <li style="align-items: center;">
      <span>行分组：</span>
      <div class="flex-show">
        <order-channel-selector
        :options='rowOptionsList'
        :changePropsFunc='setConditionForSaveForm'
        :typeList="[['Row', 'Type']]"
        :value='condition4SaveForm.Row.Type'
        :showLabel='false'
       />
        <el-checkbox v-show="condition4SaveForm.Row.Type || condition4SaveForm.Row.Type === 0" v-model="rowSummaryChecked">显示汇总</el-checkbox>
        <el-checkbox v-show="condition4SaveForm.Row.Type || condition4SaveForm.Row.Type === 0" v-model="rowProportionChecked">显示占比</el-checkbox>
      </div>
    </li>
    <li style="align-items: center;">
      <span>列分组：</span>
      <div class="flex-show">
        <order-channel-selector
        :options='columnOptionsList'
        :changePropsFunc='setConditionForSaveForm'
        :typeList="[['Column', 'Type']]"
        :value='condition4SaveForm.Column.Type'
        :showLabel='false'
       />
       <el-checkbox v-show="condition4SaveForm.Column.Type || condition4SaveForm.Column.Type === 0" v-model="columnSummaryChecked">显示汇总</el-checkbox>
       <el-checkbox v-show="condition4SaveForm.Column.Type || condition4SaveForm.Column.Type === 0" v-model="columnProportionChecked">显示占比</el-checkbox>
      </div>
    </li>
    <li class="icon-select-box">
      <span>图表样式：</span>
      <ul>
        <li>
          <div @click="setIconStyleValue('histogram')">
            <img src="../../../assets/images/histogram.png" alt="">
          </div>
          <el-checkbox v-model="isHistogram">柱状图</el-checkbox>
        </li>
        <li>
          <div @click="setIconStyleValue('lineChart')">
            <img src="../../../assets/images/lineChart.png" alt="">
          </div>
          <el-checkbox v-model="isLineChart">折线图</el-checkbox>
        </li>
        <li>
          <div @click="setIconStyleValue('pieChart')">
            <img src="../../../assets/images/pieChart.png" alt="">
          </div>
          <el-checkbox v-model="isPieChart">饼状图</el-checkbox>
        </li>
      </ul>
    </li>
    <li>
      <span>数据拆分：</span>
      <div>
        <SingleRadioGroupComp  v-model="SplitType" :list='StatisticalDataSplitList' />
      </div>
    </li>
  </ul>
</template>

<script>
import SingleRadioGroupComp from '@/components/common/SingleRadioGroupComp.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    SingleRadioGroupComp,
    OrderChannelSelector,
  },
  data() {
    return {
      // ChartList: [], // 图标样式      histogram 柱状 | pieChart 饼状 | lineChart 折线 -- 列表 StatisticalIconStyleList
      // SplitType: '', // 数据拆分
    };
  },
  computed: {
    ...mapState('common', ['StatisticalDateTypeList', 'StatisticalRowColumnList', 'StatisticalIconStyleList', 'StatisticalDataSplitList']),
    ...mapState('statistic', ['condition4SaveForm', 'curSelectedAreaShowText', 'curSelectedProductShowText']),
    curFormData() { // 当前选择表单对应数据
      if (!this.condition4SaveForm) return null;
      const { Type } = this.condition4SaveForm;
      let subData = null;
      switch (Type) { // 转换表单信息
        case 0:
          subData = this.condition4SaveForm.OrderFormData; // 订单
          break;
        case 1:
          subData = this.condition4SaveForm.CustomerFormData; // 客户
          break;
        case 2:
          subData = this.condition4SaveForm.OrderCustomerFormData; // 客户订单
          break;
        case 3:
          subData = this.condition4SaveForm.AfterSalesFormData; // 售后
          break;
        default:
          break;
      }
      return subData;
    },
    validOptionList() {
      if (!this.StatisticalRowColumnList || this.StatisticalRowColumnList.length === 0) return [];
      if (!this.condition4SaveForm.Type && this.condition4SaveForm.Type !== 0) return [];
      // eslint-disable-next-line max-len
      const list = this.StatisticalRowColumnList.filter(it => it.valid.includes(this.condition4SaveForm.Type)).filter(it => !it.type || it.type !== 'ConditionRangeList');
      const filterArr = [];
      if (this.curFormData.ProductList) {
        if (this.curFormData.ProductList.length > 20) filterArr.push(23);
        if (Array.isArray(this.curSelectedProductShowText) && this.curSelectedProductShowText.length === 1 && this.curSelectedProductShowText[0] === '全部产品') {
          filterArr.push(22);
        }
      }
      if (this.curFormData.AreaList) {
        if (this.curFormData.AreaList.length > 20) filterArr.push(33);
        if (Array.isArray(this.curSelectedAreaShowText) && this.curSelectedAreaShowText.length === 1 && this.curSelectedAreaShowText[0] === '全部区域') {
          filterArr.push(32);
        }
      }
      return list.filter(it => !filterArr.includes(it.ID));
    },
    rowOptionsList() { // 行分组列表 --- 根据 数据类型 选项切换不同下拉选项
      if (!this.validOptionList || this.validOptionList.length === 0) return [];
      if (!this.condition4SaveForm.Column.Type && this.condition4SaveForm.Column.Type !== 0) return this.validOptionList;
      return this.validOptionList.filter(it => it.ID !== this.condition4SaveForm.Column.Type);
    },
    columnOptionsList() { // 列分组列表
      if (!this.validOptionList || this.validOptionList.length === 0) return [];
      if (!this.condition4SaveForm.Row.Type && this.condition4SaveForm.Row.Type !== 0) return this.validOptionList;
      return this.validOptionList.filter(it => it.ID !== this.condition4SaveForm.Row.Type);
    },
    iconStylesObj() { // 图标样式对象
      if (!this.StatisticalIconStyleList || this.StatisticalIconStyleList.length === 0) return null;
      const _obj = {};
      this.StatisticalIconStyleList.forEach(it => {
        if (it.key) _obj[it.key] = it.ID;
      });
      return _obj;
    },
    isHistogram: { // 柱状图
      get() {
        return this.iconStylesObj && this.ChartList.includes(this.iconStylesObj.histogram);
      },
      set() {
        this.setIconStyleValue('histogram');
      },
    },
    isLineChart: { // 折线图
      get() {
        return this.iconStylesObj && this.ChartList.includes(this.iconStylesObj.lineChart);
      },
      set() {
        this.setIconStyleValue('lineChart');
      },
    },
    isPieChart: { // 饼状图
      get() {
        return this.iconStylesObj && this.ChartList.includes(this.iconStylesObj.pieChart);
      },
      set() {
        this.setIconStyleValue('pieChart');
      },
    },
    TimeSpan: { // 日期分组
      get() {
        return this.condition4SaveForm.TimeSpan;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['TimeSpan'], val]);
      },
    },
    ShowTimeRate: { // 显示占比(日期时间)
      get() {
        return this.condition4SaveForm.ShowTimeRate;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['ShowTimeRate'], val]);
      },
    },
    ShowYoy: { // 显示同比(日期时间)
      get() {
        return this.condition4SaveForm.ShowYoy;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['ShowYoy'], val]);
      },
    },
    rowSummaryChecked: { // 行  汇总
      get() {
        return this.condition4SaveForm.Row.ShowSummary;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['Row', 'ShowSummary'], val]);
      },
    },
    rowProportionChecked: { // 行  占比
      get() {
        return this.condition4SaveForm.Row.ShowRate;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['Row', 'ShowRate'], val]);
      },
    },
    columnSummaryChecked: { // 列  汇总
      get() {
        return this.condition4SaveForm.Column.ShowSummary;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['Column', 'ShowSummary'], val]);
      },
    },
    columnProportionChecked: { // 列  占比
      get() {
        return this.condition4SaveForm.Column.ShowRate;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['Column', 'ShowRate'], val]);
      },
    },
    ChartList: {
      get() {
        return this.condition4SaveForm.ChartList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['ChartList', ''], val]);
      },
    },
    SplitType: { // 数据拆分
      get() {
        return this.condition4SaveForm.SplitType;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['SplitType'], val]);
      },
    },
  },
  watch: {
    validOptionList(newVal) {
      if (!newVal) return;
      if (this.condition4SaveForm.Row.Type || this.condition4SaveForm.Row.Type === 0) {
        const t = newVal.find(it => it.ID === this.condition4SaveForm.Row.Type);
        if (!t) this.$store.commit('statistic/setConditionForSaveForm', [['Row', 'Type'], '']);
      }
      if (this.condition4SaveForm.Column.Type || this.condition4SaveForm.Column.Type === 0) {
        const t = newVal.find(it => it.ID === this.condition4SaveForm.Column.Type);
        if (!t) this.$store.commit('statistic/setConditionForSaveForm', [['Column', 'Type'], '']);
      }
    },
  },
  methods: {
    ...mapMutations('statistic', ['setConditionForSaveForm']),
    setIconStyleValue(key) { // 设置图标样式
      if (!this.iconStylesObj) return;
      if (!this.ChartList.includes(this.iconStylesObj[key])) {
        const _list = [...this.ChartList, this.iconStylesObj[key]];
        this.ChartList = _list;
      } else {
        this.ChartList = this.ChartList.filter(it => it !== this.iconStylesObj[key]);
      }
    },
  },
};
</script>

<style lang='scss'>
.mp-statistic-analyse-add-edit-page-content-right-wrap {
  padding-top: 12px;
  > li {
    display: flex;
    padding-left: 40px;
    padding-top: 16px;
    padding-bottom: 16px;
    > span {
      width: 80px;
      flex: none;
      text-align: right;
      margin-right: 10px;
      font-size: 14px;
      color: #888E99;
    }
    &:first-of-type, &:last-of-type {
      > span {
        padding-top: 2px;
      }
      > div {
        .el-radio__label, > p .el-checkbox__label {
          font-size: 12px;
          color: #585858;
        }
        > p {
          margin-top: 15px;
        }
      }
    }
    > div.flex-show {
      display: flex;
      > .mp-common-comps-order-channel-selector-wrap {
        padding-right: 50px;
        margin-top: -6px;
        margin-left: 0;
        .mp-common-select-comp-wrap .el-input > input {
          width: 140px;
          padding-left: 9px;
          font-size: 12px;
          height: 28px;
        }
      }
      .el-checkbox__label {
        font-size: 12px;
        color: #585858;
      }
    }
    &.icon-select-box {
      margin-top: 40px;
      margin-bottom: 4px;
      > ul {
        display: flex;
        margin-left: 2px;
        > li {
          width: 152px;
          > div {
            width: 60px;
            height: 41px;
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            cursor: pointer;
            transition: transform 0.05s ease-in-out;
            user-select: none;
            &:hover + .el-checkbox  {
              .el-checkbox__label {
                text-decoration: underline;
              }
            }
            &:active {
              transform: scale(0.88);
            }
          }
          .el-checkbox {
            .el-checkbox__label {
              font-size: 12px;
            }
            &:hover .el-checkbox__label {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
