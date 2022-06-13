<template>
  <div id="CustomImage">
    <el-image v-bind="$attrs" v-on="$listeners">
      <div slot="error" class="image-slot">
        <i class="el-icon-warning-outline"></i>
      </div>
      <div slot="placeholder" class="placeholder-slot">加载中...</div>
    </el-image>
  </div>
</template>

<script>
export default {
  name: 'CustomImage',
  mounted() {
    // console.log(this.$attrs, this.$listeners);
  },
};
</script>
<style scoped lang="scss">
  #CustomImage {
    .image-slot {
      text-align: center;
    }

    .placeholder-slot {
      text-align: center;
    }
  }
</style>
