
import Home from '@/views/Home.vue';
import ProductCraftManageModuleRoutes from './ProductCraftManageModuleRoutes';
import PriceStrategyRoutes from './PriceStrategy';
import FinanceRoutes from './Finance';
import OrderManageRoutes from './OrderManage';
import MaterialRoutes from './Material';
import BasicSetRoutes from './BasicSet';
import ProducePeriodRoutes from './ProducePeriod';
import CompanyManageRoutes from './CompanyManage';

const routes = [
  { // 首页
    path: '/',
    // redirect: '/orderManage',
    meta: {
      title: '首页 - 名片之家后台管理系统',
      requiresAuth: true,
      hideMenu: true,
    },
    name: 'home',
    component: Home,
  },
  { // 登录页面
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      requiresAuth: false,
      hideMenu: true,
    },
    component: () => import('../../views/LoginPage.vue'),
  },
  OrderManageRoutes.routes,
  FinanceRoutes.routes,
  PriceStrategyRoutes.routes, // 价格策略
  ProductCraftManageModuleRoutes.routes, // 产品工艺管理
  ProducePeriodRoutes.routes,
  MaterialRoutes.routes,
  BasicSetRoutes.routes,
  CompanyManageRoutes.routes,

  { // 无权限页
    path: '/notauth',
    name: 'notauth',
    meta: {
      title: '没有访问权限',
      hideMenu: true,
    },
    component: () => import('../../views/NoAuthPage.vue'),
  },
];

/**
 * 1. meta中带有icon的路由信息会被渲染至左侧的导航列表区域
 * 2.
 */

const routeTree = [
  OrderManageRoutes.routeTree,
  FinanceRoutes.routeTree,
  PriceStrategyRoutes.routeTree,
  ProductCraftManageModuleRoutes.routeTree,
  MaterialRoutes.routeTree,
  BasicSetRoutes.routeTree,
  ProducePeriodRoutes.routeTree,
  CompanyManageRoutes.routeTree,
];

export default {
  routes,
  routeTree,
};
