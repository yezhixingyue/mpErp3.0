<template>
  <section class="mp-statistic-form-chart-view-page-wrap">
    <header>
      <p class="mp-common-title-wrap">查看统计表(此处应为动态标题)</p>
      <DateAndChartTypeSetupComp />
      <hr>
    </header>
    <main class="mp-scroll-wrap">
      <EChartComp title="第一个统计表标题" />
      <EChartComp echartType='line' title="第二个统计表标题" />
      <EChartComp echartType='pie' title="第3个统计表标题" />
    </main>
    <footer>
      <!-- <hr> -->
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import EChartComp from '@/components/StatisticAnalyseComps/ChartComps/EChartComp.vue';
import DateAndChartTypeSetupComp from '@/components/StatisticAnalyseComps/ChartComps/DateAndChartTypeSetupComp.vue';

export default {
  components: {
    EChartComp,
    DateAndChartTypeSetupComp,
  },
  methods: {
    onGoBackClick() {
      this.$router.replace('/StatisticalList');
    },
  },
};
</script>
<style lang='scss'>
.mp-statistic-form-chart-view-page-wrap {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  height: 100%;
  padding-right: 15px;
  > header {
    padding: 20px 10px 10px 0;
    > p {
      padding-bottom: 8px;
    }
    > hr {
      padding-top: 9px;
      // color: #cbcbcb;
      background-color:#eee;
      border:0;
      height:1px;
      margin: 0 -25px 0 -20px;
    }
    > ul {
      margin-bottom: 18px;
    }
    flex: none;
  }
  > main {
    font-size: 14px;
    padding-top: 10px;
    flex: 1;
    overflow: auto;
  }
  > footer {
    text-align: center;
    padding-right: 10px;
    padding-bottom: 15px;
    // padding: 12px 10px 15px 0;
    padding-top: 15px;
    flex: none;
    // border-top: 1px solid #eee;
    box-shadow: 0px 1px 4px #ddd inset, 0px 1px 6px #ddd;
    margin: 0 -15px 0 -20px;
    > hr {
      margin-bottom: 10px;
      border:0;
      background-color:#cbcbcb;
      height:1px;
    }
    > button {
      width: 120px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      margin-right: 20px;
      color: #26BCF9;
      border-color: #26BCF9;
      // margin-left: 0 !important;
    }
  }
}
</style>
