<template>
  <ServerListPageComp :pageTypeData="pageTypeData" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import ServerListPageComp from '@/components/serverManage/SaleAndProduction/ServerListPageComp.vue';
import { SaleAndProductionPageClassType } from './utils/SaleAndProductionPageClassType';
import { ServerTypeEnum } from './utils/types';

const pageTypeData = ref(new SaleAndProductionPageClassType(ServerTypeEnum.production));
</script>

<script lang='ts'>
export default {
  name: 'ProductionServerListPage',
};
</script>

<style scoped lang='scss'>
</style>
