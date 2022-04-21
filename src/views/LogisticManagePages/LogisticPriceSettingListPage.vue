<template>
  <section class="mp-erp-logistic-price-setting-list-page-wrap">
    <header>
      <el-button type="primary" size="small" @click="onFormulaSetupClick(null)">+添加价格</el-button>
    </header>
    <main>
      <ResultFormulaTableCom
        :title="`${name}价格列表`"
        :operationTitle='`${name}价格`'
        hiddenTip
        usePropList
        showName
        :FormulaList='logisticItemFormulaList'
        :PropertyList='logisticItemConditionPropertyList'
        :isLoading='loading'
        @setup='onFormulaSetupClick' @remove="onFormulaRemove"
       />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ResultFormulaTableCom from '@/components/PriceComps/PriceTableItem/ResultFormulaTableCom.vue';

export default {
  name: 'LogisticPriceSettingListPage',
  components: {
    ResultFormulaTableCom,
  },
  computed: {
    ...mapState('basicSet', ['logisticItemFormulaList', 'logisticItemConditionPropertyList', 'loading']),
  },
  data() {
    return {
      LogisticsID: '',
      name: '',
    };
  },
  methods: {
    onGoBackClick() { // 返回页面
      this.$goback();
    },
    getInitData() {
      const { id, name } = this.$route.params;
      this.LogisticsID = id;
      this.name = name;
    },
    onFormulaSetupClick(item) {
      this.$store.commit('basicSet/setCurEditFormulaData', item);
      this.$router.push({ name: 'LogisticPriceSetup', params: { id: this.LogisticsID, name: this.name } });
    },
    onFormulaRemove({ ID }) {
      this.$store.dispatch('basicSet/getLogisticItemFormulaRemove', { ID, LogisticsID: this.LogisticsID });
    },
  },
  async mounted() {
    this.getInitData();
    await this.$store.dispatch('basicSet/getLogisticsItemFormulaList', { LogisticsID: this.LogisticsID });
    if (this.logisticItemFormulaList.length > 0) {
      this.$store.dispatch('common/fetchAdAreaList');
      this.$store.dispatch('common/getProductClassifyData');
      this.$store.dispatch('common/getAllProductNames');
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-logistic-price-setting-list-page-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-left: 8px;
  > header {
    height: 60px;
    background: #fff;
    flex: none;
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin-bottom: 10px;
    button {
      font-size: 14px;
      width: 120px;
    }
  }
  > main {
    flex: 1;
    background: #fff;
    padding: 0 20px;
    .mp-erp-price-module-price-table-result-formula-table-comp-container > header {
      padding-bottom: 20px;
      > .blue-span {
        display: none;
      }
    }
    .mp-erp-price-module-price-table-result-formula-table-comp-container > main > div >  {
      .part-name {
        width: 400px;
      }
      .priority-box {
        width: 70px;
        min-width: 40px;
      }
      .ctrl-menus-container {
        width: 160px;
      }
    }
  }
  > footer {
    flex: none;
    background: #fff;
    padding: 20px;
    text-align: center;
    padding-right: 120px;
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
