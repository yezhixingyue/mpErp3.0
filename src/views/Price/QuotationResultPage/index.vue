<template>
  <section class="mp-erp-price-module-quotation-result-list-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
    </header>
    <main>
      <ResultTableCom
        @remove='onTableItemRemove'
        @setup="onQuotationResultSaveClick"
        :titleObj='{title:"报价结果",btnText:"+ 添加条件"}'
        :dataList='curPriceItem.ResultList || []'
        />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ResultTableCom from './Comps/ResultTableCom.vue';

export default {
  name: 'QuotationResult',
  components: {
    ResultTableCom,
  },
  computed: {
    ...mapState('priceManage', ['curPriceItem']),
  },
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
    };
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    onQuotationResultSaveClick(data) { // 添加 | 编辑 报价结果
      this.$store.commit('priceManage/setCurQuotationResultData', data);
      this.$router.push({
        name: 'QuotationResultSet',
        params: this.$route.params,
      }); // 跳转设置页面
    },
    async onTableItemRemove(e) {
      if (!e || !e.ID) return;
      const resp = await this.api.getPriceResultRemove(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setPriceResultItemRemove', [e.ID, this.ProductID, this.PriceID]);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
  mounted() {
    if (!this.curPriceItem) {
      this.$goback();
      return;
    }
    const { ID, Name } = this.curPriceItem;
    this.PriceID = ID;
    this.PriceName = Name;
    this.ProductID = this.$route.params.id;
    this.ProductName = this.$route.params.name;
    this.$store.dispatch('priceManage/getQuotationResultPropertyList', this.ProductID);
    // this.$store.dispatch('priceManage/getQuotationResultSolutionList', [this.ProductID, this.PriceID]);
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-quotation-result-list-page-wrap {
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
    > p {
      padding-top: 40px;
      > button {
        width: 125px;
        font-size: 14px;
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
