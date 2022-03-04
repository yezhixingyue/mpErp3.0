<template>
  <section class="mp-erp-price-module-craft-price-total-price-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
      <span class="name">设置工艺：{{curCraft.Name}}</span>
      <p class="tips-box">
        <i class="el-icon-warning"></i>
        <span>注：工艺最终费用以下列公式运算结果为准，如果匹配不到任何公式，则此工艺费用为空。</span>
      </p>
    </header>
    <main>
      <ResultFormulaTableCom
        ref="oTable"
       title="总费用公式列表"
       hiddenTip
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
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

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
    PartID() {
      return this.curCraftPriceItemData?.PartID || '';
    },
    fetchFormulaListData() {
      return {
        ProductID: this.ProductID,
        PartID: this.PartID,
        PriceID: this.curPriceItem?.ID || '',
        CraftPriceID: this.curCraftPriceItemData?.Craft?.CraftPriceID || '',
        UseModule: 7,
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
      // this.$goback();
      const { params } = this.$route;
      this.$router.replace({
        name: 'CraftPriceSetPage',
        params,
      });
    },
    // async getProductData() {
    //   const data = await this.$store.dispatch('priceManage/getProductCraftData', this.ProductID);
    //   this.ProductData = data;
    // },
    async onFormulaRemove(e) { // 公式删除
      const resp = await this.api.getFormulaRemove(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setResultFormulaItemRemove', [e, true]);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async onFormulaSetupClick(data) {
      if (!data && this.$refs.oTable && this.$refs.oTable.localTableData && this.$refs.oTable.localTableData.length === 0) {
        await this.$store.dispatch('priceManage/getCraftPriceIDAndSetToCurItem', this.PriceID);
      }
      const { params } = this.$route;
      this.$store.commit('priceManage/setCurPriceTableItemResultFormulaInfo', [null, data]);
      this.$router.push({ name: 'CraftAllCostFormulaSet', params: { ...params, isAllCost: true } });
    },
    async getConditionPropertyList() {
      this.$store.commit('priceManage/setPriceItemPropertyList', []);
      const PartID = this.curCraftPriceItemData.PartID || '';
      const PriceID = this.curPriceItem.ID;
      const CraftID = this.curCraft.ID || '';
      const resp = await PropertyClass.getPropertyList({ UseModule: 39, ProductID: this.ProductID, PartID, PriceID, CraftID });
      if (resp) this.$store.commit('priceManage/setPriceItemPropertyList', resp);
    },
  },
  created() {
    if (!this.curPriceItem || !this.curCraftPriceItemData || !this.curCraftPriceItemData.Craft) {
      this.onGoBackClick();
      return;
    }
    const { ID, Name } = this.curPriceItem;
    this.PriceID = ID;
    this.PriceName = Name;
    this.ProductID = this.$route.params.id;
    this.ProductName = this.$route.params.name;
    this.$store.commit('priceManage/setResultFormulaList', []);
    // this.$store.dispatch('priceManage/getConditionPropertyList', this.$route.params.id);
    // console.log(this.curCraftPriceItemData, this.curPriceItem);
    this.getConditionPropertyList();
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
    padding-bottom: 5px;
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
    .tips-box {
      margin-top: 50px;
      font-weight: 400;
      width: 700px;
      letter-spacing: 1px;
    }
  }
  > main {
    flex: 1;
    padding-top: 0px;
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
