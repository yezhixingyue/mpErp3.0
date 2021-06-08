<template>
  <section class="mp-statistic-panel-list-page-wrap">
    <header>
      <el-button @click="onSummaryPanelAddClick">添加汇总面板</el-button>
    </header>
    <main>
      <StatisticSummaryListTable :class="isScroll ? 'opacity-0' : ''" />
    </main>
    <footer>
      <Count
       center
       :watchPage='considtion4SummaryList.Page'
       :handlePageChange='handlePageChange'
       :count='statisticSummaryDataNumber'
       :pageSize='considtion4SummaryList.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import StatisticSummaryListTable from '@/components/StatisticAnalyseComps/StatisticSummaryListTable.vue';
import Count from '@/components/common/Count.vue';
import { mapState } from 'vuex';

export default {
  components: {
    Count,
    StatisticSummaryListTable,
  },
  computed: {
    ...mapState('statistic', ['considtion4SummaryList', 'statisticSummaryDataNumber']),
  },
  data() {
    return {
      isScroll: false,
    };
  },
  methods: {
    onSummaryPanelAddClick() {
      this.$router.push({ name: 'StatisticalSummarySetting', params: { type: 'add' } });
    },
    handlePageChange(page) {
      this.$store.dispatch('statistic/getStatisticSummaryDataList', page);
    },
  },
  // beforeRouteLeave(to, from, next) {
  //   const obj = from;
  //   if (to.name === 'StatisticSummaryView' || to.name === 'StatisticalSummarySetting') {
  //     const oDiv = document.getElementsByClassName('el-table__body-wrapper')[0];
  //     obj.meta.scroll = oDiv.scrollTop;
  //   } else {
  //     obj.meta.scroll = 0;
  //   }
  //   next();
  // },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len
  //     if ((from.name !== 'StatisticSummaryView' && from.name !== 'StatisticalSummarySetting') || vm.statisticSummaryDataNumber === 0) vm.$store.dispatch('statistic/getStatisticSummaryDataList', vm.considtion4SummaryList.Page);
  //     if (to.meta.scroll && !(from.params.type && from.params.type === 'add')) {
  //       const t = vm;
  //       t.isScroll = true;
  //       const oDiv = document.getElementsByClassName('el-table__body-wrapper')[0];
  //       setTimeout(() => {
  //         oDiv.scrollTop = to.meta.scroll;
  //         t.isScroll = false;
  //       }, 0);
  //     }
  //   });
  // },
  mounted() {
    this.$store.dispatch('statistic/getStatisticSummaryDataList');
  },
};
</script>

<style lang='scss'>
.mp-statistic-panel-list-page-wrap {
  > header {
    padding: 30px 20px;
    > button {
      width: 110px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      color: #fff;
      font-size: 14px;
      background-color: #26BCF9;
      border-color: #26BCF9;
      &:hover, &:focus {
        background-color: rgba($color: #26BCF9, $alpha: 0.7);
        border-color: rgba($color: #26BCF9, $alpha: 0.7);
        color: #fff;
      }
      &:active {
        background-color: #428dfa;
        border-color: #428dfa;
        color: #fff;
      }
    }
  }
  > main .opacity-0 {
    opacity: 0;
  }
  > footer {
    padding-top: 8px;
  }
}
</style>
