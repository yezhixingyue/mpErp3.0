<template>
  <section class="mp-ts-sale-and-production-list-page-comp-wrap">
    <header>
      <mp-button size="small" type="primary" @click="setup(null)">添加转换服务器</mp-button>
      <span class="blue-span" @click="visible = true">操作日志</span>
    </header>
    <MainTable
     title="转换服务器"
     :tableData="props.pageTypeData.list"
     @edit="setup"
     @remove="onRemoveClick"
     @generate="onGenerateClick"
     @notify="setNotifyClick"
    />
    <Dialog :pageTypeData="props.pageTypeData" />
    <NotifySetupDialog :pageTypeData="props.pageTypeData" />
    <OperationLogDialog :visible.sync="visible" :type="ServerTypeEnum.ManageConvert" />
  </section>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { SaleAndProductionPageClassType } from '@/views/serverManage/utils/SaleAndProductionPageClassType';
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import OperationLogDialog from '@/components/LogComp/OperationLogDialog.vue';
import { ServerTypeEnum } from '@/views/serverManage/utils/types';
import NotifySetupDialog from './Comps/NotifySetupDialog.vue';
import MainTable from './Comps/ServerListMainTable.vue';
import Dialog from './Comps/ServerSetupDialog.vue';

const props = defineProps<{
  pageTypeData: SaleAndProductionPageClassType,
}>();

const setup = (item: null | SaleAndProductionListItemPlainType) => {
  props.pageTypeData.setCurEditItem(item);
  props.pageTypeData.setVisible(true);
};

const onRemoveClick = (item: SaleAndProductionListItemPlainType) => {
  props.pageTypeData.removeItem(item);
};

const onGenerateClick = (item: SaleAndProductionListItemPlainType) => {
  props.pageTypeData.generate(item);
};

const setNotifyClick = (item: null | SaleAndProductionListItemPlainType) => {
  props.pageTypeData.setCurEditItem(item);
  props.pageTypeData.setNotifyVisible(true);
};

const visible = ref(false);

</script>

<style scoped lang='scss'>
.mp-ts-sale-and-production-list-page-comp-wrap {
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
