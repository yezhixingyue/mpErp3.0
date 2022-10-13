/* eslint-disable @typescript-eslint/no-this-alias */

/**
   * @desc 函数防抖 -- 在某种操作延迟一段时间后再执行，如果中间一直有操作则一直延迟
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param immediate true 表立即执行，false 表非立即执行  --立即执行指先执行一次然后再开始防抖判断
   */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce(func: (...args: any[]) => void, wait: number, immediate: boolean) {
  let timeout: null | number = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function a(this: any, ...args: any[]) {
    const context = this;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}
/**
   * @desc 函数节流 -- 一段时间内只允许执行一次事件，防止在极短时间内触发大量事件
   * @param {*} func 函数
   * @param {*} delay 延迟多长时间后执行
   * @returns
   */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle(func: (...args: any[]) => void, delay: number) {
  // let timer = null;
  let startTime = Date.now();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function b(this: any, ...args: any[]) {
    const curTime = Date.now();
    const remaining = delay - (curTime - startTime);
    const context = this;
    if (remaining <= 0) {
      func.apply(context, args);
      startTime = Date.now();
    }
  };
}

export default { debounce, throttle };
