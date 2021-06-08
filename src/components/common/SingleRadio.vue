<template>
  <span class="mp-single-radio-wrap">
    <el-radio @change="onChange" :disabled="!item.type"
      v-model="radio" v-for="(item,i) in list" :key="item + '-' + i"  :label="i">
      {{item.value}}
    </el-radio>
  </span>
</template>

<script>
export default {
  props: {
    /**
     * 单选框选项列表
     */
    list: {
      type: Array,
      default: () => ['备选项1', '备选项2'],
    },
    /**
     * 更改选择项后的回调函数
     */
    handleSwitch: {
      type: Function,
      default: () => {},
    },
    /**
     * 监听该值，当该值发生变化，设置radio状态
     */
    watchValue: {},
    /**
     * 起始 默认选择项， 数字类型，代表默认选中列表中的第几项
     */
    defaultRadio: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      radio: '',
    };
  },
  methods: {
    onChange(e) {
      this.handleSwitch(e);
      this.timer = setTimeout(() => { if (e === 0) this.radio = 0; }, 0);
    },
    getDefaultRadio() { // 设置默认选择项
      if (this.defaultRadio === -1) this.radio = '';
      this.radio = this.defaultRadio;
    },
  },
  watch: {
    watchValue(newVal) {
      if (newVal) return;
      this.getDefaultRadio();
    },
  },
  mounted() {
    this.getDefaultRadio();
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
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
