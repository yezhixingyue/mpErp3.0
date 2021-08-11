<template>
  <section class="mp-erp-price-module-number-swap-list-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
    </header>
    <main :class="{loading: loading}">
      <NumberSwapTableComp
        v-for="it in PartList"
        :key="it.ID"
        @remove='onTableItemRemove'
        @setup="onNumberSwapSaveClick($event, it)"
        :titleObj='{title:`${it.Name}数值转换`,btnText:"+ 添加数值转换"}'
        :dataList='it.List'
        />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import NumberSwapTableComp from '@/components/PriceComps/NumberSwap/NumberSwapTableComp.vue';

export default {
  name: 'NumberSwapList',
  components: {
    NumberSwapTableComp,
  },
  computed: {
    ...mapState('priceManage', ['curPriceItem', 'NumberSwapList']),
    PartList() {
      const ProductItem = {
        ProductID: this.ProductID,
        PartID: '',
        Name: '产品',
        ID: this.ProductID,
        List: this.getPartItemSwapList(this.NumberSwapList, ''),
      };
      const list = [ProductItem];
      if (this.productData && Array.isArray(this.productData.PartList)) {
        this.productData.PartList.forEach(part => {
          const { ProductID, ID, Name } = part;
          const item = {
            ProductID,
            ID,
            Name,
            PartID: ID,
            List: this.getPartItemSwapList(this.NumberSwapList, ID),
          };
          list.push(item);
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
      productData: null,
    };
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    onNumberSwapSaveClick(data, { Name, PartID }) { // 添加 | 编辑 报价结果
      this.$store.commit('priceManage/setCurNumberSwapData', data);
      const params = {
        ...this.$route.params,
        partName: Name,
        partID: PartID || 'null',
      };
      this.$router.push({
        name: 'NumberSwapSetup',
        params,
      }); // 跳转设置页面
    },
    async onTableItemRemove(e) {
      if (!e || !e.ID) return;
      const resp = await this.api.getNumberSwapRemove(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setNumberSwapRemove', e.ID);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async fetchInitDatas() {
      const [productData] = await Promise.all([
        this.$store.dispatch('priceManage/getProductCraftData', this.ProductID),
        this.$store.dispatch('priceManage/getAllPricePropertyList', this.ProductID),
        this.$store.dispatch('priceManage/getNumberSwapList', this.PriceID),
      ]);
      this.loading = false;
      this.productData = productData;
      console.log('productData', productData);
    },
    getPartItemSwapList(list, PartID) {
      console.log('getPartItemSwapList', list, PartID);
      return [];
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
    this.fetchInitDatas();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-number-swap-list-page-wrap {
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
