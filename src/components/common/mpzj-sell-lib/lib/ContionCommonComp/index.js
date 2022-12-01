// 导入组件，组件必须声明 name
import ContionCommonComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
ContionCommonComp.install = (Vue) => {
  Vue.component(ContionCommonComp.name, ContionCommonComp);
};

// 导出组件
export default ContionCommonComp;
