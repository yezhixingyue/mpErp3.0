<template>
  <el-select
   v-model="result"
   class="mp-erp-new-common-select-comp-wrap"
   :filterable='filterable'
   size="small"
   >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item[defaultProps.label]"
      :value="item[defaultProps.value]">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
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
    filterable: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  computed: {
    result: {
      get() {
        return this.value;
      },
      set(newVal) {
        if (newVal === this.value) return;
        this.$emit('change', newVal);
      },
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-erp-new-common-select-comp-wrap {
  // height: 25px;

  .el-input {
    > input {
      // border: none;
      // border-bottom: 1px solid gainsboro;
      // height: 25px;
      // width: 110px;
      // margin-top: -1px;
      font-size: 13px;
      // color: $--color-text-primary;
      // &::-webkit-input-placeholder {
      //   color: rgba($color: $--color-text-primary-light, $alpha: 0.5);
      // }
      // padding: 0 7px 0 5px;
      // line-height: 25px;
    }
    // &::after {
    //     content: "";
    //     position: absolute;
    //     background: url('../../../assets/images/arrowbottom.png') no-repeat center;
    //     background-size: 100% 100%;
    //     height: 9px;
    //     width: 11px;
    //     right: 5px;
    //     top: 5px;
    // }
    // > .el-input__suffix {
    //     display: none;
    // }
  }
}
</style>
