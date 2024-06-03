<template>
  <li class="mp-craft">
    <div class="title">
      <span class="label-name" :title="localCraft.Name">{{ localCraft.Name }}</span>
      <el-checkbox v-model="localCraft.IsShow">显示</el-checkbox>
      <el-checkbox :disabled="!localCraft.IsShow" v-model="localCraft.IsShowName" v-if="hasList">显示名称</el-checkbox>
    </div>

    <div class="list">
      <!-- 元素 -->
      <MRElementList :ElementList="localCraft.ElementList" :disabled="!localCraft.IsShow" />

      <!-- 元素组 -->
      <MRElementGroupList :GroupList="localCraft.GroupList" :disabled="!localCraft.IsShow" />
    </div>
  </li>
</template>

<script setup lang='ts'>
import { IMRCraft } from '@/views/BasicSetup/FactorySerialization/js/types';
import { computed } from 'vue';
import MRElementList from './MRElementList.vue';
import MRElementGroupList from './MRElementGroupList.vue';

const props = defineProps<{
  Craft: IMRCraft
}>();

const localCraft = computed(() => props.Craft);

const hasList = computed(() => props.Craft.ElementList.length || props.Craft.GroupList.length);
</script>

<style scoped lang='scss'>
.mp-craft {

  > .title {
    display: flex;
    margin-bottom: 8px;
  }

  > .list {
    margin-left: 63px;
  }
}
</style>
