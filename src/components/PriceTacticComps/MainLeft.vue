<template>
  <div>
    <ul>
      <li
        v-for="it in list"
        :key="it.CategoryID"
        :class="{ active: it.CategoryID === CustomerGradeID }"
        @click="onSwitchClick(it.CategoryID)"
      >
        <span class="n">{{ it.CategoryName }}</span>
        <i class="el-icon-success is-success is-font-size-20" v-if="it.HaveActivatePolicy"></i>
        <span class="is-gray" v-if="it.FutureTime">{{it.FutureTime}}</span>
      </li>
    </ul>
    <div class="f">
      <el-button size="small" class="cancel-blue-btn" @click="onFillClick" :disabled='loading'>填充当前执行价</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    CustomerGradeID: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onSwitchClick(e) {
      if (e === this.CustomerGradeID) return;
      this.$emit('switch', e);
    },
    onFillClick() {
      this.$emit('fill');
    },
  },
};
</script>
<style lang='scss'>
</style>
