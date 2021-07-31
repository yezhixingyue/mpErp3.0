<template>
  <section class="mp-erp-price-module-craft-price-total-price-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
      <span class="name">设置工艺：{{curCraft.Name}}</span>
    </header>
    <main>
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CraftTotalPriceSetPage',
  components: {
  },
  computed: {
    ...mapState('priceManage', ['curCraftPriceItemData', 'curPriceItem']),
    curCraft() {
      return this.curCraftPriceItemData.Craft || {};
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
