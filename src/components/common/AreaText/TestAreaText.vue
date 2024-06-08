<template>
  <section style="display: flex;">
    <AreaTextInputList style="width: 320px;margin: 0 10px;" />
    <TextArea :index.sync="index" style="height: 360px;width: 200px;" />
    <TextArea :index.sync="index" style="height: 360px;width: 200px;margin-left: 10px;" />
    {{ index }}
  </section>
</template>

<script setup lang='ts'>
import AreaTextInputList from './AreaTextInputList.vue';
import TextArea from './AreaText.vue';
import { ref } from 'vue';

const index = ref(-1);
</script>

<style scoped lang='scss'>
</style>
