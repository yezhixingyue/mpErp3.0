const routes = [
  {
    path: '/PriceManageList',
    name: 'PriceManageList',
    meta: {
      title: '产品定价',
      icon: 'iconfont icon-chanpindingjia',
      pageName: 'PriceManageListPage',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/PriceManageListPage.vue'),
  },
  {
    path: '/AreaTemplate',
    name: 'AreaTemplate',
    meta: {
      title: '适用范围模板',
      pageName: 'AreaTemplate',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/AreaTemplatePage.vue'),
  },
  {
    path: '/MakeupRule',
    name: 'MakeupRule',
    meta: {
      title: '拼版规则设置',
      pageName: 'MakeupRule',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/MakeupRulePage.vue'),
  },
  {
    path: '/MakeupCtrl/:name/:id',
    name: 'MakeupCtrl',
    meta: {
      title: '拼版控制 - 价格',
      pageName: 'MakeupCtrl',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/MakeupCtrlPage'),
  },
  {
    path: '/MakeupCtrlConditionSet/:ProductID/:PartID/:ProductName/:PartName/:SolutionName/:SolutionID/:setType/:isMixin',
    name: 'MakeupCtrlConditionSet',
    meta: {
      title: '设置拼版尺寸数量',
      requiresAuth: true,
      pageName: 'MakeupCtrlConditionSet',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/MakeupCtrlPage/MakeupCtrlConditionSetPage.vue'),
  },
  {
    path: '/subConditionList/:name/:id',
    name: 'subConditionList',
    meta: {
      title: '设置子条件 - 价格',
      pageName: 'subConditionList',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/SubConditionPage'),
  },
  {
    path: '/subConditionSet/:ProductName/:PartID/:PartName',
    name: 'subConditionSet',
    meta: {
      title: '添加子条件',
      pageName: 'subConditionSet',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/SubConditionPage/SubConditionSetPage'),
  },
];

const routeTree = {
  name: 'PriceManageList',
  children: [
    { name: 'AreaTemplate', children: [] },
    { name: 'MakeupRule', children: [] },
    {
      name: 'MakeupCtrl',
      children: [
        { name: 'MakeupCtrlConditionSet', children: [] },
      ],
    },
    {
      name: 'subConditionList',
      children: [
        { name: 'subConditionSet', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
