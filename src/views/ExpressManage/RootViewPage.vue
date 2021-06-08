<template>
  <div :style='pageWidth'>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'ExpressRootViewPage',
  computed: {
    pageWidth() {
      return 'width:100%';
    },
  },
};
</script>
<style lang='scss'>
</style>
