<template>
  <div class="mp-vertical-type-title">
    <div class="img-box">
      <img :src="imgSrc" alt="">
    </div>
    <span class="title">{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '默认标题',
    },
    imgSrc: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-vertical-type-title{
  width: 60px;
  text-align: center;
  user-select: none;
  > .title {
   color: $--color-text-primary;
    font-weight: 600;
    user-select: none;
    width: 60px;
    display: inline-block;
  }
  > .img-box {
    height: 26px;
    width: 26px;
    background-image: linear-gradient(233deg,#35dff9 0%, #26bcf9 100%);
    border-radius: 50%;
    margin: 0 auto;
    line-height: 32px;
    margin-bottom: 14px;
  }
}
</style>
