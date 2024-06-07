<template>
  <div class="mr-size-group" v-if="localSizeGroup">
    <div class="title">
      <span class="label-name" :title="localSizeGroup.Name">{{ localSizeGroup.Name }}</span>
      <el-checkbox v-model="localSizeGroup.IsShow">显示</el-checkbox>
      <el-checkbox :disabled="!localSizeGroup.IsShow" v-model="localSizeGroup.IsShowName" >显示名称</el-checkbox>
      <el-checkbox :disabled="!localSizeGroup.IsShow" v-model="localSizeGroup.IsShowGenerateName" >优先显示固定尺寸名称</el-checkbox>
    </div>
    <div class="list">
      <MRElementList :ElementList="localSizeGroup.List" :disabled="!localSizeGroup.IsShow" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { IMRSizeGroup } from '@/views/BasicSetup/FactorySerialization/js/types';
import { computed, watch } from 'vue';
import MRElementList from './MRElementList.vue';

const props = defineProps<{
  SizeGroup?: IMRSizeGroup
}>();

const localSizeGroup = computed(() => props.SizeGroup);

watch(() => localSizeGroup.value.IsShow, (val) => { // 在禁用时，清除勾选数据
  if (!val) {
    localSizeGroup.value.IsShowName = false;
    localSizeGroup.value.IsShowGenerateName = false;
  }
});
</script>

<style scoped lang='scss'>
.mr-size-group {
  > .title {
    margin-bottom: 8px;
    display: flex;
  }
  > .list {
    margin-left: 63px;
  }
}
</style>
