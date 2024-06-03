<template>
  <div v-if="localMaterial" class="mb-7" style="display: flex;">
    <span class="label-name" :title="localMaterial.Name">{{ localMaterial.Name }}</span>
    <el-checkbox v-model="localMaterial.IsShow">显示</el-checkbox>
    <el-checkbox :disabled="!localMaterial.IsShow" v-model="localMaterial.IsShowName">显示名称</el-checkbox>
  </div>
</template>

<script setup lang='ts'>
import { IMRPart } from '@/views/BasicSetup/FactorySerialization/js/types';
import { computed } from 'vue';

const props = defineProps<{
  Material?: IMRPart['Material']
}>();

const localMaterial = computed(() => props.Material);
</script>

<style scoped lang='scss'>
</style>
