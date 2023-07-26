<template>
  <section class="mp-erp-factory-manage-account-setup-page-wrap">
    <header>
      <div class="factory-manag-setup-header">
        <p class="mp-common-title-wrap">当前工厂：{{PathFactoryInfo.FactoryName}}</p> <br>
        <el-button type="primary" @click="onSetupItemClick(null)" class="blue-full-color-btn-styles is-blue-button">添加工厂账号</el-button>
      </div>
    </header>
    <main>
      <Table :list="localPageData.list" :loading="localPageData.loading" @edit="onSetupItemClick" @remove="onRemoveClick" />
      <Dialog :visible.sync="localPageData.curEditInfo.visible" :localPageData="localPageData" />
    </main>
    <footer>
      <el-button class="cancel-blue-btn" @click="goBackLastPage"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import router, { goBackLastPage } from '@/router';
import { computed, onMounted, ref } from 'vue';
import { FactoryAccountListClass } from './Account/FactoryAccountListClass';
import Table from './Account/Table.vue';
import Dialog from './Account/Dialog.vue';
import { IFactoryAccount } from './Account/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const PathFactoryInfo = computed(() => (router.currentRoute.params as unknown as { FactoryID: string, FactoryName: string }));

const localPageData = ref(new FactoryAccountListClass(+PathFactoryInfo.value.FactoryID));

const onSetupItemClick = (item: null | IFactoryAccount) => {
  localPageData.value.curEditInfo.item = item;
  localPageData.value.curEditInfo.visible = true;
};

const onRemoveClick = (item: IFactoryAccount) => {
  MpMessage.warn({
    title: '确定删除该账号吗 ?',
    msg: `账号名称：[ ${item.Name} ]`,
    onOk() {
      localPageData.value.removeItem(item);
    },
  });
};

onMounted(() => {
  localPageData.value.getList();
});
</script>

<script lang='ts'>
export default {
  name: 'FactoryAccountSetupPage',
};
</script>

<style scoped lang='scss'>
.mp-erp-factory-manage-account-setup-page-wrap {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 6px;
  > header {
    padding: 20px 0;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;
    p {
      margin-bottom: 15px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 8px;
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
