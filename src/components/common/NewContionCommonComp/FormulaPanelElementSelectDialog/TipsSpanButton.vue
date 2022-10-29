<template>
  <el-tooltip popper-class="mp-common-tip-span-btn-popper-box" :open-delay='60'
   :class="{'red': isRed, 'mp-common-tip-span-btn-box': !!text}"
   :visible-arrow='false' transition='none' :enterable='false' :content="tipContent || text" :placement="placement">
    <span v-if="text" :class="disabled ? 'disabled' : ''">{{text}}</span>
    <slot />
  </el-tooltip>
</template>

<script>
export default {
  props: {
    text: {
      // required: true,
    },
    isRed: {
      default: false,
      type: Boolean,
    },
    tipContent: {
      default: '',
      type: String,
    },
    placement: {
      default: 'bottom',
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
};
</script>
<style lang='scss'>
.mp-common-tip-span-btn-box {
  color: #26bcf9;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.1s ease-in-out;
  user-select: none;
  &.red {
    color: #FF3769;
  }
  &:hover {
    color: #f00;
  }
  &:active {
    color: #e42a2a;
  }
  &.disabled {
    user-select: none;
    color: #cbcbcb;
    pointer-events: none;
  }
}
</style>
