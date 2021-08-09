<template>
  <section class="mp-erp-price-module-craft-price-total-price-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
      <span class="name">设置工艺：{{curCraft.Name}}</span>
    </header>
    <main>
      <ResultFormulaTableCom
       @setup='onFormulaSetupClick' @remove="onFormulaRemove"
       :fetchFormulaListData='fetchFormulaListData' />
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
  name: 'CraftTotalPriceSetPage',
  components: {
    ResultFormulaTableCom,
  },
  computed: {
    ...mapState('priceManage', ['curCraftPriceItemData', 'curPriceItem']),
    curCraft() {
      return this.curCraftPriceItemData.Craft || {};
    },
    fetchFormulaListData() {
      return {
        PriceID: this.curPriceItem?.ID || '',
        CraftPriceID: this.curCraftPriceItemData?.Craft?.CraftPriceID || '',
      };
    },
  },
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      // ProductData: null,
    };
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    // async getProductData() {
    //   const data = await this.$store.dispatch('priceManage/getProductCraftData', this.ProductID);
    //   this.ProductData = data;
    // },
    async onFormulaRemove(e) { // 公式删除
      const resp = await this.api.getFormulaRemove(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setResultFormulaItemRemove', e);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    onFormulaSetupClick(data) {
      console.log('onFormulaSetupClick 跳转配置页面', data);
      const { params } = this.$route;
      // this.$store.commit('priceManage/setCurSolutionItem', this.curSolutionItem);
      // this.$store.commit('priceManage/setCurEditPriceItemData', data);
      // this.$store.commit('priceManage/setResultFormulaList', []);
      this.$store.commit('priceManage/setCurPriceTableItemResultFormulaInfo', [null, data]);
      this.$router.push({ name: 'CraftAllCostFormulaSet', params: { ...params, isAllCost: true } });
    },
  },
  created() {
    this.$store.commit('priceManage/setResultFormulaList', []);
    this.$store.dispatch('priceManage/getConditionPropertyList', this.$route.params.id);
  },
  mounted() {
    if (!this.curPriceItem || !this.curCraftPriceItemData || !this.curCraftPriceItemData.Craft) {
      this.$goback();
      return;
    }
    const { ID, Name } = this.curPriceItem;
    this.PriceID = ID;
    this.PriceName = Name;
    this.ProductID = this.$route.params.id;
    this.ProductName = this.$route.params.name;
    // this.getProductData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-craft-price-total-price-set-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 20px;
    line-height: 15px;
    box-sizing: border-box;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    .name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
      & + .name {
        margin-left: 40px;
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    padding-left: 5px;
    .mp-common-title-wrap {
      color: #444;
      font-size: 15px;
      &::before {
        height: 15px;
      }
    }
    &.loading {
      opacity: 0.2;
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    padding-bottom: 5px;
    // width: 1100px;
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
