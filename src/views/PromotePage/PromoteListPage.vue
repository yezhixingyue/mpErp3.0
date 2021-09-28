<template>
  <div class="mp-promote-list-page-wrap">
    <promote-header />
    <promote-main />
  </div>
</template>

<script>
import PromoteHeader from '@/components/Promote/Header/PromoteHeaderIndex.vue';
import PromoteMain from '@/components/Promote/Main/PromoteListMainIndex.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'PromoteListPage',
  mixins: [recordScrollPositionMixin('.mp-promote-list-page-wrap .el-table__body-wrapper')],
  components: {
    PromoteHeader,
    PromoteMain,
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-promote-list-page-wrap {
  width: 100%;
  height: 100%;
  background-color: $--bg-color-base;
}
</style>
