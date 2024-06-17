<template>
  <!-- 元素 -->
  <MRElementList v-if="item.Type === DisplayTypeEnum.Element" :ElementList="Part.ElementList.filter(it => item.Property.ID === it.ID)" isRoot />

  <!-- 元素组 -->
  <MRElementGroupList v-else-if="item.Type === DisplayTypeEnum.Group" :GroupList="Part.ElementGroupList.filter(it => item.Property.ID === it.ID)" isRoot />

  <!-- 尺寸组 - 可能为空 -->
  <MRSizeGroup v-else-if="item.Type === DisplayTypeEnum.SizGroup" :SizeGroup="Part.SizeGroup" />

  <!-- 物料信息 - 可能为空 -->
  <MRMaterial v-else-if="item.Type === DisplayTypeEnum.Material" :Material="Part.Material" />

  <!-- 工艺 -->
  <MRCraftList v-else-if="item.Type === DisplayTypeEnum.Craft" :CraftList="getCraftList()" />
</template>

<script setup lang='ts'>
import { IMRPart } from '../../../js/types';
import MRElementList from './serialize/MRElementList.vue';
import MRElementGroupList from './serialize/MRElementGroupList.vue';
import MRSizeGroup from './serialize/MRSizeGroup.vue';
import MRMaterial from './serialize/MRMaterial.vue';
import MRCraftList from './serialize/MRCraftList.vue';
import { ProductDisplayPropertyTypeEnum as DisplayTypeEnum } from '../../../js/enum';

const props = defineProps<{
  Part: IMRPart
  item: IMRPart['DisplayList'][number]
}>();

const getCraftList = () => {
  if (props.item.Type !== DisplayTypeEnum.Craft) return [];
  const craftGroupList = props.Part.CraftGroupList.find(it => it.ID === props.item.Property.ID);
  return props.Part.CraftList.filter(craft => craftGroupList.List.includes(craft.ID));
};
</script>

<style scoped lang='scss'>
</style>
