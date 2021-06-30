<template>
  <section>
    对比面板
    <!-- 右侧说明抽屉面板 -->
    <el-drawer :visible.sync="drawer" size='470px' :show-close='false'>
      <template slot='title'>
        <span class="drawer-title" @click="drawer=false"> <i class="el-icon-arrow-right"></i> 说明</span>
      </template>
      <div class="drawer-content">
        <div>设置时请注意逻辑悖论，例如：</div>
        <p>如果 A > B 则必须满足 A &lt;= B</p>
        <p>如果 A &lt;= B 则必须满足 A > B；</p>
        <p>那么将一直提示错误，无法下单。再如：</p>
        <p>如果 A > B 则必须满足 C > D；</p>
        <p>如果 A &lt;= B 则必须满足 C &lt;= D；</p>
        <p>如果 C > D 则必须满足 A &lt; B；</p>
        <p>如果 C &lt;= D 则必须满足 A > B；</p>
        <p>那么这个产品将无法下单，循环提示错误。</p>
      </div>
    </el-drawer>
  </section>
</template>

<script>
export default {
  props: {
    drawerVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    drawer: {
      get() {
        return this.drawerVisible;
      },
      set(val) {
        this.$emit('update:drawerVisible', val);
      },
    },
  },
};
</script>
<style lang='scss'>
</style>
