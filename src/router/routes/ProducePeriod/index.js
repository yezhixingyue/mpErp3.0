import CommonNullView from '@/components/common/Layout/CommonNullView.vue';

const routes = { // 基本设置
  path: '/ProducePeriod',
  component: CommonNullView,
  name: 'ProducePeriod',
  meta: {
    title: '工期管理',
    requiresAuth: true,
    icon: 'iconfont icon-gongqiguanli_1',
  },
  children: [
    /*  付款时间
    ------------------------------------------ */
    {
      path: '/PayTimeManage',
      name: 'PayTimeManage',
      meta: {
        title: '付款时间',
        requiresAuth: true,
        icon: 'iconfont icon-fukuanshijian_2',
        pageName: 'PayTimeManagePage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'PayTimeQuery'],
      },
      component: () => import('../../../views/ProducePeriodPage/PayTimeManagePage/index.vue'),
    },
    {
      path: '/PayTimeSetup/:ItemID',
      name: 'PayTimeSetup',
      meta: {
        title: '设置付款时间',
        requiresAuth: true,
        pageName: 'PayTimeSetupPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'PayTimeSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/PayTimeManagePage/PayTimeItemSetupPage.vue'),
    },
    /*  生产工期
    ------------------------------------------ */
    {
      path: '/ProductionPeriod',
      name: 'ProductionPeriod',
      meta: {
        title: '生产工期',
        requiresAuth: true,
        icon: 'iconfont icon-shengchangongqi',
        pageName: 'ProductionPeriodPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ProducePeriodSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/ProductionPeriodPage/index.vue'),
    },
    {
      path: '/ProductionPeriodCompositionList',
      name: 'ProductionPeriodCompositionList',
      meta: {
        title: '产品工期组成',
        requiresAuth: true,
        pageName: 'ProductionPeriodCompositionListPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ProducePeriodSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/ProductionPeriodPage/ProductionPeriodCompositionListPage.vue'),
    },
    {
      path: '/ProductionPeriodCompositionSetup/:ProduceItemName/:ProduceItemID',
      name: 'ProductionPeriodCompositionSetup',
      meta: {
        title: '设置产品工期组成',
        requiresAuth: true,
        pageName: 'ProductionPeriodCompositionSetupPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ProducePeriodSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/ProductionPeriodPage/ProductionPeriodCompositionSetupPage.vue'),
    },
    {
      path: '/ProductionTotalPeriodList',
      name: 'ProductionTotalPeriodList',
      meta: {
        title: '产品总工期',
        requiresAuth: true,
        pageName: 'ProductionTotalPeriodListPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ProducePeriodSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/ProductionPeriodPage/ProductionTotalPeriodListPage.vue'),
    },
    {
      path: '/ProductionTotalPeriodSetup',
      name: 'ProductionTotalPeriodSetup',
      meta: {
        title: '设置产品总工期',
        requiresAuth: true,
        pageName: 'ProductionTotalPeriodSetupPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ProducePeriodSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/ProductionPeriodPage/ProductionTotalPeriodSetupPage.vue'),
    },
    /*  发货班次
    ------------------------------------------ */
    {
      path: '/DeliveryTimeList',
      name: 'DeliveryTimeList',
      meta: {
        title: '发货班次',
        requiresAuth: true,
        icon: 'iconfont icon-fahuobanci',
        pageName: 'DeliveryTimeListPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ShiftQuery'],
      },
      component: () => import('../../../views/ProducePeriodPage/DeliveryTimeManagePage/DeliveryTimeListPage.vue'),
    },
    {
      path: '/DeliveryTimeSetup/:ItemID',
      name: 'DeliveryTimeSetup',
      meta: {
        title: '设置发货班次',
        requiresAuth: true,
        pageName: 'DeliveryTimeSetupPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ShiftSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/DeliveryTimeManagePage/DeliveryTimeSetupPage.vue'),
    },
    /*  派件时间
    ------------------------------------------ */
    {
      path: '/DispatchTimeList',
      name: 'DispatchTimeList',
      meta: {
        title: '派件时间',
        requiresAuth: true,
        icon: 'iconfont icon-paijianshijian',
        pageName: 'DispatchTimeListPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'DispatchQuery'],
      },
      component: () => import('../../../views/ProducePeriodPage/DispatchTimeManagePage/DispatchTimeListPage.vue'),
    },
    {
      path: '/DispatchTimeSetup/:ItemID',
      name: 'DispatchTimeSetup',
      meta: {
        title: '设置派件时间',
        requiresAuth: true,
        pageName: 'DispatchTimeSetupPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'DispatchSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/DispatchTimeManagePage/DispatchTimeSetupPage.vue'),
    },
    /*  节假日管理
    ------------------------------------------ */
    {
      path: '/holidayManage',
      name: 'holidayManage',
      meta: {
        title: '节假日管理',
        icon: 'iconfont icon-jiejiariguanli',
        pageName: 'HolidayManagePage',
        // PermissionInfo: ['Developing', 'HavePomission'],
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'HolidayQuery'],
        requiresAuth: true,
      },
      component: () => import('../../../views/ProducePeriodPage/HolidayPage.vue'),
    },
    /*  生产特殊情况管理
    ------------------------------------------ */
    {
      path: '/ProduceSpecialDayList',
      name: 'ProduceSpecialDayList',
      meta: {
        title: '生产特殊情况',
        requiresAuth: true,
        icon: 'iconfont icon-shengchanteshuqingkuang_2',
        pageName: 'ProduceSpecialDayListPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ProduceSpecialQuery'],
      },
      component: () => import('../../../views/ProducePeriodPage/ProduceSpecialDayManagePage/ProduceSpecialDayListPage.vue'),
    },
    {
      path: '/ProduceSpecialDaySetup/:ItemID',
      name: 'ProduceSpecialDaySetup',
      meta: {
        title: '生产特殊情况设置',
        requiresAuth: true,
        pageName: 'SpecialDaySetupPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'ProducePeriodSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/ProduceSpecialDayManagePage/ProduceSpecialDaySetupPage.vue'),
    },
    /*  运输配送特殊情况管理
    ------------------------------------------ */
    {
      path: '/ExpressSpecialDayList',
      name: 'ExpressSpecialDayList',
      meta: {
        title: '运输特殊情况',
        requiresAuth: true,
        icon: 'iconfont icon-yunshuteshuqingkuang_1',
        pageName: 'ExpressSpecialDayListPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'DiliverySpecialQuery'],
      },
      component: () => import('../../../views/ProducePeriodPage/ExpressSpecialDayManagePage/ExpressSpecialDayListPage.vue'),
    },
    {
      path: '/ExpressSpecialDaySetup/:ItemID',
      name: 'ExpressSpecialDaySetup',
      meta: {
        title: '运输特殊情况设置',
        requiresAuth: true,
        pageName: 'ExpressSpecialDaySetupPage',
        PermissionInfo: ['PermissionProducePeriod', 'Obj', 'DiliverySpecialSetup'],
      },
      component: () => import('../../../views/ProducePeriodPage/ExpressSpecialDayManagePage/ExpressSpecialDaySetupPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'ProducePeriod',
  isModuleRoot: true,
  children: [
    /*  付款时间
    ------------------------------------------ */
    {
      name: 'PayTimeManage', // 付款时间列表管理
      children: [
        { name: 'PayTimeSetup', children: [] }, // 付款时间设置页面
      ],
    },
    /*  生产工期
    ------------------------------------------ */
    {
      name: 'ProductionPeriod', // 生产工期
      children: [
        {
          name: 'ProductionTotalPeriodList', // 总工期
          children: [
            { name: 'ProductionTotalPeriodSetup', children: [] }, // 设置总工期条目
          ],
        },
        {
          name: 'ProductionPeriodCompositionList', // 工期组成
          children: [
            { name: 'ProductionPeriodCompositionSetup', children: [] }, // 设置工期组成条目
          ] },
      ],
    },
    /*  发货班次
    ------------------------------------------ */
    {
      name: 'DeliveryTimeList', // 发货班次列表管理
      children: [
        { name: 'DeliveryTimeSetup', children: [] }, // 发货班次设置页面
      ],
    },
    /*  派件时间
    ------------------------------------------ */
    {
      name: 'DispatchTimeList', // 派件时间列表管理
      children: [
        { name: 'DispatchTimeSetup', children: [] }, // 派件时间设置页面
      ],
    },
    /*  节假日
    ------------------------------------------ */
    {
      name: 'holidayManage',
      children: [],
    },
    /*  生产特殊情况管理
    ------------------------------------------ */
    {
      name: 'ProduceSpecialDayList', // 生产特殊情况管理列表管理
      children: [
        { name: 'ProduceSpecialDaySetup', children: [] }, // 生产特殊情况设置页面
      ],
    },
    /*  运输特殊情况管理
    ------------------------------------------ */
    {
      name: 'ExpressSpecialDayList', // 运输特殊情况管理列表管理
      children: [
        { name: 'ExpressSpecialDaySetup', children: [] }, // 生产特殊情况设置页面
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
