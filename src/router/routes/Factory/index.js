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
    /*  手动外购
    ------------------------------------------ */
    {
      path: '/manualOutsource',
      name: 'manualOutsource',
      meta: {
        title: '手动外购',
        pageName: 'ManualOutsourceManagePage',
        icon: 'el-icon-s-help',
        PermissionInfo: ['PermissionCheckFileOutOrder', 'HavePomission'],
        // PermissionInfo: ['Developing', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/FactoryManage/ManualOutsourceManage/ManualOutsourceManagePage.vue'),
    },
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
      component: () => import('../../../views/BasicSetup/Factory/FactoryManagePage.vue'),
    },
    // {
    //   path: '/factoryOutsourceSetup/:ID/:factoryName',
    //   name: 'factoryOutsourceSetup',
    //   meta: {
    //     title: '外发价格',
    //     pageName: 'FactoryOutsourceSetup',
    //     PermissionInfo: ['PermissionSetupFactoryBase', 'HavePomission'],
    //     requiresAuth: true,
    //   },
    //   component: () => import('../../../views/BasicSetup/Factory/FactoryOutsourceSetup.vue'),
    // },
    {
      path: '/FactoryOutsourcePriceList/:ID/:factoryName',
      name: 'FactoryOutsourcePriceList',
      meta: {
        title: '外购价格设置',
        pageName: 'FactoryOutsourcePriceListPage',
        PermissionInfo: ['PermissionSetupFactoryBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/Factory/FactoryOutsourcePriceList/FactoryOutsourcePriceListPage.vue'),
    },
    {
      path: '/factoryAccountSetup/:FactoryID/:FactoryName',
      name: 'factoryAccountSetup',
      meta: {
        title: '工厂管理 - 账号设置',
        pageName: 'FactoryAccountSetupPage',
        PermissionInfo: ['PermissionSetupFactoryBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/Factory/FactoryAccountSetupPage.vue'),
    },
    /*  制作需求设置 - 序列化外购工厂用产品名称
    ------------------------------------------ */
    {
      path: '/FactorySerialization',
      name: 'FactorySerialization',
      meta: {
        title: '制作需求设置',
        icon: 'icon-zhizuoxuqiushezhi iconfont',
        pageName: 'FactorySerialization4OutPage',
        PermissionInfo: ['PermissionSetupFactoryBase', 'Obj', 'MRSetup'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/FactorySerialization/FactorySerialization4OutPage.vue'),
    },
    /*  转换失败订单列表
    ------------------------------------------ */
    {
      path: '/convertExceptionOrderList',
      name: 'convertExceptionOrderList',
      meta: {
        title: '转换异常',
        pageName: 'ConvertExceptionOrderListPage',
        icon: 'iconfont icon-shengchanyichang',
        PermissionInfo: ['PermissionCheckFileConvertion', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/FactoryManage/ConvertExceptionOrderList/ConvertExceptionOrderListPage.vue'),
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
          name: 'FactoryOutsourcePriceList',
          children: [],
        },
        {
          name: 'factoryAccountSetup',
          children: [],
        },
      ],
    },
    /*  制作需求设置
    ------------------------------------------ */
    {
      name: 'FactorySerialization',
      children: [],
    },
    ...transformerRoutes.routeTree,
    /*  转换失败订单列表
    ------------------------------------------ */
    {
      name: 'convertExceptionOrderList',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
