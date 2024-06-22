import { onActivated, onDeactivated, onMounted, onUnmounted, Ref, ref, watch, WritableComputedRef } from 'vue';
import { NEW_LINE_CHAR } from './utils';

/** 处理滚动相关 */
export const useScroll = (oArea: Ref<HTMLTextAreaElement | null>, props: Readonly<{ scrollTop: number }>, setScrollTop: (num: number) => void) => {
  const isHover = ref(false);

  const onscroll = () => { // 触发
    if (!isHover.value || !oArea.value) return;

    setScrollTop(oArea.value.scrollTop);
  };

  watch(() => props.scrollTop, (val) => {
    if (!oArea.value || isHover.value) return;
    const _oArea = oArea;
    _oArea.value.scrollTop = val;
  });

  return { onscroll, isHover };
};

/** 处理光标移动相关 */
export const useSelectionChange = (oArea: Ref<HTMLTextAreaElement | null>, inputVal: WritableComputedRef<string>, setIndex: (index: number) => void) => {
  const onselectionchange = () => {
    if (document.activeElement !== oArea.value) return;

    // 获取当前正处于第几行位置
    const reg = new RegExp(NEW_LINE_CHAR, 'g');

    const _index = oArea.value.selectionStart; // 当前光标所处位置
    const _leftContent = inputVal.value.slice(0, _index);

    const newIndex = _leftContent.match(reg)?.length || 0;

    setIndex(newIndex);
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

  return { onselectionchange };
};
