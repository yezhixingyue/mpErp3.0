<template>
  <footer v-if="props.TransformerListPageData">
    <Pager
      center
     :pageSize="props.TransformerListPageData.condition.PageSize"
     :count="props.TransformerListPageData.productListNumber"
     :watchPage="props.TransformerListPageData.condition.Page"
     :handlePageChange="props.TransformerListPageData.getProductList.bind(props.TransformerListPageData)"
     />
  </footer>
</template>

<script setup lang='ts'>
import { TransformerListPageDataPlainType } from '@/pinia/modules/transformer/TransformerListPageDataClass';
import { Pager } from '@/components/common/mpzj-sell-lib/lib';

const props = defineProps<{
  TransformerListPageData: TransformerListPageDataPlainType | null,
}>();

</script>

<style scoped lang='scss'>
</style>
