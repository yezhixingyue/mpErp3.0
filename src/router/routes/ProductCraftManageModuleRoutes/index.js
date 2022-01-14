import CommonNullView from '@/components/common/Layout/CommonNullView.vue';
import craftManageRoutes from './craftManageRoutes';
import productManageRoutes from './productManageRoutes';
// import timeLimitRoutes from './timeLimitRoutes';
import PriceRoutes from './PriceRoutes';

const routes = { // 产品/工艺管理
  path: '/craftProductManage',
  component: CommonNullView,
  meta: {
    title: '产品/工艺管理',
    requiresAuth: true,
    icon: 'el-icon-menu',
  },
  children: [
    ...productManageRoutes.routes, // 产品管理
    ...PriceRoutes.routes,
    ...craftManageRoutes.routes, // 工艺管理
    // ...timeLimitRoutes.routes, // 工期管理
  ],
};

const routeTree = {
  name: 'craftProductManage',
  isModuleRoot: true,
  children: [
    productManageRoutes.routeTree,
    PriceRoutes.routeTree,
    craftManageRoutes.routeTree,
    // timeLimitRoutes.routeTree,
  ],
};

export default {
  routes,
  routeTree,
};
