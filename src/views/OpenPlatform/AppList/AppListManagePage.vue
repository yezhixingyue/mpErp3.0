<template>
  <section class="mp-erp-develop-open-api-app-list-manage-page-wrap">
    <Header
     :condition="localManageAppList.condition"
     :list="localManageAppList.list"
     @setCondition="(e) => localManageAppList.condition.setConditon(e)"
     @getList="() => localManageAppList.getList()"
     />
    <main>
      <Table :list="localManageAppList.list" :loading="localManageAppList.loading" />
    </main>
    <footer>
      <MpPagination center
        :watchPage="localManageAppList.condition.Page"
        :count="localManageAppList.listNumber"
        :pageSize="localManageAppList.condition.PageSize"
        :handlePageChange="(num) => localManageAppList.getList(num)"
      />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import MpPagination from '@/components/common/Count.vue';
import { ManageAppListClass } from './js/ManageAppListClass';
import Header from './components/Header.vue';
import Table from './components/Table.vue';

const localManageAppList = ref(new ManageAppListClass());

onMounted(() => localManageAppList.value.getList());
</script>

<script lang='ts'>
export default {
  name: 'AppListManagePage',
};
</script>

<style scoped lang='scss'>
.mp-erp-develop-open-api-app-list-manage-page-wrap {
  height: 100%;
  width: 1350px;
  margin-left: 20px;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 70px 1fr 70px;
}
</style>
