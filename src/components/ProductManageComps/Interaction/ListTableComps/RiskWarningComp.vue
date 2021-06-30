<template>
  <!-- 风险提示组件 -->
  <section>
    <header>
      <span class="mp-common-title-wrap">风险提示</span>
      <span class="blue-span" @click="onRiskSetClick(null)">+ 添加风险提示</span>
    </header>
  </section>
</template>

<script>
export default {
  methods: {
    onRiskSetClick(data) {
      this.$emit('setup', data);
    },
  },
};
</script>
<style lang='scss'>
</style>
