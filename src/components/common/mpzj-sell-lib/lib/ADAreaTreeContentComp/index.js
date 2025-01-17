// 导入组件，组件必须声明 name
import ADAreaTreeContentComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
ADAreaTreeContentComp.install = (Vue) => {
  Vue.component(ADAreaTreeContentComp.name, ADAreaTreeContentComp);
};

// 导出组件
export default ADAreaTreeContentComp;
