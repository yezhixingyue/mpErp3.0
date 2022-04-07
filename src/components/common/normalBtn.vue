<template>
  <button class="normal-btn" :class="{'is-disabled':disabled}">{{title}}</button>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '关闭',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
    button.normal-btn {
        width: 98px;
        height: 28px;
        margin-left: -45px;
        line-height: 18px;
        outline: none;
        color: $--color-primary;
        background-color: $--color-white;
        border: 1px solid $--color-primary;
        cursor: pointer;
        user-select: none;
        vertical-align: -1px;
        &:hover {
            background-color: $--color-white;
            // box-shadow: 0 0px 1px 1px rgba(38, 188, 249, 0.2);
            transform: scale(1.005);
            // box-shadow: 1px 1px 1px #0d66aa, 0 1px 1px rgba(0, 0, 0, 0.4);
            // background: linear-gradient($--color-white,rgba($--color-primary,0.1));
            box-shadow: 0px 1px 3px #ddd;
        }
        &:active {
            color: mix($--color-white, $--color-primary, 10%);
            background-color: rgba(168, 168, 168, 0.1);
        }
        &.is-disabled {
          background-color: #f5f5f5 !important;
          border-color: #eee;
          color: #aaa !important;
          pointer-events: none;
        }
    }
</style>
