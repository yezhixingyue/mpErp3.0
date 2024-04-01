/** MutationObserver: 对于需要监听DOM变化的场景可考虑使用MutationObserver */
export const useMutationObserver = (node?: HTMLElement) => {
  const targetNode = node || document.getElementById('app'); // Observer需要一个用于监听的目标DOM 后续可改为从外部传入

  console.log('targetNode', targetNode);

  // 当观察到变动时执行的回调函数，mutationsList包含本次变更的信息
  const callback: MutationCallback = (mutationsList, observer) => {
    console.log('callback mutationsList:', mutationsList, ' === observer:', observer);
    // 使用mutationsList中的记录做出相应的反应
    mutationsList.forEach(mutation => {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.');
      } else if (mutation.type === 'attributes') {
        console.log(`The ${mutation.attributeName} attribute was modified.`, mutation);
      }
    });
  };

  const observer = new MutationObserver(callback);

  // 用于确定mutation监听变化的范围
  const config = {
    attributes: true, // 监听目标节点的属性变化，例如id，class等属性 - 不需要则不传递
    attributeFilter: ['data-id'], // 要监听哪些属性变化，不传此字段则监听全部
    attributeOldValue: true, // 是否记录改变属性的旧值，不传递或false则不记录
    characterData: true, // 监听TextNode需要额外配置，默认TextNode变化不会触发callback
    characterDataOldValue: true, // 是否记录其旧值，类同attributeOldValue
    childList: true, // 是否监听直接子节点增删，不包含其属性变化
    subtree: false, // 是否递归监听整个dom树所有节点的属性与子节点的增删
  };

  observer.observe(targetNode, config); // 可以多次调用 以 同时监听多个dom的变化

  // 其它方法
  // observer.disconnect(); // 1. 停止监听

  // const list: MutationRecord[] = observer.takeRecords(); // 2. 清空记录队列并返回里面的内容, 通常使用在调用disconnect时又不想丢失之前的mutationRecords
  // console.log(list);
};
