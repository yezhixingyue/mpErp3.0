<template>
  <footer>
    <MpPagination center
      :watchPage="Page"
      :count="listNumber"
      :pageSize="PageSize"
      :handlePageChange="(num) => emit('getList', num)"
    >
      <span class="blue-span excel" :class="{disabled:!listNumber}" @click="emit('excel')">导出Excel</span>
    </MpPagination>
  </footer>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/Count.vue';

defineProps<{
  Page: number
  PageSize: number
  listNumber: number
}>();

const emit = defineEmits(['getList', 'excel']);
</script>

<style scoped lang='scss'>
.excel {
  position: absolute;
  right: 220px;
}

@media screen and (max-width: 1000px) {
  .excel {
    display: none;
  }
}
</style>
