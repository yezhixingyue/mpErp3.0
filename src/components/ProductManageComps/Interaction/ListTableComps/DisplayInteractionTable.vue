<template>
  <!-- 界面交互组件 -->
  <section>
    <header>
      <span class="mp-common-title-wrap">界面交互</span>
      <span class="blue-span" @click="onInteractionClick(null)">+ 添加交互</span>
    </header>
  </section>
</template>

<script>
export default {
  methods: {
    onInteractionClick(data) {
      this.$emit('setup', data);
    },
  },
  mounted() {

  },
};
</script>
<style lang='scss'>
</style>
