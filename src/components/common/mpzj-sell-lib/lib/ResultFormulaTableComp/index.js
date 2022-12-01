// 导入组件，组件必须声明 name
import ResultFormulaTableComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
ResultFormulaTableComp.install = (Vue) => {
  Vue.component(ResultFormulaTableComp.name, ResultFormulaTableComp);
};

// 导出组件
export default ResultFormulaTableComp;
