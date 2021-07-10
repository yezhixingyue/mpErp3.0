<template>
  <section class="mp-erp-product-price-manage-list-page-wrap">
    <header>
      <!-- 顶部按钮及筛选区域 -->
      <div class="left">
        <el-button type="primary" class="mp-common-btn-styles" @click="jumpAreaTempPage">适用范围模板</el-button>
        <el-button type="primary" class="mp-common-btn-styles">拼版规则设置</el-button>
        <NewProductClassifySelectComp v-model="ProductClass" />
        <el-checkbox v-model="noPriceChecked">仅显示无报价产品</el-checkbox>
      </div>
      <search-input-comp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title=""
        placeholder='请输入产品内部名称'
        :requestFunc='getPriceManageList'
        :changePropsFunc='setObjForListData'
        :word='condition4PriceManageList.KeyWords'
        :searchWatchKey="PriceManageList"
        resetWords='清空所有筛选条件'
        @reset='() => this.clearCondition()'
        />
    </header>
    <main>
      <PriceTableComp :listData='PriceManageList' />
    </main>
    <footer>
      <Count
       :watchPage='condition4PriceManageList.Page'
       :handlePageChange='handlePageChange'
       :count='PriceManageListNumber'
       center
       :pageSize='condition4PriceManageList.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import PriceTableComp from '@/components/PriceComps/ListTable/PriceTableComp.vue';
import Count from '@/components/common/Count.vue';
import NewProductClassifySelectComp from '@/components/common/SelectorComps/NewProductClassifySelectComp.vue';
import { mapState } from 'vuex';

export default {
  name: 'PriceManageListPage',
  components: {
    SearchInputComp,
    PriceTableComp,
    Count,
    NewProductClassifySelectComp,
  },
  computed: {
    ...mapState('priceManage', ['condition4PriceManageList', 'PriceManageList', 'PriceManageListNumber', 'isPriceDataLoading']),
    ProductClass: {
      get() {
        return this.condition4PriceManageList.ProductClass;
      },
      set(val) {
        this.$store.commit('priceManage/setCondition4PriceManageList', [['ProductClass', ''], val]);
        this.getPriceManageList();
      },
    },
    noPriceChecked: {
      get() {
        return this.condition4PriceManageList.NoPrice;
      },
      set(val) {
        this.$store.commit('priceManage/setCondition4PriceManageList', [['NoPrice', ''], val]);
        this.getPriceManageList();
      },
    },
  },
  data() {
    return {
      // productList: [],
    };
  },
  methods: {
    getPriceManageList(page = 1) {
      this.$store.dispatch('priceManage/getPriceManageList', page);
    },
    setObjForListData(data) {
      this.$store.commit('priceManage/setCondition4PriceManageList', data);
    },
    clearCondition() {
      this.$store.commit('priceManage/clearCondition4PriceManageList');
    },
    handlePageChange(page) {
      this.getPriceManageList(page);
    },
    jumpAreaTempPage() {
      this.$router.push('/AreaTemplate');
    },
  },
  mounted() {
    this.getPriceManageList();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-price-manage-list-page-wrap {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-left: 8px;
  background-color: #f5f5f5;
  > header {
    height: 60px;
    padding-top: 13px;
    box-sizing: border-box;
    padding-left: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background-color: #fff;
    > .left {
      display: flex;
      align-items: center;
      > button + button {
        margin-left: 20px !important;
        margin-right: 50px;
      }
      .el-checkbox {
        font-size: 12px;
        margin-left: 10px;
        margin-right: 20px;
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
        }
      }
    }
    > section {
      margin-right: 20px;
      white-space: nowrap;
    }
  }
  > main {
    height: calc(100% - 60px - 60px);
  }
  > footer {
    height: 50px;
    box-sizing: border-box;
    // border-top: 1px solid #eee;
    padding-top: 2px;
    background-color: #fff;
  }
}
</style>
