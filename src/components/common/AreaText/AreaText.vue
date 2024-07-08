<template>
  <div class="area-wrap">
    <textarea
      ref="oArea"
      v-model="localVal"
      @keydown="onkeydown"
      @blur="setIndex(-1)"
      @scroll="onscroll"
      @mouseenter="isHover=true"
      @mouseleave="isHover=false"
    />
    <div class="bar" :style="`top:${top}px`" v-show="index >= 0"></div>
  </div>
</template>

<script setup lang='ts'>
import { computed, nextTick, ref, watch } from 'vue';
import { delay } from '../NodePicDialog/js/utils';
import { useScroll, useSelectionChange } from './hooks';
import { TAB_CHAR } from './utils';

const props = defineProps<{
  value: string
  scrollTop: number
  index: number
}>();

const emit = defineEmits(['update:value', 'update:index', 'update:scrollTop', 'lineChange']);

const localVal = computed({
  get() {
    return props.value;
  },
  async set(val: string) {
    const oldVal = props.value;

    emit('update:value', val);

    // 输入内容发生改变 且是自身触发
    if (document.activeElement !== oArea.value) return;

    const newLineCount = val.split('\n').length;
    const oldLineCount = oldVal.split('\n').length;

    if (newLineCount === oldLineCount) return; // 行数没有发生变化

    await nextTick();

    onselectionchange();

    await nextTick();

    emit('lineChange', newLineCount - oldLineCount);
  },
});

const lineHeight = 30;
const top = computed(() => lineHeight * props.index - props.scrollTop);

const oArea = ref<HTMLTextAreaElement>();

const setScrollTop = (num: number) => emit('update:scrollTop', num);
const setIndex = (num: number) => {
  emit('update:index', num);
  setScrollTop(oArea.value.scrollTop);
};

const { isHover, onscroll } = useScroll(oArea, props, setScrollTop);
const { onselectionchange } = useSelectionChange(oArea, localVal, setIndex);

const onkeydown = async (e: KeyboardEvent) => { // Tab事件
  if (e.key !== 'Tab') {
    return;
  }

  const _index = oArea.value.selectionStart;
  if (typeof _index !== 'number') return;

  const newVal = localVal.value.slice(0, _index) + TAB_CHAR + localVal.value.slice(_index);

  localVal.value = newVal;

  await nextTick();

  oArea.value.selectionStart = _index + 1;
  oArea.value.selectionEnd = _index + 1;

  e.preventDefault();
};

watch(() => localVal.value, async (val, oldVal) => {
  if (document.activeElement === oArea.value) return;

  const newLineCount = val.split('\n').length;
  const oldLineCount = oldVal.split('\n').length;
  if (newLineCount === oldLineCount) return; // 行数没有发生变化

  await nextTick();

  const _oArea = oArea;
  _oArea.value.scrollTop = props.scrollTop;

  await delay(10);
  _oArea.value.scrollTop = props.scrollTop;
});
</script>

<style scoped lang='scss'>
$lineHeight: 30px;
$rowActiveBg: lighten(#26bcf9, 32);

.area-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  textarea {
    width: 100% !important;
    height: 100% !important;
    outline: none;
    border: 1px solid #cbcbcb;
    z-index: 9;
    background-color: rgba($color: #000, $alpha: 0);
    position: relative;
    line-height: $lineHeight;
    padding: 0 10px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: overlay;

    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, .25);
      border-radius: 3px;
      transition: background-color 0.1s ease-in-out;

      &:hover {
        background-color: rgba($color: #000, $alpha: 0.4);
      }
    }
  }

  .bar {
    position: absolute;
    z-index: 0;

    left: 0;
    right: 0;
    height: $lineHeight;
    background-color: $rowActiveBg;
  }
}
</style>
