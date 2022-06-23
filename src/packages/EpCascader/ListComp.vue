<template>
  <el-scrollbar>
    <ul>
      <li v-for="(it, i) in list" :key="i" @mouseenter="onmouseenter(it)">
        <span class="label">{{it.ClassName}}</span>
        <i class="el-icon-arrow-right"></i>
      </li>
    </ul>
  </el-scrollbar>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onmouseenter(it) {
      this.$emit('hover', it);
    },
  },
};
</script>
<style lang='scss'>
</style>
