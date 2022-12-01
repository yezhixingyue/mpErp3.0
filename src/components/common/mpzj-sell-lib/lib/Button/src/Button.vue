<template>
  <el-button v-bind="$attrs" v-on="$listeners" class="mp-sell-lib-button">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'Button',
  mounted() {
    const el = this.$el;
    document.addEventListener('mouseup', () => {
      el.blur();
    });
  },
};
</script>
<style scoped lang="scss">
</style>
