<template>
  <ul>
    <MRCraft v-for="it in CraftList" :key="it.ID" :Craft="it" />
  </ul>
</template>

<script setup lang='ts'>
import { IMRCraft } from '@/views/BasicSetup/FactorySerialization/js/types';
import MRCraft from './MRCraft.vue';

defineProps<{
  CraftList: IMRCraft[]
}>();
</script>

<style scoped lang='scss'>
</style>
