<template>
  <div :class="isArea ? 'area' : ''">
    <input v-if="!isArea" class="wrap" v-model="inputVal" ref="oArea" @keydown="onkeydown" />
    <div v-else class="area-box">
      <textarea class="wrap" v-model="inputVal" ref="oArea" @keydown="onkeydown" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue';

defineProps<{
  isArea?: boolean
}>();

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
.wrap {
  // height: 300px;
  width: 200px;
  outline: none;
  line-height: 30px;
  border: none;
  padding: 0;
  background-color: #ccc;
}

.area {
  background-color: #ccc;

  position: relative;

  .area-box {
    height: 100%;
    z-index: 9;
    background-color: rgba($color: #000, $alpha: 0);
    position: relative;

    textarea {
      height: 100%;
      background-color: rgba($color: #000, $alpha: 0);
    }
  }

  &::before {
    content: '';
    left: 0;
    right: 0;
    position: absolute;
    top: 0;
    height: 30px;
    background-color: #f40;
    z-index: 0;
  }
}
</style>
