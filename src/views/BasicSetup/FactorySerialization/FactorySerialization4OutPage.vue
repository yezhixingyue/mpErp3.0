<template>
  <section class="wrap">
    <Header :condition="localManageData.condition" @getList="() => localManageData.getList()" />

    <main>
      <Table
        :list="localManageData.list"
        :loading="localManageData.loading"
        :changeIncludeDescribeFile="(row) => localManageData.setRowIncludeDescribeFile(row)"
        @click="(it, type) => localManageData.onSetupClick(it, type)"
      />

      <!-- 订单信息序列化设置 -->
      <MROrderDialog :visible.sync="localManageData.orderVisible" :item="localManageData.currentItem" @submit="(e) => localManageData.setupMROrder(e)" />

      <!-- 生产需求序列化设置 -->
      <MRProductDialog :visible.sync="localManageData.productVisible" :item="localManageData.currentItem" @submit="(e) => localManageData.setupMRProduct(e)" />
    </main>

    <footer>
      <Count
        center
        :watchPage='localManageData.condition.Page'
        :pageSize="localManageData.condition.PageSize"
        :handlePageChange='(e) => localManageData.getList(e)'
        :count='localManageData.listNumber'
      />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Count from '@/components/common/Count.vue';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import MROrderDialog from './components/MROrderDialog.vue';
import MRProductDialog from './components/MRProductDialog/MRProductDialog.vue';
import { FactorySerializationClass } from './js/FactorySerializationClass';

const localManageData = ref(new FactorySerializationClass());

onMounted(() => {
  localManageData.value.getList();
});

</script>

<script lang='ts'>
export default {
  name: 'FactorySerialization4OutPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  height: 100%;
  background-color: #f6f6f6;
  padding-left: 8px;
  display: grid;
  grid-template-rows: 65px 1fr 60px;
  grid-template-columns: 1fr;

  > * {
    background-color: #fff;
  }

  > main {
    overflow: hidden;
    padding-left: 20px;
    padding-right: 10px;
  }

  > footer {
    padding-top: 7px;
  }
}
</style>
