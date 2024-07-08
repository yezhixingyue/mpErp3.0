<template>
  <ul class="mr-element-group-list" v-if="GroupList.length > 0">
    <MRElementGroup v-for="it in GroupList" :key="it.ID" :Group="it" :isRoot="isRoot" :disabled="disabled" />
  </ul>
</template>

<script setup lang='ts'>
import { IMRElementGroup } from '@/views/BasicSetup/FactorySerialization/js/types';
import MRElementGroup from './MRElementGroup.vue';

defineProps<{
  GroupList: IMRElementGroup[]
  disabled?: boolean
  isRoot?: boolean
}>();
</script>

<style scoped lang='scss'>
</style>
