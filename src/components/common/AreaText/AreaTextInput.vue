<template>
  <input class="input-area" v-model="inputVal" ref="oArea" @keydown="onkeydown" @keyup="onkeyup" @input="oninput" />
</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue';

const emit = defineEmits(['create', 'remove']);

const inputVal = ref('');
const oArea = ref<HTMLTextAreaElement>();

const onkeydown = async (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return;

  const index = oArea.value.selectionStart;
  if (typeof index !== 'number') return;

  const _interpolation = '\t';

  const newVal = inputVal.value.slice(0, index) + _interpolation + inputVal.value.slice(index);

  inputVal.value = newVal;

  await nextTick();

  oArea.value.selectionStart = index + 1;
  oArea.value.selectionEnd = index + 1;

  e.preventDefault();
};

let canRemove = true;

const oninput = () => {
  if (inputVal.value) canRemove = false;
};

const onkeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    emit('create');
  }
  if (e.key === 'Backspace' && !inputVal.value) {
    if (!canRemove) {
      canRemove = true;
      return;
    }
    emit('remove');
  }
};

</script>

<style scoped lang='scss'>
$lineHeight: 30px;

.input-area {
  width: 100%;
  outline: none;
  line-height: $lineHeight;
  // border: none;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
