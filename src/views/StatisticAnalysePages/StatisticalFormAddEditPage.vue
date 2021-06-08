<template>
  <section class="mp-statistic-analyse-add-edit-page-wrap">
    <header>
      <p class="mp-common-title-wrap">配置统计表</p>
    </header>
    <div class="content" element-loading-text="正在加载数据"> <!-- v-loading='isDataIniting' -->
      <template v-if="condition4SaveForm && !isDataIniting">
        <PageContentLeft />
        <PageContentRight />
      </template>
    </div>
    <footer>
      <el-button type="primary" @click="onSubmitClick" class="is-blue-button">保存</el-button>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import PageContentLeft from '@/components/StatisticAnalyseComps/AddEditPageComps/PageContentLeft.vue';
import PageContentRight from '@/components/StatisticAnalyseComps/AddEditPageComps/PageContentRight.vue';
import { mapState } from 'vuex';

export default {
  components: {
    PageContentLeft,
    PageContentRight,
  },
  computed: {
    ...mapState('statistic', ['condition4SaveForm', 'considtion4DataList']),
  },
  data() {
    return {
      isDataIniting: false,
    };
  },
  methods: {
    onSubmitClick() {
      this.$store.dispatch('statistic/getStatisticFormSave', async () => {
        await this.$store.dispatch('statistic/getStatisticFormDataList', this.considtion4DataList.Page);
        this.onGoBackClick();
      });
    },
    onGoBackClick() {
      this.$store.commit('statistic/setCondition4SaveFormInit', null);
      this.$router.replace('/StatisticalList');
    },
    async getInitDetailData(isCreated) {
      if (this.$route.params.type === 'edit' && this.$route.query.id) {
        this.isDataIniting = true;
        await this.$store.dispatch('statistic/getStatisticsConfigDetail', this.$route.query.id);
        this.isDataIniting = false;
      } else if (isCreated) {
        this.$router.replace('/StatisticalList');
      }
    },
  },
  created() {
    this.getInitDetailData(true);
  },
  activated() {
    this.getInitDetailData(false);
  },
};
</script>

<style lang='scss'>
.mp-statistic-analyse-add-edit-page-wrap {
  // width: 100vw;
  > header {
    padding: 25px 50px;
  }

  > .content {
    display: flex;
    min-height: 811px;
    > section, > ul {
      flex: none;
      height: 811px;
      overflow: auto;
      box-sizing: border-box;
    }
    > section {
      width: 875px;
      border-right: 1px solid #eee;
      padding-left: 20px;
      padding-right: 60px;
    }
    > ul {
      min-width: 650px;
    }
    .el-loading-spinner {
      top: 40%;
    }
  }

  > footer {
    text-align: center;
    padding-top: 40px;
    padding-right: 30px;
    > button {
      width: 120px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      margin-right: 30px;
      margin-left: 0 !important;
    }
  }
}
</style>
