<template>
  <span class="mp-xaxis-type-title">{{title}}</span>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '默认标题',
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
span.mp-xaxis-type-title{
  &::before {
    content: "";
    width: 13px;
    height: 8px;
    display: inline-block;
    background-color: $--color-text-orgin;
    vertical-align: 8%;
    margin-right: 10px;
  }
  color: $--color-text-regular;
  font-weight: 600;
  user-select: none;
}
</style>
