<template>
  <section class="breadcrumb-nav-wrap">
    <p class="is-bold">
      <span @click="onGoBackClick">{{backLabel}}</span>
      <i class="el-icon-arrow-right"></i>
      {{label}}
    </p>
  </section>
</template>

<script>

export default {
  props: {
    backLabel: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.breadcrumb-nav-wrap{
  p{
    margin-bottom: 5px;
    font-size: 12px;
    >span{
      color: #26BCF9;
      cursor: pointer;
    }
  }
}
</style>
