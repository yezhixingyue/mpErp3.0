<template>
  <section class="mp-erp-price-list-page-price-formula-list-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <FormulaTableCrtlComp @setup='onFormulaSaveClick' :UseModule='3' v-if="ProductID" :formulaH='222' :PositionID='ProductID' PositionType='ProductID' />
      <SubFormulaTableCrtlComp @filter='onSubFormulaFilterClick' :UseModule='4'
       @setup='onSubFormulaSaveClick' v-if="ProductID" :formulaH='222' @add='onSubFormulaAddClick' :PositionID='ProductID' PositionType='ProductID' />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import FormulaTableCrtlComp from '@/components/common/FormulaAndConditionComps/FormulaTableCrtlComp.vue';
import SubFormulaTableCrtlComp from '@/components/common/FormulaAndConditionComps/SubFormulaTableCrtlComp.vue';

export default {
  name: 'PriceFormulaListPage',
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      FormulaList: [],
    };
  },
  components: {
    FormulaTableCrtlComp,
    SubFormulaTableCrtlComp,
  },
  methods: {
    getPositionID() {
      const { id, name } = this.$route.params;
      this.ProductID = id;
      this.ProductName = name;
    },
    onFormulaSaveClick(data) { // 公式添加与编辑
      this.$store.commit('priceManage/setCurEditFormulaData', data);
      const path = `/PriceFormulaSet/${this.ProductID}/${this.ProductName}/3/false`;
      this.$router.push(path);
    },
    onSubFormulaFilterClick(data) { // 子公式数据筛选
      this.$store.commit('priceManage/setCurSubFormulaAddProperty', null);
      this.$store.commit('priceManage/setCurEditSubFormulaData', data);
      const path = `/PriceFormulaFilter/${this.ProductID}/${this.ProductName}/28`;
      this.$router.push(path);
    },
    onSubFormulaSaveClick(data) { // 子公式编辑
      this.$store.commit('priceManage/setCurSubFormulaAddProperty', null);
      this.$store.commit('priceManage/setCurEditSubFormulaData', data);
      const path = `/PriceFormulaSet/${this.ProductID}/${this.ProductName}/4/true`;
      this.$router.push(path);
    },
    onSubFormulaAddClick(prop) { // 子公式添加
      this.$store.commit('priceManage/setCurEditSubFormulaData', null);
      this.$store.commit('priceManage/setCurSubFormulaAddProperty', prop);
      const path = `/PriceFormulaSet/${this.ProductID}/${this.ProductName}/4/true`;
      this.$router.push(path);
    },
    onGoBackClick() {
      this.$router.replace('/PriceManageList');
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-list-page-price-formula-list-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 40px;
    line-height: 15px;
    box-sizing: border-box;
    height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
  }
  > main {
    flex: 1;
    padding-top: 15px;
    .mp-erp-common-comps-formula-table-common-comp-wrap {
      margin-bottom: 55px;
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
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
