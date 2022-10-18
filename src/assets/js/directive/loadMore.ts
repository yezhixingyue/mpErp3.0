import Vue, { DirectiveBinding, nextTick } from 'vue';

let bindingsFunc: undefined | (() => void);

const handleScroll = (e: Event) => {
  if (e.target) {
    const el = e.target as HTMLElement;
    const d = el.scrollHeight - el.offsetHeight - el.scrollTop; // 到底部距离
    if (d === 0 && bindingsFunc) bindingsFunc();
  }
};

const VLoadMore = {
  async bind(el:HTMLElement, bindings: DirectiveBinding<() => void> | DirectiveBinding<undefined>) {
    await nextTick();
    bindingsFunc = bindings.value;
    el.addEventListener('scroll', handleScroll);
  },
  unbind(el:HTMLElement) {
    el.removeEventListener('scroll', handleScroll);
  },
};

Vue.directive('loadMore', VLoadMore);
