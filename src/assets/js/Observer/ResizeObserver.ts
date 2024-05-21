/** ResizeObserver是用于监听DOM尺寸变化的observer，当DOM尺寸变化是执行callback */
export const useResizeObserver = () => {
  const target = document.body;

  const resizeObserver = new ResizeObserver(entries => {
    console.log('entries', entries);
    entries.forEach(entry => {
      const { width, height } = entry.contentRect;
      console.log('宽度:', width, '高度:', height);
    });
  });

  resizeObserver.observe(target); // 传入body则可以监听body的尺寸变化

  // resizeObserver.disconnect();
  // resizeObserver.unobserve(target);
};
