<template>
  <section class="mp-erp-question-class-page-wrap">
    <p><span>问题分类名称：</span></p>
    <ClassifyContentComp :classifyData='classifyData' title='问题'
     @goback='onGobackClick' @sort='onSortSuccess' :fetchData='fetchClassifyData' />
  </section>
</template>

<script>
import ClassifyContentComp from '@/components/AfterSaleQuestion/ClassifyContentComp.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'QuestionClassPage',
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
    };
  },
  methods: {
    onGobackClick() {
      this.$router.replace('/AfterSalesList');
    },
    async fetchClassifyData() {
      const resBool = await this.$store.dispatch(
        'AfterSaleQuestion/getOrderAfterSaleQuestionClassList',
        { searchType: 2 },
      );
      return resBool;
    },
    onSortSuccess() {
      // this.$store.commit('common/setProductMultipleClassifyList', { ID: this.radio, Type: this.curType, List });
    },
  },
  mounted() {
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
