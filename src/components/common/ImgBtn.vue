<template>
  <div class="order-img-btn-wrap" :class="{'is-disabled': disabled}">
    <span @click="onClick"><img :src="url">{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '售后',
    },
    url: {
      default: '@/assets/images/service.png',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      this.$emit('handleClick');
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.order-img-btn-wrap {
  cursor: pointer;
  > span {
    color: $--color-text-light;
    &:hover {
      color: $--color-text-table;
    }
    > img {
      margin-right: 8px;
      position: relative;
      top: 3px;
      width: 15px;
    }
  }
  &.is-disabled{
    cursor: not-allowed;
  }
}
</style>
