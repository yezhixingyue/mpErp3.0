<template>
  <section class="mp-erp-product-price-manage-list-page-wrap">
    <header>
      <!-- 顶部按钮及筛选区域 -->
      <div class="left">
        <template v-if="Permission && Permission.PermissionList.PermissionProductPrice.Obj.SetupAll">
          <el-button type="primary" class="mp-common-btn-styles" @click="jumpAreaTempPage">适用范围模板</el-button>
          <el-button type="primary" class="mp-common-btn-styles" @click="jumpMakeupRulePage">拼版规则设置</el-button>
        </template>
        <!-- <NewProductClassifySelectComp v-model="ProductClassData" /> -->
        <EpCascaderByProductWithRoot
          class="mr-15"
         :ClassType="condition4PriceManageList.ClassType"
         :First="condition4PriceManageList.ProductClass.First"
         :Second="condition4PriceManageList.ProductClass.Second"
         :getList="getPriceManageList"
         :setCondition="setObjForListData"
        />
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
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import PriceTableComp from '@/components/PriceComps/ListTable/PriceTableComp.vue';
import Count from '@/components/common/Count.vue';
// import NewProductClassifySelectComp from '@/components/common/SelectorComps/NewProductClassifySelectComp.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState } from 'vuex';
import EpCascaderByProductWithRoot from '../../components/common/SelectorComps/EpCascaderWrap/EpCascaderByProductWithRoot.vue';

export default {
  name: 'PriceManageListPage',
  components: {
    SearchInputComp,
    PriceTableComp,
    Count,
    // NewProductClassifySelectComp,
    EpCascaderByProductWithRoot,
  },
  mixins: [recordScrollPositionMixin('.mp-erp-price-manage-table-comp-wrap')],
  computed: {
    ...mapState('priceManage', ['condition4PriceManageList', 'PriceManageList', 'PriceManageListNumber', 'isPriceDataLoading']),
    ...mapState('common', ['Permission']),
    ProductClassData: {
      get() {
        return this.condition4PriceManageList;
      },
      set(val) {
        if (!val) return;
        const { ProductClass, ClassType } = val;
        this.$store.commit('priceManage/setCondition4PriceManageList', [['ClassType', ''], ClassType]);
        this.$store.commit('priceManage/setCondition4PriceManageList', [['ProductClass', ''], ProductClass]);
        this.getPriceManageList();
      },
    },
    noPriceChecked: {
      get() {
        return this.condition4PriceManageList.NoPrice;
      },
      set(val) {
        this.$store.commit('priceManage/setCondition4PriceManageList', [['NoPrice', ''], val || '']);
        this.getPriceManageList();
      },
    },
  },
  data() {
    return {
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
    jumpMakeupRulePage() {
      this.$router.push('/MakeupRule');
    },
  },
  mounted() {
    this.clearCondition();
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
  display: flex;
  flex-direction: column;
  > header {
    // height: 60px;
    flex: none;
    padding-top: 13px;
    box-sizing: border-box;
    padding-left: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background-color: #fff;
    flex-wrap: wrap;
    > .left {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
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
      margin-bottom: 15px;
    }
    .mp-common-comps-ep-cascader-comp-wrap {
      position: relative;
      top: 2px;
    }
  }
  > main {
    // height: calc(100% - 60px - 60px);
    flex: 1;
    overflow: hidden;
    padding-bottom: 10px;
  }
  > footer {
    height: 50px;
    flex: none;
    box-sizing: border-box;
    // border-top: 1px solid #eee;
    padding-top: 2px;
    background-color: #fff;
  }
}
</style>
