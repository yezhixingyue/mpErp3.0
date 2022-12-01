<template>
  <main>
    <mp-empty v-if="isEmpty" description="暂无数据"></mp-empty>
    <div class="content" v-else-if="props.TransformerListPageData" ref="oScrollWrap">
      <TableItem
        v-for="it in props.TransformerListPageData.productList"
        :key="it.ID"
        :item="it"
        :product-class-level-list="props.TransformerListPageData.productClassLevelList"
        @menuClick="onClick"
      />
    </div>
  </main>
</template>

<script setup lang='ts'>
import { TransformerListPageDataPlainType } from '@/pinia/modules/transformer/TransformerListPageDataClass';
import { computed, ref } from 'vue';
import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';
import { IProduct, menuTypeEnum } from '@/pinia/modules/transformer/types';
import TableItem from './TableItem.vue';

const props = defineProps<{
  TransformerListPageData: TransformerListPageDataPlainType | null,
}>();

const emit = defineEmits(['menuClick']);

const isEmpty = computed(() => (!props.TransformerListPageData || props.TransformerListPageData.productList.length === 0)
     && !props.TransformerListPageData?.loading);

const oScrollWrap = ref<InstanceType<typeof HTMLElement> | null>(null);

recordScrollPosition(oScrollWrap);

const onClick = (type: menuTypeEnum, item: IProduct, PartID: string) => {
  if (!props.TransformerListPageData) return;
  props.TransformerListPageData.setCurEditItemAndPart(item, PartID);
  emit('menuClick', type);
};

</script>

<style scoped lang='scss'>
.content {
  overflow: auto;
  overflow: overlay;
  border: 1px solid #e6e6e6;
  height: 100%;
  box-sizing: border-box;
}
</style>
