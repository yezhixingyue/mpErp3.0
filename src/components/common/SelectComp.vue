<template>
  <el-select
   v-model="value"
   :size="size"
   :class="{'font-12': mini, 'mp-common-select-comp-wrap': !useOrigin}"
   :filterable='filterable'
   :disabled='disabled'
   >
    <el-option
      v-for="item in options"
      :key="item.value"
      :disabled='item.disabled'
      :label="item[defaultProps.label]"
      :value="item[defaultProps.value]">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    title: {
      default: '不限',
    },
    options: {
      type: Array,
      default: () => [{
        value: '',
        label: '不限',
      }],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
      }),
    },
    mini: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'mini',
    },
    useOrigin: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    value: {
      get() {
        return this.title;
      },
      set(newVal) {
        if (newVal === this.title) return;
        this.$emit('handleChange', newVal);
      },
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-select-comp-wrap {
  height: 25px;

  .el-input {
    > input {
      border: none;
      border-bottom: 1px solid gainsboro;
      height: 25px;
      width: 110px;
      margin-top: -1px;
      font-size: 13px;
      color: $--color-text-primary;
      &::-webkit-input-placeholder {
        color: rgba($color: $--color-text-primary-light, $alpha: 0.5);
      }
      padding: 0 7px 0 5px;
      line-height: 25px;
      padding-right: 16px;
    }
    &::after {
        content: "";
        position: absolute;
        background: url('../../assets/images/arrowbottom.png') no-repeat center;
        background-size: 100% 100%;
        height: 9px;
        width: 11px;
        right: 5px;
        top: 5px;
        top: 7px;
        right: 4px;
        background: none;
        border: 5px solid #eee;
        width: 0;
        height: 0;
        border-top-width: 6px;
        border-bottom-width: 0px;
        border-color: rgba($color: #000000, $alpha: 0);
        border-top-color: rgba($color: #000000, $alpha: 0.3);
        border-radius: 2px;
    }
    > .el-input__suffix {
        display: none;
    }
  }
  &.font-12 {
    .el-input > input {
      font-size: 12px;
    }
  }
}
</style>
