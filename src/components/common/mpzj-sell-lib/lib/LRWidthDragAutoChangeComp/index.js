// 导入组件，组件必须声明 name
import LRWidthDragAutoChangeComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
LRWidthDragAutoChangeComp.install = (Vue) => {
  Vue.component(LRWidthDragAutoChangeComp.name, LRWidthDragAutoChangeComp);
};

// 导出组件
export default LRWidthDragAutoChangeComp;
