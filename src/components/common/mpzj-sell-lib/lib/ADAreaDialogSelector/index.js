// 导入组件，组件必须声明 name
import ADAreaDialogSelector from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
ADAreaDialogSelector.install = (Vue) => {
  Vue.component(ADAreaDialogSelector.name, ADAreaDialogSelector);
};

// 导出组件
export default ADAreaDialogSelector;
