<template>
  <section class="mp-erp-product-list-page-product-formula-list-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <FormulaTableCrtlComp @setup='onFormulaSaveClick' :UseModule='1' v-if="ProductID" :formulaH='222' :PositionID='ProductID' PositionType='ProductID' />
      <SubFormulaTableCrtlComp @filter='onSubFormulaFilterClick'
       @setup='onSubFormulaSaveClick' v-if="ProductID" :formulaH='222' @add='onSubFormulaAddClick' :PositionID='ProductID' PositionType='ProductID' />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import FormulaTableCrtlComp from '@/components/common/FormulaAndConditionComps/FormulaTableCrtlComp.vue';
import SubFormulaTableCrtlComp from '@/components/common/FormulaAndConditionComps/SubFormulaTableCrtlComp.vue';

export default {
  name: 'ProductFormulaListPage',
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
  computed: {
    ...mapState('productManage', ['ProductManageList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      // this.getProductOrderData();
    },
    onFormulaSaveClick(data) { // 公式添加与编辑
      this.$store.commit('productManage/setCurEditFormulaData', data);
      const path = `/ProductFormulaSet/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/1/${Date.now()}`;
      this.$router.push(path);
    },
    onSubFormulaFilterClick(data) { // 子公式数据筛选
      this.$store.commit('productManage/setCurSubFormulaAddProperty', null);
      this.$store.commit('productManage/setCurEditSubFormulaData', data);
      const path = `/ProductFormulaFilter/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/15/${Date.now()}`;
      this.$router.push(path);
    },
    onSubFormulaSaveClick(data) { // 子公式编辑
      this.$store.commit('productManage/setCurSubFormulaAddProperty', null);
      this.$store.commit('productManage/setCurEditSubFormulaData', data);
      const path = `/ProductFormulaSet/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/2/${Date.now()}`;
      this.$router.push(path);
    },
    onSubFormulaAddClick(prop) { // 子公式添加
      this.$store.commit('productManage/setCurEditSubFormulaData', null);
      this.$store.commit('productManage/setCurSubFormulaAddProperty', prop);
      const path = `/ProductFormulaSet/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/2/${Date.now()}`;
      this.$router.push(path);
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-formula-list-page-wrap {
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
