<template>
  <section class="mp-ts-sale-and-production-list-page-comp-wrap">
    <header>
      <mp-button :style="buttonStyle" size="small" @click="setup(null)">添加{{props.pageTypeData.options.title}}</mp-button>
      <span class="blue-span" @click="visible = true">操作日志</span>
    </header>
    <MainTable
     :title="props.pageTypeData.options.title"
     :tableData="props.pageTypeData.list"
     @edit="setup"
     @remove="onRemoveClick"
     @generate="onGenerateClick"
    />
    <Dialog :pageTypeData="props.pageTypeData" />
    <OperationLogDialog :visible.sync="visible" :type="props.pageTypeData.options.type" />
  </section>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { SaleAndProductionPageClassType } from '@/views/serverManage/utils/SaleAndProductionPageClassType';
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import OperationLogDialog from '@/components/LogComp/OperationLogDialog.vue';
import MainTable from './Comps/ServerListMainTable.vue';
import Dialog from './Comps/ServerSetupDialog.vue';

const props = defineProps<{
  pageTypeData: SaleAndProductionPageClassType,
}>();

const buttonStyle = ref(`background: ${props.pageTypeData.options.color};border-color:${props.pageTypeData.options.color}`);

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
  > main {
    flex: 1;
  }
}
</style>
