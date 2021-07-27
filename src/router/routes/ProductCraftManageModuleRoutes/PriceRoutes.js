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
  {
    path: '/PriceFormulaList/:id/:name/:timer',
    name: 'PriceFormulaList',
    meta: {
      title: '计算公式 - 产品价格',
      requiresAuth: true,
      pageName: 'PriceFormulaListPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/Formula/PriceFormulaListPage.vue'),
  },
  {
    path: '/PriceFormulaSet/:ProductID/:name/:moduleIndex',
    name: 'PriceFormulaSet',
    meta: {
      title: '公式设置 - 产品价格',
      requiresAuth: true,
      pageName: 'PriceFormulaSetPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/Formula/PriceFormulaSetPage.vue'),
  },
  {
    path: '/PriceFormulaFilter/:ProductID/:name/:moduleIndex',
    name: 'PriceFormulaFilter',
    meta: {
      title: '数据筛选 - 子公式 - 产品价格',
      requiresAuth: true,
      pageName: 'PriceFormulaFilterPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/Formula/PriceFormulaFilterPage.vue'),
  },
  {
    path: '/MakeupSolutionSet/:name/:id',
    name: 'MakeupSolutionSet',
    meta: {
      title: '拼版方案选择',
      requiresAuth: true,
      pageName: 'MakeupSolutionSet',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/MakeupSolutionSetPage'),
  },
  {
    path: '/CraftPriceSetPage/:name/:id',
    name: 'CraftPriceSetPage',
    meta: {
      title: '工艺费设置',
      requiresAuth: true,
      pageName: 'CraftPriceSetPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage'),
  },
  {
    path: '/CompositionCostOfCraft/:name/:id',
    name: 'CompositionCostOfCraft',
    meta: {
      title: '设置工艺费用组成',
      requiresAuth: true,
      pageName: 'CompositionCostOfCraft',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/CompositionCostOfCraftPage'),
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
    {
      name: 'PriceFormulaList', // 计算公式列表
      children: [
        { name: 'PriceFormulaSet', children: [] }, // 价格公式设置
        { name: 'PriceFormulaFilter', children: [] }, // 价格子公式数据筛选
      ],
    },
    { name: 'MakeupSolutionSet', children: [] }, // 拼版方案选择
    {
      name: 'CraftPriceSetPage', // 工艺费设置
      children: [
        { name: 'CompositionCostOfCraft', children: [] }, // 工艺组成设置页面
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
