<template>
  <section class="mp-erp-price-module-price-table-result-formula-setup-page-wrap">
    <header>
      <h2>{{$route.params.name}}</h2>
      <span>价格名称：{{curPriceItem ? curPriceItem.Name : ''}}</span>
      <span v-if="!isQuotationPage && curCraftPriceItemData">设置工艺：{{curCraftPriceItemData.Craft.Name}}</span>
      <span v-if="isAllCostPage">总费用</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :ComparePropertyList='PriceItemPropertyList' :PropertyList='PriceItemPropertyList'
       leftWidth='45%' :curEditData='curPriceTableResultFormulaData' rightTitle="使用此公式">
        <!-- 右侧公式设置 -->
        <FormulaPanelComp
          ref="oRightFormulaPanel"
          class="mp-erp-product-module-formula-set-page-wrap"
          hiddenHeader
          isSingle
          :NowEditFormulaData='curPriceTableResultFormulaData || {}'
          :Condition4getProperty='Condition4getFormulaProperty'
        >
        </FormulaPanelComp>
      </ContionCommonComp>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button @click="onGoBackClick" class="go-back">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';
import FormulaPanelComp from '@/components/common/FormulaAndConditionComps/FormulaPanelComp.vue';

export default {
  name: 'ResultFormulaSetupPage',
  props: {
  },
  components: {
    ContionCommonComp,
    FormulaPanelComp,
  },
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      isQuotationPage: false,
      isAllCostPage: false,
      CraftPriceID: '',
    };
  },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('priceManage', ['curCraftPriceItemData', 'curPriceItem', 'curPriceTableItemData', 'curPriceTableResultFormulaData', 'PriceItemPropertyList', 'curSolutionItem']),
    Condition4getFormulaProperty() {
      if (this.isAllCostPage) {
        return {
          ProductID: this.ProductID,
          PriceID: this.PriceID,
          PartID: this.curCraftPriceItemData?.PartID || '',
          CraftID: this.curCraftPriceItemData?.Craft?.ID || '',
          UseModule: 7,
        };
      }
      let PartID = '';
      if (this.curSolutionItem && this.curSolutionItem.ApplyRange) PartID = this.curSolutionItem.ApplyRange.PartID || '';
      return {
        ProductID: this.ProductID,
        PriceID: this.PriceID,
        TableID: this.curPriceTableItemData?.ID || '',
        PartID,
        UseModule: 5,
      };
    },
  },
  methods: {
    getInitDataFromRoutePath() { // 初始通过路径params中获取页面信息
      const isQuotationPage = this.$route.params.isQuotation; // 是否为价格表页面 否则为设置工艺费用组成页面
      const isAllCostPage = this.$route.params.isAllCost; // 是否为工艺总费用公式设置页面
      if (!isQuotationPage && (!this.curPriceItem || !this.curCraftPriceItemData || !this.curCraftPriceItemData.Craft)
       && !this.curSolutionItem && !isQuotationPage) {
        this.onGoBackClick();
        return;
      }
      const { ID, Name } = this.curPriceItem;
      this.PriceID = ID;
      this.PriceName = Name;
      this.ProductID = this.$route.params.id;
      this.ProductName = this.$route.params.name;

      if (isQuotationPage) { // 价格表页面执行操作
        this.isQuotationPage = isQuotationPage;
      }
      if (isAllCostPage) { // 价格表页面执行操作
        this.isAllCostPage = isAllCostPage;
      }
      if (!isQuotationPage && this.curCraftPriceItemData && this.curCraftPriceItemData.Craft) { // 工艺费用组成设置页面
        // 暂无操作
        this.CraftPriceID = this.curCraftPriceItemData.Craft.CraftPriceID || '';
      }
    },
    onGoBackClick() { // 返回上一页
      if (this.isAllCostPage) {
        this.$router.replace(({ name: 'CraftTotalPriceSetPage', params: { name: this.$route.params.name, id: this.$route.params.id } }));
        return;
      }
      const { params } = this.$route;
      const pathName = this.isQuotationPage ? 'QuotationPriceTableItemSet' : 'CraftPriceTableItemSet';
      this.$router.replace(({ name: pathName, params }));
    },
    onSubmitClick() {
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      const formulaData = this.$refs.oRightFormulaPanel.getFormulaData();
      if (!formulaData) return;
      const { Constraint, Priority, ID } = condition;
      const { Content, PropertyList, Remark } = formulaData;
      const temp = { ID, Constraint, Priority, Content, PropertyList, Remark, ...this.Condition4getFormulaProperty, CraftPriceID: this.CraftPriceID };
      this.submitSave(temp);
    },
    async submitSave(data) {
      const resp = await this.api.getFormulaSave(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        // 保存成功
        const isEdit = !!data.ID;
        const msg = isEdit ? '编辑成功' : '添加成功';
        const callback = () => {
          // this.$emit('successSubmit', [isEdit, data, resp.data.Data]);
          this.$store.commit('priceManage/setResultFormulaItemChange', [data, resp.data.Data, this.isAllCostPage]);
          this.onGoBackClick();
        };
        this.messageBox.successSingle(msg, callback, callback);
      }
    },
  },
  created() {
    this.getInitDataFromRoutePath();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-price-table-result-formula-setup-page-wrap {
  display: flex;
  flex-direction: column;
  min-width: 1200px;
  height: 100%;
  > header {
    padding: 20px;
    padding-bottom: 30px;
    line-height: 15px;
    background-color: #fff;
    box-sizing: border-box;
    flex: none;
    display: flex;
    color: #21CAE3;
    font-size: 14px;
    align-items: center;
    > h2 {
      font-weight: 700;
      font-size: 15px;
    }
    > span {
      margin-left: 50px;
    }
  }
  > main {
    flex: 1;
    padding: 20px;
    overflow: hidden;
    .right {
      height: 100%;
      .right-content {
        min-width: 780px;
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    bottom: 20px;
    > button {
      width: 120px;
      height: 35px;
      border-radius: 3px;
      padding: 0;
      &.go-back {
        border: 1px solid #26BCF9;
        color: #26BCF9;
        margin-left: 40px;
      }
    }
  }
}
</style>
