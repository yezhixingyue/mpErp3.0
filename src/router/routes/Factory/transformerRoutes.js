const routes = [
  /*  转换设置
    ------------------------------------------ */
  {
    path: '/transformerList',
    name: 'transformerList',
    meta: {
      title: '转换设置',
      icon: 'icon-zhuanhuanshezhi iconfont',
      pageName: 'TransformerListPage',
      PermissionInfo: ['PermissionManageConvert', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/TransformerListPage.vue'),
  },
  {
    path: '/mapAssist',
    name: 'mapAssist',
    meta: {
      title: '辅助文件映射',
      hideMenu: true,
      pageName: 'assistMapPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/assistInfoMap/assistMapPage.vue'),
  },
  {
    path: '/mapColor',
    name: 'mapColor',
    meta: {
      title: '专色文件映射',
      hideMenu: true,
      pageName: 'colorInfoMapPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/colorInfoMap/colorInfoMapPage.vue'),
  },
  {
    path: '/mapMakeup',
    name: 'mapMakeup',
    meta: {
      title: '拼版文件映射',
      hideMenu: true,
      pageName: 'MakeupInfoMapPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/makeupInfoMap/MakeupInfoMapPage.vue'),
  },
  {
    path: '/mapMaterial',
    name: 'mapMaterial',
    meta: {
      title: '物料映射',
      hideMenu: true,
      pageName: 'MaterialInfoMapPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/materialMap/MaterialInfoMapPage.vue'),
  },
  {
    path: '/mapWords',
    name: 'mapWords',
    meta: {
      title: '文字信息映射',
      hideMenu: true,
      pageName: 'WordsInfoMapPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/wordsInfoMap/WordsInfoMapPage.vue'),
  },
  {
    path: '/mapWorkTimes',
    name: 'mapWorkTimes',
    meta: {
      title: '作业次数',
      hideMenu: true,
      pageName: 'WorkTimesMapPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/workTimesMap/WorkTimesMapPage.vue'),
  },
  {
    path: '/mapNumberic',
    name: 'mapNumberic',
    meta: {
      title: '数值映射',
      hideMenu: true,
      pageName: 'NumbericMapPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/numbericMap/NumbericMapPage.vue'),
  },
  {
    path: '/unionMakeupLimitList',
    name: 'unionMakeupLimitList',
    meta: {
      title: '合拼设置',
      hideMenu: true,
      pageName: 'UnionMakeupLimitListPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/UnionMakeupLimit/UnionMakeupLimitListPage.vue'),
  },
  {
    path: '/unionMakeupLimitSetup',
    name: 'unionMakeupLimitSetup',
    meta: {
      title: '合拼设置',
      hideMenu: true,
      pageName: 'UnionMakeupLimitSetupPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/UnionMakeupLimit/UnionMakeupLimitSetupPage.vue'),
  },
  {
    path: '/numericalCodeAutoMakeupList',
    name: 'numericalCodeAutoMakeupList',
    meta: {
      title: '数码自动拼版设置',
      hideMenu: true,
      pageName: 'NumericalCodeAutoMakeupListPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/NumericalCodeAutoMakeup/NumericalCodeAutoMakeupListPage.vue'),
  },
  {
    path: '/numericalCodeAutoMakeupSetup',
    name: 'numericalCodeAutoMakeupSetup',
    meta: {
      title: '数码自动拼版设置',
      hideMenu: true,
      pageName: 'NumericalCodeAutoMakeupSetupPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/NumericalCodeAutoMakeup/NumericalCodeAutoMakeupSetupPage.vue'),
  },
  {
    path: '/otherLimitList',
    name: 'otherLimitList',
    meta: {
      title: '其它设置',
      hideMenu: true,
      pageName: 'OtherSetupListView',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/otherSetupViews/OtherSetupListView.vue'),
  },
  {
    path: '/otherLimitSetup',
    name: 'otherLimitSetup',
    meta: {
      title: '其它设置',
      hideMenu: true,
      pageName: 'OtherSetupSetupView',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/otherSetupViews/OtherSetupSetupView.vue'),
  },
  {
    path: '/processDecompositionList',
    name: 'processDecompositionList',
    meta: {
      title: '工艺分解',
      hideMenu: true,
      pageName: 'ProcessDecompositionListView',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/ProcessDecomposition/ProcessDecompositionListView.vue'),
  },
  {
    path: '/processDecompositionSetup',
    name: 'processDecompositionSetup',
    meta: {
      title: '工艺分解',
      hideMenu: true,
      pageName: 'ProcessDecompositionSetupView',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/ProcessDecomposition/ProcessDecompositionSetupView.vue'),
  },
  {
    path: '/mapLineList/:pageType',
    name: 'mapLineList',
    meta: {
      title: '生产线映射',
      hideMenu: true,
      pageName: 'LineMapListPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/lineMap/LineMapListPage.vue'),
  },
  {
    path: '/mapLineSetup/:pageType',
    name: 'mapLineSetup',
    meta: {
      title: '生产线映射设置',
      hideMenu: true,
      pageName: 'LineMapSetupPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/lineMap/LineMapSetupPage.vue'),
  },
  {
    path: '/mapWorkingList/:pageType',
    name: 'mapWorkingList',
    meta: {
      title: '工序映射',
      hideMenu: true,
      pageName: 'WorkingMapListPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/workingMap/WorkingMapListPage.vue'),
  },
  {
    path: '/mapWorkingSetup/:pageType',
    name: 'mapWorkingSetup',
    meta: {
      title: '工序映射设置',
      hideMenu: true,
      pageName: 'WorkingMapSetupPage',
      // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
      requiresAuth: true,
    },
    component: () => import('@/views/transformer/assistTypeSetupPages/workingMap/WorkingMapSetupPage.vue'),
  },
];

const routeTree = [
  /*  转换设置
    ------------------------------------------ */
  {
    name: 'transformerList',
    children: [
      { name: 'mapAssist', children: [] },
      { name: 'mapColor', children: [] },
      { name: 'mapMakeup', children: [] },
      { name: 'mapMaterial', children: [] },
      { name: 'mapWords', children: [] },
      { name: 'mapWorkTimes', children: [] },
      { name: 'mapNumberic', children: [] },
      {
        name: 'unionMakeupLimitList',
        children: [
          { name: 'unionMakeupLimitSetup', children: [] },
        ],
      },
      {
        name: 'numericalCodeAutoMakeupList',
        children: [
          { name: 'numericalCodeAutoMakeupSetup', children: [] },
        ],
      },
      {
        name: 'otherLimitList',
        children: [
          { name: 'otherLimitSetup', children: [] },
        ],
      },
      {
        name: 'processDecompositionList',
        children: [
          { name: 'processDecompositionSetup', children: [] },
        ],
      },
      {
        name: 'mapLineList',
        children: [
          { name: 'mapLineSetup', children: [] },
        ],
      },
      {
        name: 'mapWorkingList',
        children: [
          { name: 'mapWorkingSetup', children: [] },
        ],
      },
    ],
  },
];

export default {
  routes,
  routeTree,
};
