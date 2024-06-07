<template>
  <div class="area-wrap">
    <div class="area-box">
      <textarea class="area" v-model="inputVal" ref="oArea" @keydown="onkeydown" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue';

const inputVal = ref('');
const oArea = ref<HTMLTextAreaElement>();

const onkeydown = async (e: KeyboardEvent) => {
  if (e.code !== 'Tab') return;

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

</script>

<style scoped lang='scss'>
$lineHeight: 30px;

.area-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  .area-box {
    width: 100%;
    height: 100%;
    z-index: 9;
    background-color: rgba($color: #000, $alpha: 0);
    position: relative;

    .area {
      width: 100% !important;
      height: 100% !important;
      outline: none;
      border: 1px solid #cbcbcb;
      background-color: rgba($color: #000, $alpha: 0);
      line-height: $lineHeight;
      padding: 0 10px;
      box-sizing: border-box;
      white-space: nowrap;
    }
  }

  &::before {
    content: '';
    position: absolute;
    z-index: 0;

    left: 0;
    right: 0;
    top: 0;
    height: $lineHeight;
  }
}
</style>
