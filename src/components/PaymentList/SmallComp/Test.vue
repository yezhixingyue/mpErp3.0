<!--
 * @Author: your name
 * @Date: 2020-05-28 10:47:19
 * @LastEditTime: 2020-05-28 11:06:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \orderList\src\components\PaymentList\SmallComp\Test.vue
-->
<template>
  <div class="demo">
    <button @click="show = !show">click</button>
    <transition name='test'>
      <div class="box" v-if="show">hello world</div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    };
  },
};
</script>

<style scoped>
button {
  margin-bottom: 10px;
}

.box {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid red;
  color: red;
}

.test-enter {
  opacity: 0;
}

.test-enter-active {
  transition: opacity 3s;
}

.test-enter-to {
  opacity: 1;
}

.test-leave {
  opacity: 1;
}

.test-leave-active {
  transition: opacity 3s;
}

.test-leave-to {
  opacity: 0;
}

</style>
