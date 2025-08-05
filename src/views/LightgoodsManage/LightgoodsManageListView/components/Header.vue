<template>
  <header class="header">
    <el-button type="primary" class="mp-common-btn-styles" @click="visible = true">+ 新增“抛货类”产品</el-button>

    <SearchInputComp
      :typeList="[['KeyWords', '']]"
      title="产品名称"
      placeholder='请输入产品名称'
      :requestFunc='getList'
      :changePropsFunc='setConditon'
      :word='condition.KeyWords'
      :searchWatchKey="list"
      resetWords='清空所有筛选条件'
      @reset='() => clearCondition()'
      />

    <ProductionAddDialog :visible.sync="visible" @submit="handleAddSubmit"
     :lightgoodsPoductIds="lightgoodsPoductIds" @update:lightgoodsPoductIds="e => setLightgoodsPoductIds(e)" />
  </header>
</template>

<script setup lang='ts'>
import { Message } from 'element-ui';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import { LightgoodsListCondition } from '../models/LightgoodsListCondition';
import { ManageLightgoodsListClass } from '../models/ManageLightgoodsListClass';
import ProductionAddDialog from './ProductionAddDialog.vue';
import { ref } from 'vue';
import { IBaseProduct } from '../../types/types';

const props = defineProps<{
  condition: LightgoodsListCondition
  getList:() => void
  clearCondition: () => void
  setConditon: (params) => void
  list: ManageLightgoodsListClass['list']
  lightgoodsPoductIds: ManageLightgoodsListClass['lightgoodsPoductIds']
  addProduct: (product: IBaseProduct) => Promise<boolean>
  setLightgoodsPoductIds: (ids:ManageLightgoodsListClass['lightgoodsPoductIds']) => void
}>();

const getList = () => props.getList();
const setConditon = (e) => props.setConditon(e);

const visible = ref(false);
const handleAddSubmit = async (product: IBaseProduct) => {
  if (await props.addProduct(product)) {
    Message.success('添加成功!');
    visible.value = false;
  }
};
</script>

<style scoped lang='scss'>
.header {
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .mp-common-btn-styles {
    width: 150px !important;
    font-size: 14px;
    height: 35px !important;
    width: 165px !important;
    border-radius: 4px;
  }
}
</style>
