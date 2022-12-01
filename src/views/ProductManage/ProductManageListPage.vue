<template>
  <section class="mp-erp-product-manage-list-page-wrap">
    <header>
      <!-- 顶部按钮及筛选区域 -->
      <div class="left">
        <el-button type="primary" class="mp-common-btn-styles" @click="onProductSaveClick(null)"
         v-if="Permission.PermissionList.PermissionProductBase.Obj.SetupProduct">添加产品</el-button>
        <el-button type="primary" class="mp-common-btn-styles" @click="goToClassifyPage"
         v-if="Permission.PermissionList.PermissionProductBase.Obj.ManageProductClass">管理产品分类</el-button>
        <!-- <NewProductClassifySelectComp v-model="ProductClassData" /> -->
        <EpCascaderByProductWithRoot
         :ClassType="condition4ProductManageList.ClassType"
         :First="condition4ProductManageList.ProductClass.First"
         :Second="condition4ProductManageList.ProductClass.Second"
         :getList="getManageProductList"
         :setCondition="setObjForListData"
        />
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
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import ProductTableComp from '@/components/ProductManageComps/ListPageComps/ProductTableComp.vue';
import Count from '@/components/common/Count.vue';
// import NewProductClassifySelectComp from '@/components/common/SelectorComps/NewProductClassifySelectComp.vue';
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import EpCascaderByProductWithRoot from '../../components/common/SelectorComps/EpCascaderWrap/EpCascaderByProductWithRoot.vue';

export default {
  name: 'ProductManageList',
  components: {
    SearchInputComp,
    ProductTableComp,
    Count,
    // NewProductClassifySelectComp,
    EpCascaderByProductWithRoot,
  },
  mixins: [recordScrollPositionMixin('.mp-erp-product-manage-table-comp-wrap')],
  computed: {
    ...mapState('productManage', ['condition4ProductManageList', 'ProductManageList', 'ProductManageListNumber', 'isTableDataLoading']),
    ...mapState('common', ['OperatorKeyValueList', 'Permission']),
    ProductClassData: {
      get() {
        return this.condition4ProductManageList;
      },
      set(val) {
        if (!val) return;
        const { ProductClass, ClassType } = val;
        this.$store.commit('productManage/setCondition4ProductManageList', [['ClassType', ''], ClassType]);
        this.$store.commit('productManage/setCondition4ProductManageList', [['ProductClass', ''], ProductClass]);
        this.getManageProductList();
      },
    },
  },
  data() {
    return {
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
    this.clearCondition();
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
      > button {
        margin-right: 20px;
        & + button {
          margin-right: 50px;
        }
      }
    }
    > section {
      margin-right: 20px;
      white-space: nowrap;
    }
    .mp-common-comps-ep-cascader-comp-wrap {
      position: relative;
      top: 2px;
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
