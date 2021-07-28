<template>
  <section class="mp-erp-price-module-quotation-scheme-list-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
      <!-- <span class="name">设置工艺：{{curCraft.Name}}</span> -->
      <p>
        <el-button type="primary" size="small" @click="onQuotationSchemeSaveClick(null)">添加方案</el-button>
      </p>
    </header>
    <main>
      <ul>
        <li v-for="it in FormulaList" :key="it.ID">
          <span class="title">{{it.Name}}</span>
          <span class="content" :title="it.Content">{{it.Content}}</span>
          <CtrlMenus @edit='onQuotationSchemeSaveClick(it)' @remove='onRemoveClick(it)' />
        </li>
      </ul>
      <div class="empty" v-if="!loading && FormulaList.length === 0">
        <img src="@/assets/images/null.png" alt="">
        <p>暂无方案</p>
      </div>
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';

export default {
  name: 'QuotationScheme',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    CtrlMenus,
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
      loading: true,
      FormulaList: [],
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
    onQuotationSchemeSaveClick(data) { // 添加 | 编辑 报价方案
      this.$store.commit('priceManage/setCurQuotationSchemeData', data);
      const params = { ...this.$route.params };
      delete params.timer;
      this.$router.push({
        name: 'QuotationSchemeSet',
        params,
      }); // 跳转设置页面
    },
    async getFormulaList() {
      if (!this.ProductID || !this.PriceID) return;
      const resp = await this.api.getFormulaList({ ProductID: this.ProductID, UseModule: 6, PriceID: this.PriceID }).catch(() => {});
      this.loading = false;
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        this.FormulaList = resp.data.Data;
      }
    },
    onRemoveClick(it) {
      console.log('onRemoveClick', it);
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
    this.getFormulaList();
    // this.getProductData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-quotation-scheme-list-page-wrap {
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
    max-width: 1200px;
    position: relative;
    &.loading {
      opacity: 0.2;
    }
    .empty {
      color: #989898;
      font-size: 12px;
      width: 100px;
      margin: 0 auto;
      text-align: center;
      position: absolute;
      top: 40%;
      left: 50%;
      padding-left: 10px;
      transform: translate(-50%, -50%);
      > p {
        padding-top: 8px;
        padding-left: 2px;
      }
    }
    > ul {
      width: 100%;
      > li {
        width: 100%;
        padding: 8px 16px;
        padding-top: 16px;
        padding-right: 50px;
        line-height: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        display: flex;
        color: #585858;
        font-size: 14px;
        transition: 0.1s ease-in-out;
        > .title {
          width: 210px;
          padding-right: 15px;
          font-weight: 700;
          flex: none;
        }
        > .content {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 30px;
        }
        > div {
          flex: none;
          width: 120px;
        }
        &:hover {
          // border-color: #ccc;
          background-color: #f8f8f8;
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    padding-bottom: 5px;
    max-width: 1150px;
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
