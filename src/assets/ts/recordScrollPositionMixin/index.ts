// 记录滚动位置 --- 在页面缓存

import {
  nextTick, onActivated, onDeactivated, Ref, ref,
} from 'vue';

/**
 使用方式：
  1. ref方式：
  import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';

  const oScrollWrap = ref<InstanceType<typeof HTMLElement> | null>(null);
  recordScrollPosition(oScrollWrap);

  在模板中滚动容器上添加： ref="oScrollWrap"

  2. 类名方式（如果样式中未使用scoped）：

  import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';

  recordScrollPosition('.el-table__body-wrapper');

 */

/**
 * 记录滚动条位置
 *
 * @param {string  | Ref<HTMLElement | null} oScrollWrap
 */
export const recordScrollPosition = (oScrollWrap: string | Ref<HTMLElement | null>) => {
  const SCROLL_Y = ref(0);
  const SCROLL_X = ref(0);

  onDeactivated(() => {
    const oDom = typeof oScrollWrap === 'string' ? document.querySelector(oScrollWrap) : oScrollWrap.value;
    if (!oDom) return;
    SCROLL_Y.value = oDom.scrollTop;
    SCROLL_X.value = oDom.scrollLeft;
  });

  onActivated(() => {
    const oDom = typeof oScrollWrap === 'string' ? document.querySelector(oScrollWrap) : oScrollWrap.value;
    if (!oDom) return;
    nextTick(() => {
      oDom.scrollTop = SCROLL_Y.value;
      oDom.scrollLeft = SCROLL_X.value;
    });
    setTimeout(() => {
      oDom.scrollTop = SCROLL_Y.value;
      oDom.scrollLeft = SCROLL_X.value;
    }, 2);
  });
};
