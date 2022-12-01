<template>
  <div class="mp-empty">
    <div class="mp-empty__image">
      <img src="./empty.svg" alt="">
    </div>
    <div class="mp-empty__description">
      <p>{{description || '暂无数据'}}</p>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  description?: string
}>();
</script>

<style scoped lang='scss'>
.mp-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  padding: 50px 0;
  .mp-empty__image {
    width: 160px;
    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
  .mp-empty__description {
    margin-top: 20px;
    p {
      font-size: 13px;
      color: #989898;
      line-height: 1.5em;
    }
  }
}
</style>
