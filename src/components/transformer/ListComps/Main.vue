<template>
  <main>
    <el-empty v-if="isEmpty" description="暂无数据"></el-empty>
    <div class="content" v-else-if="props.TransformerListPageData">
      <TableItem
        v-for="it in props.TransformerListPageData.productList"
        :key="it.ID"
        :item="it"
        :product-class-level-list="props.TransformerListPageData.productClassLevelList"
      />
    </div>
  </main>
</template>

<script setup lang='ts'>
import { TransformerListPageDataPlainType } from '@/store/modules/transformer/TransformerListPageDataClass';
import { computed } from 'vue';
import TableItem from './TableItem.vue';

const props = defineProps<{
  TransformerListPageData: TransformerListPageDataPlainType | null,
}>();

const isEmpty = computed(() => (!props.TransformerListPageData || props.TransformerListPageData.productList.length === 0)
     && !props.TransformerListPageData?.loading);

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
