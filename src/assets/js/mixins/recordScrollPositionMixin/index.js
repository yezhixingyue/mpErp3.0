// 记录滚动位置 --- 在页面缓存

export default (domStr) => ({
  data() {
    return {
      SCROLL_Y: 0,
      SCROLL_X: 0,
    };
  },
  deactivated() {
    const oDom = document.querySelector(domStr);
    if (!oDom) return;
    this.SCROLL_Y = oDom.scrollTop;
    this.SCROLL_X = oDom.scrollLeft;
  },
  activated() {
    const oDom = document.querySelector(domStr);
    if (!oDom) return;
    this.$nextTick(() => {
      oDom.scrollTop = this.SCROLL_Y;
      oDom.scrollLeft = this.SCROLL_X;
    });
    setTimeout(() => {
      oDom.scrollTop = this.SCROLL_Y;
      oDom.scrollLeft = this.SCROLL_X;
    }, 2);
  },
});
