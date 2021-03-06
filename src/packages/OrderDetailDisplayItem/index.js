// 导入组件，组件必须声明 name
import OrderDetailDisplayItem from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
OrderDetailDisplayItem.install = (Vue) => {
  Vue.component(OrderDetailDisplayItem.name, OrderDetailDisplayItem);
};

// 导出组件
export default OrderDetailDisplayItem;
