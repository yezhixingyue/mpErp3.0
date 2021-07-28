<template>
  <section class="mp-erp-price-module-craft-price-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="price-name">价格名称：{{PriceName}}</span>
    </header>
    <main v-loading='loading'>
      <CraftPriceTableComp
       v-for="it in CraftPriceSetList"
       :key="it.ID" :itemData='it'
       @setupCost='onSetupCostClick'
       @allCost='onSetupAllCostClick'
       />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CraftPriceTableComp from './Comps/CraftPriceTableComp.vue';

export default {
  name: 'CraftPriceSetPage',
  components: {
    CraftPriceTableComp,
  },
  computed: {
    ...mapState('priceManage', ['curPriceItem']),
    CraftPriceSetList() {
      if (!this.ProductData) return [];
      const list = [];
      const getItem = (CraftList, ID, ProductID, PartID, Name) => {
        if (Array.isArray(CraftList) && CraftList.length > 0) {
          const temp = {
            Name,
            ID,
            ProductID,
            PartID,
            CraftList,
          };
          list.push(temp);
        }
      };
      getItem(this.ProductData.CraftList, this.ProductData.ID, this.ProductData.ID, '', '产品');
      if (Array.isArray(this.ProductData.PartList)) {
        this.ProductData.PartList.forEach(it => {
          getItem(it.CraftList, it.ID, it.ProductID, it.ID, it.Name);
        });
      }
      return list;
    },
  },
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      loading: true,
      ProductData: null,
      PriceResultList: [],
    };
  },
  methods: {
    onGoBackClick() {
      this.$router.replace('/PriceManageList');
    },
    async getPriceResultList() { // 获取工艺费列表信息
      const resp = await this.api.getPriceResultList(this.PriceID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        return resp.data.Data;
      }
      return null;
    },
    async fetchInitData() { // 初始获取含带工艺的产品信息 及 工艺费列表信息
      const [ProductData, PriceResultList] = await Promise.all([
        this.$store.dispatch('priceManage/getProductCraftData', this.ProductID),
        this.getPriceResultList(),
      ]);
      this.loading = false;
      this.ProductData = ProductData;
      this.PriceResultList = PriceResultList;
    },
    onSetupCostClick(data) { // 设置费用组成
      this.jumpPage('CompositionCostOfCraft', data);
    },
    onSetupAllCostClick(data) { // 设置总费用
      this.jumpPage('CraftTotalPriceSetPage', data);
    },
    jumpPage(pathName, data) { // 共用跳转页面方法
      this.$store.commit('priceManage/setCurCraftPriceItemData', data);
      this.$router.push({
        name: pathName,
        params: {
          name: this.ProductName,
          id: this.ProductID,
        },
      });
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
    // console.log(this.curPriceItem);
    this.fetchInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-craft-price-set-page-wrap {
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
    .price-name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
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
