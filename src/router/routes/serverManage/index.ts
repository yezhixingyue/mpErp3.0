import CommonNullView from '@/components/Layout/CommonNullView.vue';

const routes = { // 基本设置
  path: '/server',
  component: CommonNullView,
  name: 'server',
  meta: {
    title: '服务器管理',
    requiresAuth: true,
    icon: 'el-icon-menu',
  },
  children: [
    /*  销售端
    ------------------------------------------ */
    {
      path: '/saleServers',
      name: 'saleServers',
      meta: {
        title: '销售端',
        icon: 'el-icon-s-fold',
        pageName: 'SaleServerListPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/serverManage/SaleServerListPage.vue'),
    },
    /*  生产端
    ------------------------------------------ */
    {
      path: '/productionServers',
      name: 'productionServers',
      meta: {
        title: '生产端',
        icon: 'el-icon-s-unfold',
        pageName: 'ProductionServerListPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/serverManage/ProductionServerListPage.vue'),
    },
    /*  转换器
    ------------------------------------------ */
    {
      path: '/switchServers',
      name: 'switchServers',
      meta: {
        title: '转换器',
        icon: 'el-icon-sort',
        pageName: 'SwitchServersListPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/serverManage/SwitchServersListPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'server',
  isModuleRoot: true,
  children: [
    /*  销售端
    ------------------------------------------ */
    {
      name: 'saleServers',
      children: [],
    },
    /*  生产端
    ------------------------------------------ */
    {
      name: 'productionServers',
      children: [],
    },
    /*  转换器
    ------------------------------------------ */
    {
      name: 'switchServers',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
