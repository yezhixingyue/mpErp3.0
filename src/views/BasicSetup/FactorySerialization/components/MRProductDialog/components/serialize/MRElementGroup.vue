<template>
  <li class="mr-element-group" :class="{root: isRoot}">
    <div class="title" v-if="isRoot">
      <span class="label-name" :title="localGroup.Name">{{ localGroup.Name }}</span>
      <el-checkbox v-model="localGroup.IsShow">显示</el-checkbox>
      <el-checkbox :disabled="localDisabled" v-model="localGroup.IsShowName" >显示名称</el-checkbox>
    </div>
    <div class="list" >
      <MRElementList :ElementList="localGroup.List" :disabled="localDisabled" />
    </div>
  </li>
</template>

<script setup lang='ts'>
import { IMRElementGroup } from '@/views/BasicSetup/FactorySerialization/js/types';
import { computed, watch } from 'vue';
import MRElementList from './MRElementList.vue';

const props = defineProps<{
  Group: IMRElementGroup
  disabled?: boolean
  isRoot: boolean
}>();

const localGroup = computed(() => props.Group);
const localDisabled = computed(() => (!props.isRoot ? !!props.disabled : !localGroup.value.IsShow));

if (!props.isRoot) {
  localGroup.value.IsShow = true;
  localGroup.value.IsShowName = false;
}

watch(() => localDisabled.value, (val) => { // 在禁用时，清除勾选数据
  if (val) {
    localGroup.value.IsShowName = false;
  }
});
</script>

<style scoped lang='scss'>
.mr-element-group {
  > .title {
    margin-bottom: 8px;
    display: flex;
  }
  &.root > .list {
    margin-left: 63px;
  }
}
</style>
