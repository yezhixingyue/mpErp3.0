import CommonNullView from '@/components/common/Layout/CommonNullView.vue';
import transformerRoutes from './transformerRoutes';

const routes = { // 基本设置
  path: '/factory',
  component: CommonNullView,
  name: 'factory',
  meta: {
    title: '工厂管理',
    requiresAuth: true,
    icon: 'el-icon-school',
  },
  children: [
    /*  生产工厂
    ------------------------------------------ */
    {
      path: '/factoryManag',
      name: 'factoryManage',
      meta: {
        title: '生产工厂',
        icon: 'el-icon-school',
        pageName: 'FactoryManagePage',
        PermissionInfo: ['PermissionSetupFactoryBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/FactoryManagePage.vue'),
    },
    {
      path: '/factoryManagSetup/:ID/:factoryName',
      name: 'factoryManagSetup',
      meta: {
        title: '外发价格',
        pageName: 'FactoryManagSetupPage',
        PermissionInfo: ['PermissionSetupFactoryBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/FactoryManagSetupPage.vue'),
    },
    /*  手动外协
    ------------------------------------------ */
    {
      path: '/manualOutsource',
      name: 'manualOutsource',
      meta: {
        title: '手动外协',
        pageName: 'ManualOutsourceManagePage',
        icon: 'el-icon-s-help',
        PermissionInfo: ['PermissionCheckFileOutOrder', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/FactoryManage/ManualOutsourceManage/ManualOutsourceManagePage.vue'),
    },
    /*  转换设置
    ------------------------------------------ */
    ...transformerRoutes.routes,
    /*  转换服务器
    ------------------------------------------ */
    {
      path: '/adapters',
      name: 'adapters',
      meta: {
        title: '转换服务器',
        pageName: 'ProductionServerListPage',
        icon: 'el-icon-guide',
        PermissionInfo: ['PermissionCheckFileConvertion', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/serverManage/ProductionServerListPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'factory',
  isModuleRoot: true,
  children: [
    /*  生产工厂
    ------------------------------------------ */
    {
      name: 'factoryManage',
      children: [
        {
          name: 'factoryManagSetup',
          children: [],
        },
      ],
    },
    ...transformerRoutes.routeTree,
  ],
};

export default {
  routes,
  routeTree,
};
