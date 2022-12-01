<template>
  <section class="mp-statistic-summary-chart-view-page-wrap">
    <header>
      <p class="mp-common-title-wrap">查看汇总面板(此处应为动态标题)</p>
    </header>
    <main class="mp-scroll-wrap">内容区
      <div></div>
    </main>
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'StatisticSummaryViewPage',
  methods: {
    onGoBackClick() {
      this.$router.replace('/StatisticalSummary');
    },
  },
};
</script>
<style lang='scss'>
.mp-statistic-summary-chart-view-page-wrap {
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  height: 100%;
  padding-right: 15px;
  > header {
    padding: 30px 50px 30px 0;
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
    padding-top: 20px;
    padding-right: 30px;
    padding-bottom: 32px;
    flex: none;
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
