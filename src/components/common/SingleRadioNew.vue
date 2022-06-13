<template>
  <span class="mp-single-radio-wrap">
    <el-radio
      :disabled="item.disabled"
      v-model="radio"
      v-for="(item,i) in list" :key="item[defaultProps.value] + '' + i"
      :label="i">
      {{item[defaultProps.label]}}
    </el-radio>
  </span>
</template>

<script>
export default {
  model: {
    props: 'value',
    event: 'change',
  },
  props: {
    /**
     * 单选框选项列表
     */
    list: {
      type: Array,
      default: () => ['备选项1', '备选项2'],
    },
    /**
     * 目前被选中项的ID值
     */
    value: {},
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'name',
        value: 'ID',
      }),
    },
  },
  computed: {
    radio: {
      get() {
        const i = this.list.findIndex(it => it[this.defaultProps.value] === this.value);
        return i;
      },
      set(newVal) {
        this.$emit('change', this.list[newVal][this.defaultProps.value]);
      },
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-single-radio-wrap{
  color: $--color-text-regular;
  .el-radio__input.is-checked+.el-radio__label{
    color: $--color-text-regular;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: $--color-primary;
    background: $--color-white;
    &::after{
      background-color: $--color-primary;
      width: 5px;
      height: 5px;
    }
  }
  .el-radio__label{
    font-size: 12px;
  }
}
</style>
