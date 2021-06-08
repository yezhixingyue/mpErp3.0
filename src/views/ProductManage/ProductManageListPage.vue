<template>
  <section class="mp-erp-product-manage-list-page-wrap">
    <header>
      <!-- 顶部按钮及筛选区域 -->
      <div class="left">
        <el-button type="primary" class="mp-common-btn-styles" @click="addNewProductVisible=true">添加产品</el-button>
        <el-button type="primary" class="mp-common-btn-styles" @click="goToClassifyPage">管理产品分类</el-button>
        <product-selector-index-two-levels
          title="产品分类"
          :changePropsFunc="setObjForListData"
          :requestFunc="getManageProductList"
          :ClassID="condition4ProductManageList.ProductClass.First"
          :TypeID="condition4ProductManageList.ProductClass.Second"
          :typeList="[['ProductClass', 'First'],['ProductClass', 'Second']]" />
      </div>
      <search-input-comp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title=""
        placeholder='请输入产品名称'
        :requestFunc='getManageProductList'
        :changePropsFunc='setObjForListData'
        :word='condition4ProductManageList.KeyWords'
        :searchWatchKey="ProductManageList"
        resetWords='清空所有筛选条件'
        @reset='() => this.clearCondition()'
        />
    </header>
    <main>
      <ProductTableComp :listData='ProductManageList' />
    </main>
    <footer>
      <Count
       :watchPage='condition4ProductManageList.Page'
       :handlePageChange='handlePageChange'
       :count='ProductManageListNumber'
       :pageSize='condition4ProductManageList.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import ProductSelectorIndexTwoLevels from '@/components/common/SelectorComps/ProductSelectorIndexTwoLevels.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import ProductTableComp from '@/components/ProductManageComps/ListPageComps/ProductTableComp.vue';
import Count from '@/components/common/Count.vue';
import { mapState } from 'vuex';

export default {
  components: {
    ProductSelectorIndexTwoLevels,
    SearchInputComp,
    ProductTableComp,
    Count,
  },
  computed: {
    ...mapState('productManage', ['condition4ProductManageList', 'ProductManageList', 'ProductManageListNumber', 'isTableDataLoading']),
    ...mapState('common', ['OperatorKeyValueList']),
  },
  data() {
    return {
      addNewProductVisible: false,
      productList: [],
    };
  },
  methods: {
    getManageProductList(page = 1) {
      this.$store.dispatch('productManage/getManageProductList', page);
    },
    setObjForListData(data) {
      this.$store.commit('productManage/setCondition4ProductManageList', data);
    },
    clearCondition() {
      this.$store.commit('productManage/clearCondition4ProductManageList');
    },
    goToClassifyPage() {
      this.$router.push('/ProductClassifyManage');
    },
    handlePageChange(page) {
      this.getManageProductList(page);
    },
  },
  mounted() {
    this.getManageProductList();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-manage-list-page-wrap {
  height: 100%;
  width: 100%;
  > header {
    height: 75px;
    padding-top: 20px;
    box-sizing: border-box;
    padding-left: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    > .left {
      display: flex;
      align-items: center;
      > button + button {
        margin-left: 20px !important;
        margin-right: 50px;
      }
    }
    > section {
      margin-right: 20px;
      white-space: nowrap;
    }
  }
  > main {
    height: calc(100% - 75px - 50px);
  }
  > footer {
    height: 50px;
    box-sizing: border-box;
    border-top: 1px solid #eee;
    padding-top: 2px;
  }
}
</style>
