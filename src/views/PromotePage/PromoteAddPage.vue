<template>
  <div class="mp-promote-add-page-wrap">
    <promote-add-main class="main" />
    <promote-add-edit-deatil-footer class="footer" />
  </div>
</template>

<script>
import PromoteAddMain from '@/components/Promote/Main/PromoteAddMainIndex.vue';
import PromoteAddEditDeatilFooter from '@/components/Promote/Footer/PromoteAddEditDeatilFooter.vue';

export default {
  name: 'PromoteAddPage',
  components: {
    PromoteAddEditDeatilFooter,
    PromoteAddMain,
  },
};
</script>

<style lang='scss'>
.mp-promote-add-page-wrap {
  height: 100%;
  width: 100%;
  min-width: 1235px;
  background-color: #fff;
  > .main {
    flex: 1;
    height: calc(100% - 200px);
  }
}
</style>
