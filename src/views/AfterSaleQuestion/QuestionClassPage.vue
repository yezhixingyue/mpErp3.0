<template>
  <section class="mp-erp-question-class-page-wrap">
    <p><span>管理问题分类：</span><i v-if="this.paramsData">{{ this.paramsData.DivideName }}</i></p>
    <ClassifyContentComp :classifyData='classifyData' title='产品' v-if="this.paramsData"
     @goback='onGobackClick' :DivideID="paramsData.ID" @sort='onSortSuccess' :fetchData='fetchClassifyData' />
  </section>
</template>

<script>
import ClassifyContentComp from '@/components/AfterSaleQuestion/ClassifyContentComp.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ProductClassifyManagePage',
  components: {
    ClassifyContentComp,
  },
  computed: {
    ...mapState('AfterSaleQuestion', ['OrderAfterSaleQuestionClassList']),
    ...mapGetters('common', ['twoLevelsMultipleProductClassifyList4Sort']),
    classifyData() {
      if (this.OrderAfterSaleQuestionClassList.length === 0) return [];
      const t = this.OrderAfterSaleQuestionClassList.map(it => ({
        ClassName: it.Name,
        ID: it.ID,
        Level: 1,
        ParentID: -1,
        children: it.SonClassList.map(el => ({
          ClassName: el.Name,
          ID: el.ID,
          Level: 2,
          ParentID: it.ID,
        })),
      }));
      return t;
    },
  },
  data() {
    return {
      paramsData: null,
    };
  },
  methods: {
    onGobackClick() {
      this.$router.replace('/ResponsibilityMeasure');
    },
    async fetchClassifyData() {
      const resBool = await this.$store.dispatch(
        'AfterSaleQuestion/getOrderAfterSaleQuestionClassList',
        { searchType: 0, ID: this.paramsData.ID },
      );
      return resBool;
    },
    onSortSuccess() {
      // this.$store.commit('common/setProductMultipleClassifyList', { ID: this.radio, Type: this.curType, List });
    },
  },
  mounted() {
    this.paramsData = this.$route.params.item;
  },
};
</script>
<style lang='scss'>
.mp-erp-question-class-page-wrap {
  height: 100%;
  >p{
    padding: 20px 20px 0px 20px;
    >span{
      font-weight: 700;
    }
  }
  > .mp-erp-common-classify-manage-comp-wrap {
    height:calc(100% - 70px);
  }
}
</style>
