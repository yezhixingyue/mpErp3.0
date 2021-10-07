<template>
  <section class="mp-statistic-analyse-list-page-wrap">
    <header>
      <el-button @click="onFormAddClick">添加统计表</el-button>
      <order-channel-selector
        :options='filterTypeList'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :typeList="[['Type', '']]"
        :value='condition4DataList.Type'
        label="数据类型"
       />
    </header>
    <main>
      <StatisticFormListTable :class="isScroll ? 'opacity-0' : ''" />
    </main>
    <footer>
      <Count
       center
       :watchPage='condition4DataList.Page'
       :handlePageChange='handlePageChange'
       :count='statisticFormDataNumber'
       :pageSize='condition4DataList.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import StatisticFormListTable from '@/components/StatisticAnalyseComps/StatisticFormListTable.vue';
import Count from '@/components/common/Count.vue';
import { mapState } from 'vuex';

export default {
  name: 'StatisticAnalyseListPage',
  components: {
    Count,
    OrderChannelSelector,
    StatisticFormListTable,
  },
  computed: {
    ...mapState('statistic', ['condition4DataList', 'statisticFormDataNumber']),
    ...mapState('common', ['StatisticalFormTypeList']),
    filterTypeList() {
      if (!this.StatisticalFormTypeList || this.StatisticalFormTypeList.length === 0) return [];
      return [{ ID: '', name: '不限' }, ...this.StatisticalFormTypeList];
    },
  },
  data() {
    return {
      isScroll: false,
    };
  },
  methods: {
    onFormAddClick() {
      // this.handlePageLeave();
      this.$store.commit('statistic/setCondition4SaveFormInit', null);
      this.$router.push({ name: 'StatisticalFormSetting', params: { type: 'add' } });
    },
    getDataList(page = 1) {
      this.$store.dispatch('statistic/getStatisticFormDataList', page);
    },
    setCondition4DataList(data) {
      this.$store.commit('statistic/setConsidtion4DataList', data);
    },
    handlePageChange(page) {
      this.getDataList(page);
    },
    // handlePageLeave() {
    //   const oDiv = document.getElementsByClassName('el-table__body-wrapper')[0];
    //   console.log(oDiv, this.$route);
    // },
  },
  // beforeRouteLeave(to, from, next) {
  //   const obj = from;
  //   if (to.name === 'StatisticFormView' || to.name === 'StatisticalFormSetting') {
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
  //     if ((from.name !== 'StatisticFormView' && from.name !== 'StatisticalFormSetting') || vm.statisticFormDataNumber === 0) vm.getDataList(vm.condition4DataList.Page);
  //     if (to.meta.scroll && !(from.params.type && from.params.type === 'add')) {
  //       const t = vm;
  //       t.isScroll = true;
  //       const oDiv = document.getElementsByClassName('el-table__body-wrapper')[0];
  //       setTimeout(() => {
  //         if (oDiv) oDiv.scrollTop = to.meta.scroll;
  //         t.isScroll = false;
  //       }, 0);
  //     }
  //   });
  // },
  mounted() {
    this.$store.commit('statistic/clearConsidtion4DataList');
    this.getDataList();
  },
};
</script>

<style lang='scss'>
.mp-statistic-analyse-list-page-wrap {
  > header {
    padding: 30px 20px;
    display: flex;
    align-items: center;
    height: 90px;
    box-sizing: border-box;
    > button {
      width: 110px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      color: #fff;
      font-size: 14px;
      background-color: #26BCF9;
      border-color: #26BCF9;
      margin-right: 92px;
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
