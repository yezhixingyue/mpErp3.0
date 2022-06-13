<template>
  <button
   :disabled='disabled' class="normal-full-btn"
   :class="disabled ? 'is-disabled' : ''">{{title}}</button>
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
@import "@/assets/css/var.scss";
    button.normal-full-btn {
        width: 98px;
        height: 28px;
        margin-left: -45px;
        line-height: 28px;
        outline: none;
        color: $--color-white;
        background-color: $--color-blue;
        border: 1px solid $--color-blue;
        cursor: pointer;
        user-select: none;
        transition: .1s;
        &:hover {
            transform: scale(1.005);
            box-shadow: 0 1px 0 #0662a6, 0 1px 1px rgba(0, 0, 0, 0.2);
        }
        &:active {
            color: mix($--color-white, $--color-blue, 80%);
            background-color: mix($--color-white, $--color-blue, 10%);
        }
        &.is-disabled {
          background-color: #ccc !important;
          &:hover {
            transform: none;
            box-shadow: none;
          }
        }
    }
</style>
