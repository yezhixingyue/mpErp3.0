<template>
  <div ref="oList">
    <AreaTextInput v-for="(key, index) in list" :key="key" @create="onKeyupEnter(index + 1)" @remove="remove(index)" />
  </div>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue';
import AreaTextInput from './AreaTextInput.vue';

const oList = ref<HTMLDivElement>();

const list = ref<string[]>([]);

const create = (index = 0) => {
  const key = Math.random().toString(32).slice(-10);
  list.value.splice(index, 0, key);
};

const focus = (index: number) => {
  const inputs = oList.value.querySelectorAll('input');
  if (inputs[index]) {
    console.log('focus', inputs[index]);
    inputs[index].focus();
  }
};

const remove = async (index: number) => {
  if (index === 0) return;

  list.value.splice(index, 1);

  await nextTick();

  focus(index - 1);
};

const onKeyupEnter = async (index: number) => { // 创建一行并聚焦该行
  create(index);

  await nextTick();

  focus(index);
};

onMounted(() => {
  create();
});
</script>

<style scoped lang='scss'>
</style>
