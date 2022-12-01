<template>
  <section class="mp-erp-review-statistics-list-page-wrap">
    <ReviewStatisticsHeader :condition="condition" :setCondition="setCondition" :getList="getList" />
    <main>
      <ReviewStatisticsTable :datas="datas" :loading="loading" :condition="condition" />
    </main>
    <ReviewStatisticsFooter :condition="condition" :dataNumber="dataNumber" :getList="getList" />
  </section>
</template>

<script>
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import ReviewStatisticsHeader from '../../../components/ReviewComps/ReviewStatistics/ReviewStatisticsHeader.vue';
import ReviewStatisticsTable from '../../../components/ReviewComps/ReviewStatistics/ReviewStatisticsTable/ReviewStatisticsTable.vue';
import ReviewStatisticsFooter from '../../../components/ReviewComps/ReviewStatistics/ReviewStatisticsFooter.vue';
import ConditionClass from './TypeClass/ConditionClass';

export default {
  name: 'reviewStatisticsPage',
  mixins: [recordScrollPositionMixin('.mp-erp-review-statistics-list-page-wrap .mp-erp-review-statistics-list-page-table-wrap')],
  components: {
    ReviewStatisticsHeader,
    ReviewStatisticsTable,
    ReviewStatisticsFooter,
  },
  data() {
    return {
      condition: new ConditionClass(),
      datas: null,
      dataNumber: 0,
      loading: false,
    };
  },
  methods: {
    setCondition([[key1, key2], value]) { // 设置条件
      ConditionClass.setCondition(this.condition, [[key1, key2], value]);
    },
    async getList(Page = 1) {
      this.condition.Page = Page;
      const temp = this.condition.getFilterObj();

      this.datas = null;
      this.loading = true;
      const resp = await this.api.getCheckFileStatistics(temp).catch(() => null);
      this.loading = false;

      if (resp?.data.Status === 1000) {
        const list = resp.data.Data || null;
        this.datas = list;
        this.dataNumber = resp.data.DataNumber || 0;
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang='scss'>
.mp-erp-review-statistics-list-page-wrap {
  padding-left: 28px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  > main {
    flex: 1;
    margin-top: 10px;
    overflow: hidden;
  }
  > header, > footer {
    flex: none;
  }
}
</style>
