<template>
  <div class="empty-box">
    <img src="../images/empty.png" alt="">
    <h4>该分类下还没有文章...快去创建吧~</h4>
  </div>
</template>

<script setup lang='ts'>
</script>

<style scoped lang='scss'>
.empty-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #444;
  font-size: 20px;
  padding-top: 15vh;
  img {
    width: 404px;
    height: 271px;
    margin-bottom: 25px;
  }
}
</style>
