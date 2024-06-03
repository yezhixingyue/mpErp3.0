<template>
  <section class="mp-erp-factory-outsource-price-list-page-wrap" v-if="localManageClass">
    <header>
      <div class="factory-manag-setup-header">
        <p class="mp-common-title-wrap">当前工厂：{{ localManageClass.Factory.Name || '' }}</p> <br>
      </div>
    </header>

    <main>
      <Table :list="localManageClass.list" :loading="localManageClass.loading" @setPrice="setPrice" />
      <Dialog :visible.sync="visible" :item="currentItem" @submit="(e, cb) => localManageClass.submitPrice(e, cb)" />
    </main>

    <footer>
      <el-button class="cancel-blue-btn" @click="goBackLastPage"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import router, { goBackLastPage } from '../../../../router';
import { FactoryOutsourcePriceManageClass } from './js/FactoryOutsourcePriceManageClass';
import Table from './components/Table.vue';
import Dialog from './components/Dialog.vue';
import { IFactoryProductPrice } from './js/type';

const localManageClass = ref<null | FactoryOutsourcePriceManageClass>(null);

const visible = ref(false);
const currentItem = ref<null | IFactoryProductPrice>(null);
const setPrice = (e: IFactoryProductPrice) => {
  currentItem.value = e;
  visible.value = true;
};

onMounted(() => {
  const _temp = {
    ID: Number(router.currentRoute.params.ID),
    Name: router.currentRoute.params.factoryName,
  };

  localManageClass.value = new FactoryOutsourcePriceManageClass(_temp);
});

</script>

<script lang='ts'>
export default {
  name: 'FactoryOutsourcePriceListPage',
};
</script>

<style lang='scss'>
.mp-erp-factory-outsource-price-list-page-wrap {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 6px;
  > header {
    padding: 20px;
    background-color: #fff;
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 8px;
    overflow: hidden;
  }
  > footer {
    flex: none;
    height: 70px;
    background-color: #fff;
    font-size: 13px;
    padding-top: 30px;
    text-align: center;
    i {
      color: #26bcf9;
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
