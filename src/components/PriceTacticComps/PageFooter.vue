<template>
  <footer>
    <el-button type="primary" size="small" :disabled='loading' @click="onClick">保存</el-button>
  </footer>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      this.$emit('submit');
    },
  },
};
</script>
<style lang='scss'>
</style>
