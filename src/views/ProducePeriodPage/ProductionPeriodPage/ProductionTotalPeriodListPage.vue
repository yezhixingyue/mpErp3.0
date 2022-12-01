<template>
  <section class="mp-product-production-total-period-list-page" v-if="curSetupProduct">
    <header>
      <p>
        <label>当前产品：</label>
        <span>{{curSetupProduct.Name}}</span>
      </p>
    </header>
    <main>
      <ResultFormulaTableComp
       title="总工期列表"
       operationTitle='总工期条目'
       hiddenTip
       usePropList
       :FormulaList='PeriodItemFormulaList'
       :PropertyList='PeriodItemConditionPropertyList'
       :isLoading='loading'
       :allAdAreaTreeList="allAdAreaTreeList"
       :allProductClassify="allProductClassify"
       :allAreaTreeList="allAreaTreeList"
       @setup='onFormulaSetupClick' @remove="onFormulaRemove"
       />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { ResultFormulaTableComp } from '@/components/common/mpzj-sell-lib/lib';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'ProductionTotalPeriodListPage',
  components: {
    ResultFormulaTableComp,
  },
  computed: {
    ...mapState('periodManage', ['loading', 'PeriodItemFormulaList', 'PeriodItemConditionPropertyList']),
    ...mapGetters('periodManage', ['curSetupProduct']),
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allAreaTreeList']),
    params4FormulaList() { // 获取公式列表的params参数
      return { UseModule: 10, ProductID: this.curSetupProduct.ID };
    },
    params4FormulaConditionPropertyList() { // 获取公式条件属性列表的params参数
      return { UseModule: 45, ProductID: this.curSetupProduct.ID };
    },
  },
  methods: {
    onGoBackClick() { // 返回页面
      this.$goback();
    },
    getPriceTableList() { // 获取列表数据
      this.$store.dispatch('periodManage/getPeriodItemFormulaList', {
        params4FormulaList: this.params4FormulaList,
        params4FormulaConditionPropertyList: this.params4FormulaConditionPropertyList,
      });
    },
    onFormulaSetupClick(item) { // 工期公式 添加与编辑
      this.$store.commit('periodManage/setCurEditFormulaData', item);
      this.$router.push({ name: 'ProductionTotalPeriodSetup', params: {} });
    },
    onFormulaRemove({ ID }) { // 工期公式删除
      this.$store.dispatch('periodManage/getPeriodItemFormulaRemove', { ID, isTotal: true });
    },
  },
  mounted() {
    this.$store.commit('periodManage/setPeriodItemFormulaList', [[], []]);
    this.getPriceTableList();
  },
};
</script>
<style lang='scss'>
.mp-product-production-total-period-list-page {
  background-color: #f5f5f5;
  padding: 8px;
  padding-top: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    background-color: #fff;
    flex: 0;
    padding: 20px;
    > p {
      color: #21CAE3;
      font-size: 15px;
      font-weight: 700;
      padding-bottom: 15px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    padding: 20px;
    > .mp-erp-price-module-price-table-result-formula-table-comp-container {
      padding-top: 0;
    }
  }
  > footer {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    padding-right: 120px;
    flex: none;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      &:last-of-type {
        color: #26BCF9;
        margin-left: 30px;
      }
    }
  }
}
</style>
