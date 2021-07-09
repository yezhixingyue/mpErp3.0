<template>
  <section class="mp-erp-material-type-page-formula-list-page-wrap" v-if="PositionID">
    <header>
      <span>当前物料类型：</span>
      <span>{{materialTypeName}}</span>
    </header>
    <main>
      <FormulaTableCrtlComp @setup='onFormulaSetupClick' :UseModule='0' :PositionID='PositionID' PositionType='MaterialTypeID' />
    </main>
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import FormulaTableCrtlComp from '@/components/common/FormulaAndConditionComps/FormulaTableCrtlComp.vue';

export default {
  name: 'MaterialFormulaListPage',
  data() {
    return {
      PositionID: '',
      materialTypeName: '',
    };
  },
  components: {
    FormulaTableCrtlComp,
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) return;
      const { id, name } = this.$route.params;
      if (!id || !name) return;
      this.PositionID = id;
      this.materialTypeName = name;
    },
    onGoBackClick() {
      this.$router.replace('/MaterialTypeList');
    },
    onFormulaSetupClick(data) {
      if (!this.PositionID || !this.materialTypeName) return;
      this.$store.commit('basicSet/setNowEditFormulaData', data);
      this.$router.push(`/MaterialFormulaSetup/${this.PositionID}/${this.materialTypeName}/${Date.now()}`);
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-material-type-page-formula-list-page-wrap {
  padding-left: 20px;
  height: 100%;
  padding-bottom: 105px;
  box-sizing: border-box;
  > header {
    padding: 30px 0;
    padding-bottom: 45px;
    line-height: 15px;
    box-sizing: border-box;
    // height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
  }
  > footer {
    text-align: center;
    padding: 25px;
    padding-top: 60px;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      color: #26BCF9;
    }
  }
}
</style>
