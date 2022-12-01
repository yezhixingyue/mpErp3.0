import SearchInputComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
SearchInputComp.install = (Vue) => {
  Vue.component(SearchInputComp.name, SearchInputComp);
};

// 导出组件
export default SearchInputComp;
