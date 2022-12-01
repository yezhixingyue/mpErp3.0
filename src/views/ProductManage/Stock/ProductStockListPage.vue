<template>
  <section class="mp-erp-product-list-page-product-stock-list-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <template v-if="ProductStockDataList && !loadingPropList">
        <StockTable
         @add="onSpecificationAddClick('null', '产品')"
         :ProductID='ProductID'
         PartID=''
         :itemData='ProductStockDataList'
         :leftPropertyList='getPropertyList("left", "")'
         :rightPropertyList='getPropertyList("right", "")' />
        <StockTable
         @add="onSpecificationAddClick(it.ID, it.Name)"
         :title="it.Name"
         :PartID="it.ID"
         :ProductID='ProductID'
         v-for="it in ProductStockDataList.PartList"
         :key="it.ID"
         :itemData='it'
         :leftPropertyList='getPropertyList("left", it.ID)'
         :rightPropertyList='getPropertyList("right", it.ID)' />
      </template>
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import StockTable from '@/components/ProductManageComps/Stock/StockTable';

export default {
  name: 'ProductStockList',
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      loadingPropList: true,
      // StockList: [],
    };
  },
  components: {
    StockTable,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'ProductStockDataList', 'StockPropertyLists']),
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
    async getPositionID() {
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
      this.getProductOrderData();
      this.loadingPropList = true;
      await this.$store.dispatch('productManage/getProductStockPropertyList', this.curProduct);
      this.loadingPropList = false;
    },
    async getProductOrderData(dataType = ['Part', 'Stock']) { // 获取初始部件及库存信息
      const ID = this.PartID ? this.PartID : this.ProductID;
      const _fetchFunc = this.PartID ? this.api.getPartModuleData : this.api.getProductModuleData;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      this.$store.commit('productManage/setProductStockDataList', null);
      const resp = await _fetchFunc(_temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        this.$store.commit('productManage/setProductStockDataList', resp.data.Data);
      }
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
    onSpecificationAddClick(PartID, fixedPartName) {
      const { ProductID, ProductName, titleType } = this;
      const path = `/ProductStockSpecificationAdd/${ProductID}/${PartID}/${ProductName}/${titleType}/${fixedPartName}/${Date.now()}`;
      this.$router.push(path);
    },
    getPropertyList(type, PartID) {
      if (!Array.isArray(this.StockPropertyLists) || this.StockPropertyLists.length === 0) return [];
      const t = this.StockPropertyLists.find(it => it.PartID === PartID);
      if (t) {
        if (type === 'left') return t.leftPropertyList;
        if (type === 'right') return t.rightPropertyList;
      }
      return [];
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-stock-list-page-wrap {
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
    min-width: 1120px;
    padding-right: 5px;
    > section {
      margin-bottom: 50px;
      &:last-of-type {
        margin-bottom: 30px;
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    padding-bottom: 40px;
    padding-right: 240px;
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
