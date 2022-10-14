<template>
  <section class="mp-ts-sale-and-production-list-page-comp-wrap">
    <header>
      <mp-button :style="buttonStyle" size="small">添加{{props.pageTypeData.options.title}}</mp-button>
      <span class="blue-span">操作日志</span>
    </header>
    <ServerListMainTable :title="props.pageTypeData.options.title" :tableData="props.pageTypeData.list" />
  </section>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { SaleAndProductionPageClassType } from '@/views/serverManage/utils/SaleAndProductionPageClassType';
import ServerListMainTable from './Comps/ServerListMainTable.vue';

const props = defineProps<{
  pageTypeData: SaleAndProductionPageClassType,
}>();

const buttonStyle = ref(`background: ${props.pageTypeData.options.color};border-color:${props.pageTypeData.options.color}`);

console.log(props.pageTypeData);

</script>

<style scoped lang='scss'>
.mp-ts-sale-and-production-list-page-comp-wrap {
  padding-left: 8px;
  > header {
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
