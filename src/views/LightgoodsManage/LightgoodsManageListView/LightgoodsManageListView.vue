<template>
  <section class="mp-erp-lightgoods-manage-list-view-wrap" v-if="lightgoodsModuleStore">
    <Header
      :condition="lightgoodsModuleStore.productListManager.condition"
      :getList="() => lightgoodsModuleStore.productListManager.getList()"
      :setConditon="(e) => lightgoodsModuleStore.productListManager.condition.setConditon(e)"
      :clearCondition="() => lightgoodsModuleStore.productListManager.clearConditon()"
      :list="lightgoodsModuleStore.productListManager.list"
      :addProduct="(e) => lightgoodsModuleStore.productListManager.addProduct(e)"
      :lightgoodsPoductIds="lightgoodsModuleStore.productListManager.lightgoodsPoductIds"
      :setLightgoodsPoductIds="(e) => lightgoodsModuleStore.productListManager.setLightgoodsPoductIds(e)"
    />
    <main>
      <Table
        :loading="lightgoodsModuleStore.productListManager.loading"
        :list="lightgoodsModuleStore.productListManager.list"
        :Permission="UserDetail.PermissionList.PermissionBulkyCargo"
        @remove="(e) => lightgoodsModuleStore.productListManager.removeProduct(e)"
        @setup="onSetupClick"
      />
    </main>

    <footer>
      <Pager
        center
        :pageSize="lightgoodsModuleStore.productListManager.condition.PageSize"
        :count="lightgoodsModuleStore.productListManager.listNumber"
        :watchPage="lightgoodsModuleStore.productListManager.condition.Page"
        :handlePageChange="(p) => lightgoodsModuleStore.productListManager.getList(p)"
      />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';
import { useUserStore } from '@/pinia/modules/user';
import { Pager } from '@/components/common/mpzj-sell-lib/lib';
import Header from './components/Header.vue';
import { lightgoodsModuleStore } from '../store';
import { LightgoodsModuleStoreModel } from '../store/LightgoodsModuleStoreModel';
import Table from './components/Table.vue';
import { storeToRefs } from 'pinia';
import { ILightgoodsProduct } from '../types/types';
import router from '@/router';
import { LightgoodsSolutionManageClass } from '../PackagingSchemeListView/models/LightgoodsSolutionManageClass';

lightgoodsModuleStore.value = null;

const userStore = useUserStore();
const { UserDetail } = storeToRefs(userStore);

const onSetupClick = (row: ILightgoodsProduct) => {
  lightgoodsModuleStore.value.solutionListManager = new LightgoodsSolutionManageClass(row);
  router.push('/packagingSchemeList');
};

onMounted(() => {
  lightgoodsModuleStore.value = new LightgoodsModuleStoreModel();
  lightgoodsModuleStore.value.productListManager.getList();
});
</script>

<script lang='ts'>
export default {
  name: 'LightgoodsManageListView',
};
</script>

<style lang='scss'>
.mp-erp-lightgoods-manage-list-view-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding-left: 8px;
  background-color: #f5f5f5;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 75px 1fr 50px;
  max-width: 1408px;

  > header, > main, > footer {
    background-color: #fff;
  }

  > main {
    overflow: hidden;
    padding-left: 20px;
  }

  > footer {
    box-sizing: border-box;
    padding-top: 0px;

    .mpzj-sell-lib-comps-pager-wrap.is-center .count {
      right: 2px;
    }
  }
}
</style>
