// 导入组件，组件必须声明 name
import EpCascader from './main/index.vue';

// 为组件提供 install 安装方法，供按需引入
EpCascader.install = (Vue) => {
  Vue.component(EpCascader.name, EpCascader);
};

// 导出组件
export default EpCascader;
