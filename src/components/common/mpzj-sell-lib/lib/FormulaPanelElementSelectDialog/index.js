// 导入组件，组件必须声明 name
import FormulaPanelElementSelectDialog from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
FormulaPanelElementSelectDialog.install = (Vue) => {
  Vue.component(FormulaPanelElementSelectDialog.name, FormulaPanelElementSelectDialog);
};

// 导出组件
export default FormulaPanelElementSelectDialog;
