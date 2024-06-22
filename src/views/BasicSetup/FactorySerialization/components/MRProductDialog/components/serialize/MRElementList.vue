<template>
  <ul class="mr-element-list" v-if="ElementList.length > 0">
    <MRElement v-for="it in ElementList" :key="it.ID" :Element="it" :isRoot="isRoot" :disabled="disabled" />
  </ul>
</template>

<script setup lang='ts'>
import { IMRElement } from '@/views/BasicSetup/FactorySerialization/js/types';
import MRElement from './MRElement.vue';

defineProps<{
  ElementList: IMRElement[]
  disabled?: boolean
  isRoot?: boolean
}>();
</script>

<style scoped lang='scss'>
</style>
