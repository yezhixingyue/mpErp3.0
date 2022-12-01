import Pager from './src/pager.vue';

// 为组件提供 install 安装方法，供按需引入
Pager.install = (Vue) => {
  Vue.component(Pager.name, Pager);
};

// 导出组件
export default Pager;
