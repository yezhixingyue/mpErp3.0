<template>
  <div class="area-wrap" :class="localIndex >= 0 ? `top-${top}` : ''">
    <div class="area-box">
      <textarea v-model="localInputVal" ref="oArea" @keydown="onkeydown" @blur="localIndex = -1" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, nextTick, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue';
import { NEW_LINE_CHAR, TAB_CHAR } from './utils';

const props = defineProps<{
  index: number
}>();

const emit = defineEmits(['update:index']);

const localInputVal = ref('1\n2\n3\n5\n6\n4\n7\n8\n9\n0');

const localIndex = computed({
  get() {
    return props.index;
  },
  set(val) {
    emit('update:index', val);
  },
});

const lineHeight = 30;
const top = computed(() => lineHeight * localIndex.value);

const oArea = ref<HTMLTextAreaElement>();

const onkeydown = async (e: KeyboardEvent) => {
  if (e.code !== 'Tab') return;

  const _index = oArea.value.selectionStart;
  if (typeof _index !== 'number') return;

  const newVal = localInputVal.value.slice(0, _index) + TAB_CHAR + localInputVal.value.slice(_index);

  localInputVal.value = newVal;

  await nextTick();

  oArea.value.selectionStart = _index + 1;
  oArea.value.selectionEnd = _index + 1;

  e.preventDefault();
};

const onselectionchange = () => {
  if (document.activeElement !== oArea.value) return;

  // 获取当前正处于第几行位置
  const reg = new RegExp(NEW_LINE_CHAR, 'g');

  const _index = oArea.value.selectionStart; // 当前光标所处位置
  const _leftContent = localInputVal.value.slice(0, _index);

  localIndex.value = _leftContent.match(reg)?.length || 0;
};

onMounted(() => {
  document.addEventListener('selectionchange', onselectionchange);
});
onUnmounted(() => {
  document.removeEventListener('selectionchange', onselectionchange);
});
onActivated(() => {
  document.addEventListener('selectionchange', onselectionchange);
});
onDeactivated(() => {
  document.removeEventListener('selectionchange', onselectionchange);
});
</script>

<style scoped lang='scss'>
$lineHeight: 30px;
$rowActiveBg: lighten(#26bcf9, 32);

.area-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  // overflow: hidden;

  .area-box {
    width: 100%;
    height: 100%;
    z-index: 9;
    background-color: rgba($color: #000, $alpha: 0);
    position: relative;

    textarea {
      width: 100% !important;
      height: 100% !important;
      outline: none;
      border: 1px solid #cbcbcb;
      background-color: rgba($color: #000, $alpha: 0);
      line-height: $lineHeight;
      padding: 0 10px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: overlay;
      &::-webkit-scrollbar{
        width: 6px;
        height: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0, .25);
        border-radius: 3px;
        transition: background-color 0.1s ease-in-out;
        &:hover {
          background-color: rgba($color: #000, $alpha: 0.4);
        }
      }
    }
  }

  &::before {
    content: '';
    position: absolute;
    z-index: 0;

    left: 0;
    right: 0;
    height: $lineHeight;
  }
}
@for $num from 0 through 1000 {
  .top-#{$num}.area-wrap::before {
    top: #{$num}px;
    background-color: $rowActiveBg;
  };
}
</style>
