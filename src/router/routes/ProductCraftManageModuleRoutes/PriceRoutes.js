const routes = [
  {
    path: '/PriceManageList',
    name: 'PriceManageList',
    meta: {
      title: '产品定价',
      icon: 'iconfont icon-chanpindingjia',
      pageName: 'PriceManageListPage',
      requiresAuth: true,
      PermissionInfo: ['PermissionProductPrice', 'HavePomission'],
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
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
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
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
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
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/MakeupCtrlPage'),
  },
  {
    path: '/MakeupCtrlConditionSet/:ProductID/:PartID/:ProductName/:PartName/:SolutionName/:SolutionID/:setType/:isMixin',
    name: 'MakeupCtrlConditionSet',
    meta: {
      title: '拼版设置',
      requiresAuth: true,
      pageName: 'MakeupCtrlConditionSet',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
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
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
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
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
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
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/Formula/PriceFormulaListPage.vue'),
  },
  {
    path: '/PriceFormulaSet/:ProductID/:name/:moduleIndex/:isSubFormula',
    name: 'PriceFormulaSet',
    meta: {
      title: '公式设置 - 产品价格',
      requiresAuth: true,
      pageName: 'PriceFormulaSetPage',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
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
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
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
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/MakeupSolutionSetPage'),
  },
  /** 工艺费
  --------------------------------------------------------------  */
  {
    path: '/CraftPriceSetPage/:name/:id',
    name: 'CraftPriceSetPage',
    meta: {
      title: '工艺费设置',
      requiresAuth: true,
      pageName: 'CraftPriceSetPage',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/index.vue'),
  },
  {
    path: '/CompositionCostOfCraft/:name/:id',
    name: 'CompositionCostOfCraft',
    meta: {
      title: '设置工艺费用组成',
      requiresAuth: true,
      pageName: 'CompositionCostOfCraft',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/CompositionCostOfCraftPage'),
  },
  {
    path: '/CraftPriceTableItemSet/:name/:id',
    name: 'CraftPriceTableItemSet',
    meta: {
      title: '设置费用表',
      requiresAuth: true,
      pageName: 'CraftPriceTableItemSet',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/PriceItemTableSetPage'),
  },
  {
    path: '/CraftPriceTableConditionSet/:name/:id',
    name: 'CraftPriceTableConditionSet',
    meta: {
      title: '设置条件',
      requiresAuth: true,
      pageName: 'CraftPriceTableConditionSet',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/ConditionSetupPage'),
  },
  {
    path: '/CraftPriceTableResultFormulaSet/:name/:id',
    name: 'CraftPriceTableResultFormulaSet',
    meta: {
      title: '设置结果公式',
      requiresAuth: true,
      pageName: 'ResultFormulaSetupPage',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/ResultFormulaSetupPage'),
  },
  {
    path: '/CraftTotalPriceSetPage/:name/:id',
    name: 'CraftTotalPriceSetPage',
    meta: {
      title: '工艺总费用',
      requiresAuth: true,
      pageName: 'CraftTotalPriceSetPage',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/CraftTotalPriceSetPage'),
  },
  {
    path: '/CraftAllCostFormulaSet/:name/:id/:isAllCost',
    name: 'CraftAllCostFormulaSet',
    meta: {
      title: '设置工艺总费用',
      requiresAuth: true,
      pageName: 'ResultFormulaSetupPage',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/ResultFormulaSetupPage'),
  },
  /** 报价表
  --------------------------------------------------------------  */
  {
    path: '/QuotationList/:name/:id/:isQuotation',
    name: 'QuotationList',
    meta: {
      title: '报价表',
      requiresAuth: true,
      pageName: 'CompositionCostOfCraft',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/CompositionCostOfCraftPage'),
  },
  {
    path: '/QuotationPriceTableItemSet/:name/:id/:isQuotation',
    name: 'QuotationPriceTableItemSet',
    meta: {
      title: '设置费用表',
      requiresAuth: true,
      pageName: 'CraftPriceTableItemSet',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/PriceItemTableSetPage'),
  },
  {
    path: '/QuotationPriceConditionSet/:name/:id/:isQuotation',
    name: 'QuotationPriceConditionSet',
    meta: {
      title: '设置条件',
      requiresAuth: true,
      pageName: 'CraftPriceTableConditionSet',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/ConditionSetupPage'),
  },
  {
    path: '/QuotationPriceResultFormulaSet/:name/:id/:isQuotation',
    name: 'QuotationPriceResultFormulaSet',
    meta: {
      title: '设置结果公式',
      requiresAuth: true,
      pageName: 'ResultFormulaSetupPage',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/CraftPriceSetPage/ResultFormulaSetupPage'),
  },
  /** 报价方案
  --------------------------------------------------------------  */
  {
    path: '/QuotationScheme/:name/:id/:timer',
    name: 'QuotationScheme',
    meta: {
      title: '报价方案',
      requiresAuth: true,
      pageName: 'QuotationScheme',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/QuotationSchemePage'),
  },
  {
    path: '/QuotationSchemeSet/:name/:id',
    name: 'QuotationSchemeSet',
    meta: {
      title: '设置报价方案',
      requiresAuth: true,
      pageName: 'QuotationSchemeSet',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/QuotationSchemePage/QuotationSchemeSetPage.vue'),
  },
  /** 报价结果
  --------------------------------------------------------------  */
  {
    path: '/QuotationResult/:name/:id',
    name: 'QuotationResult',
    meta: {
      title: '报价结果',
      requiresAuth: true,
      pageName: 'QuotationResult',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/QuotationResultPage'),
  },
  {
    path: '/QuotationResultSet/:name/:id',
    name: 'QuotationResultSet',
    meta: {
      title: '设置报价结果',
      requiresAuth: true,
      pageName: 'QuotationResultSet',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/QuotationResultPage/QuotationResultSetPage.vue'),
  },
  /** 报价结果
  --------------------------------------------------------------  */
  {
    path: '/NumberSwapList/:name/:id',
    name: 'NumberSwapList',
    meta: {
      title: '数值转换列表',
      requiresAuth: true,
      pageName: 'NumberSwapList',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/NumberSwap'),
  },
  {
    path: '/NumberSwapSetup/:name/:id/:partName/:partID',
    name: 'NumberSwapSetup',
    meta: {
      title: '设置数值转换',
      requiresAuth: true,
      pageName: 'NumberSwapSetup',
      PermissionInfo: ['PermissionProductPrice', 'Obj', 'SetupAll'],
    },
    component: () => import('../../../views/Price/NumberSwap/NumberSwapSetupPage.vue'),
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
        {
          name: 'CompositionCostOfCraft',
          children: [
            {
              name: 'CraftPriceTableItemSet',
              children: [
                { name: 'CraftPriceTableResultFormulaSet', children: [] },
              ],
            },
            { name: 'CraftPriceTableConditionSet', children: [] },
          ],
        }, // 工艺组成设置页面
        {
          name: 'CraftTotalPriceSetPage',
          children: [
            {
              name: 'CraftAllCostFormulaSet',
              children: [],
            },
          ] }, // 工艺总费用设置页面
      ],
    },
    {
      name: 'QuotationList', // 报价表
      children: [
        {
          name: 'QuotationPriceTableItemSet',
          children: [{
            name: 'QuotationPriceResultFormulaSet',
            children: [],
          }],
        },
        { name: 'QuotationPriceConditionSet', children: [] },
      ],
    },
    {
      name: 'QuotationScheme', // 报价方案
      children: [
        { name: 'QuotationSchemeSet', children: [] },
      ],
    },
    {
      name: 'QuotationResult', // 报价结果
      children: [
        { name: 'QuotationResultSet', children: [] },
      ],
    },
    {
      name: 'NumberSwapList', // 数值转换
      children: [
        { name: 'NumberSwapSetup', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
