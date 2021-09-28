<template>
  <section class="mp-erp-product-manage-list-page-wrap">
    <header>
      <!-- 顶部按钮及筛选区域 -->
      <div class="left">
        <el-button type="primary" class="mp-common-btn-styles" @click="onProductSaveClick(null)">添加产品</el-button>
        <el-button type="primary" class="mp-common-btn-styles" @click="goToClassifyPage">管理产品分类</el-button>
        <NewProductClassifySelectComp v-model="ProductClass" />
      </div>
      <search-input-comp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title=""
        placeholder='请输入产品内部名称'
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
       center
       :pageSize='condition4ProductManageList.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import ProductTableComp from '@/components/ProductManageComps/ListPageComps/ProductTableComp.vue';
import Count from '@/components/common/Count.vue';
import NewProductClassifySelectComp from '@/components/common/SelectorComps/NewProductClassifySelectComp.vue';
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'ProductManageList',
  components: {
    SearchInputComp,
    ProductTableComp,
    Count,
    NewProductClassifySelectComp,
  },
  mixins: [recordScrollPositionMixin('.mp-erp-product-manage-table-comp-wrap')],
  computed: {
    ...mapState('productManage', ['condition4ProductManageList', 'ProductManageList', 'ProductManageListNumber', 'isTableDataLoading']),
    ...mapState('common', ['OperatorKeyValueList']),
    ProductClass: {
      get() {
        return this.condition4ProductManageList.ProductClass;
      },
      set(val) {
        this.$store.commit('productManage/setCondition4ProductManageList', [['ProductClass', ''], val]);
        this.getManageProductList();
      },
    },
  },
  data() {
    return {
      // productList: [],
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
    onProductSaveClick(data) { // 产品新增 | 编辑
      this.$store.commit('productManage/setCurEditData', data);
      this.$router.push(`/ProductDataSave/${Date.now()}`);
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
