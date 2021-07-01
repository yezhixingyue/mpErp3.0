<template>
  <!-- 对比验证组件 -->
  <section>
    <header>
      <span class="mp-common-title-wrap">对比验证</span>
      <span class="blue-span" @click="onCompareClick(null)">+ 添加对比</span>
    </header>
  </section>
</template>

<script>
export default {
  methods: {
    onCompareClick(data) {
      this.$emit('setup', data);
    },
  },
};
</script>
<style lang='scss'>
</style>
