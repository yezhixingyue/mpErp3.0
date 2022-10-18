<template>
  <section class="mp-ts-switch-list-page-comp-wrap">
    <header>
      <mp-button type="primary" @click="setup(null)">添加转换器</mp-button>
      <span class="blue-span" @click="visible = true">操作日志</span>
    </header>
    <SwitchServerListMainTable :table-data="switchPageData.list" @edit="setup" @remove="remove" @notify="setNotifyClick" />
    <SwitchServerSetupDialog :pageTypeData="switchPageData" />
    <NotifySetupDialog :pageTypeData="switchPageData" />
    <OperationLogDialog :visible.sync="visible" :type="ServerTypeEnum.ManageConvert" />
  </section>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import SwitchServerListMainTable from '@/components/serverManage/SwitchServer/SwitchServerListMainTable.vue';
import SwitchServerSetupDialog from '@/components/serverManage/SwitchServer/SwitchServerSetupDialog.vue';
import NotifySetupDialog from '@/components/serverManage/SwitchServer/NotifySetupDialog.vue';
import OperationLogDialog from '@/components/LogComp/OperationLogDialog.vue';
import { SwitchPageDataClassType } from './utils/SwitchPageDataClassType';
import { SwitchListItemPlainType } from './utils/SwitchListItemClass';
import { ServerTypeEnum } from './utils/types';

const switchPageData = ref(new SwitchPageDataClassType());

const setup = (item: null | SwitchListItemPlainType) => {
  switchPageData.value.setCurEditItem(item);
  switchPageData.value.setVisible(true);
};

const remove = (item: SwitchListItemPlainType) => {
  switchPageData.value.removeItem(item);
};

const setNotifyClick = (item: null | SwitchListItemPlainType) => {
  switchPageData.value.setCurEditItem(item);
  switchPageData.value.setNotifyVisible(true);
};

const visible = ref(false);

</script>

<script lang='ts'>
export default {
  name: 'SwitchServersListPage',
};
</script>

<style scoped lang='scss'>
.mp-ts-switch-list-page-comp-wrap {
  padding-left: 8px;
  padding-right: 1px;
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    flex: none;
    font-size: 14px;
    font-weight: 100;
    padding: 20px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    > button {
      color: #fff;
      padding: 0 15px;
      height: 30px;
      font-size: 14px;
      font-weight: 100;
      margin-right: 30px;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
