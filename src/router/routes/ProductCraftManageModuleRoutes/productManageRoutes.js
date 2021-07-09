const routes = [
  {
    path: '/ProductManageList',
    name: 'ProductManageList',
    meta: {
      title: '产品管理',
      icon: 'el-icon-s-management',
      pageName: 'ProductManageList',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/ProductManageListPage.vue'),
  },
  {
    path: '/ProductClassifyManage',
    name: 'ProductClassifyManage',
    meta: {
      title: '产品分类管理',
      requiresAuth: true,
      pageName: 'ProductClassifyManagePage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/ProductClassifyManagePage.vue'),
  },
  {
    path: '/ProductDataSave/:times',
    name: 'ProductDataSave',
    meta: {
      title: '设置产品',
      requiresAuth: true,
      pageName: 'ProductDataSavePage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/ProductDataSavePage.vue'),
  },
  {
    path: '/ProductElementSet/:id/:name/:type/:times',
    name: 'ProductElementSet',
    meta: {
      title: '界面元素设置 - 产品|部件管理',
      requiresAuth: true,
      pageName: 'ProductElementSetPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/ProductElementSetPage.vue'),
  },
  {
    // path: '/ProductSizeMaterialSet/:id/:name/:type/:times',
    path: '/ProductSizeMaterialSet/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductSizeMaterialSet',
    meta: {
      title: '尺寸物料设置 - 产品|部件管理',
      requiresAuth: true,
      pageName: 'ProductSizeMaterialSetPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/ProductSizeMaterialSetPage.vue'),
  },
  {
    path: '/ProductCraftSet/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductCraftSet',
    meta: {
      title: '工艺设置 - 产品|部件管理',
      requiresAuth: true,
      pageName: 'ProductCraftSetPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/ProductCraftSetPage.vue'),
  },
  {
    path: '/ProductDisplaySort/:ProductID/:PartID/:name/:type/:materialName/:times',
    name: 'ProductDisplaySort',
    meta: {
      title: '显示排序设置 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductDisplaySortPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/ProductDisplaySortPage.vue'),
  },
  {
    path: '/ProductFactorySet/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductFactorySet',
    meta: {
      title: '工厂设置 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductFactorySetPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Factory/ProductFactorySetPage.vue'),
  },
  {
    path: '/ProductFactoryAdd/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductFactoryAdd',
    meta: {
      title: '工厂策略添加 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductFactoryAddPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Factory/ProductFactoryAddPage.vue'),
  },
  {
    path: '/ProductFileList/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductFileList',
    meta: {
      title: '文件列表 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductFileListPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/FilePages/ProductFileListPage.vue'),
  },
  {
    path: '/ProductFileSet/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductFileSet',
    meta: {
      title: '文件设置 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductFileSetPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/FilePages/ProductFileSetPage.vue'),
  },
  {
    path: '/ProductFormulaList/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductFormulaList',
    meta: {
      title: '公式列表 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductFormulaListPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Formula/ProductFormulaListPage.vue'),
  },
  {
    path: '/ProductFormulaSet/:ProductID/:PartID/:name/:type/:moduleIndex/:times',
    name: 'ProductFormulaSet',
    meta: {
      title: '公式设置 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductFormulaSetPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Formula/ProductFormulaSetPage.vue'),
  },
  {
    path: '/ProductFormulaFilter/:ProductID/:PartID/:name/:type/:moduleIndex/:times',
    name: 'ProductFormulaFilter',
    meta: {
      title: '数据筛选 - 子公式 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductFormulaFilterPage',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Formula/ProductFormulaFilterPage.vue'),
  },
  {
    path: '/ProductInteractionList/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductInteractionList',
    meta: {
      title: '交互设置列表 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductInteractionList',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Interaction/ProductInteractionListPage.vue'),
  },
  {
    path: '/ProductInteractionSet/:ProductID/:PartID/:name/:type/:setType/:times',
    name: 'ProductInteractionSet',
    meta: {
      title: '交互设置 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductInteractionSet',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Interaction/ProductInteractionSetPage.vue'),
  },
  {
    path: '/ProductFileNameSet/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductFileNameSet',
    meta: {
      title: '文件名设置 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductFileNameSet',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/FileName/ProductFileNameSetPage.vue'),
  },
  {
    path: '/ProductStockList/:ProductID/:PartID/:name/:type/:times',
    name: 'ProductStockList',
    meta: {
      title: '库存设置 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductStockList',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Stock/ProductStockListPage.vue'),
  },
  {
    path: '/ProductStockSpecificationAdd/:ProductID/:PartID/:name/:type/:fixedPartName/:times',
    name: 'ProductStockSpecificationAdd',
    meta: {
      title: '库存规格设置 - 产品管理',
      requiresAuth: true,
      pageName: 'ProductStockSpecificationAdd',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/ProductManage/Stock/ProductStockSpecificationAddPage.vue'),
  },
];

const routeTree = {
  name: 'ProductManageList',
  children: [
    { name: 'ProductClassifyManage', children: [] },
    { name: 'ProductDataSave', children: [] },
    { name: 'ProductElementSet', children: [] },
    { name: 'ProductSizeMaterialSet', children: [] },
    { name: 'ProductCraftSet', children: [] },
    { name: 'ProductDisplaySort', children: [] },
    {
      name: 'ProductFactorySet',
      children: [
        { name: 'ProductFactoryAdd', children: [] },
      ],
    },
    {
      name: 'ProductFileList',
      children: [
        { name: 'ProductFileSet', children: [] },
      ],
    },
    {
      name: 'ProductFormulaList',
      children: [
        { name: 'ProductFormulaSet', children: [] },
        { name: 'ProductFormulaFilter', children: [] },
      ],
    },
    {
      name: 'ProductInteractionList',
      children: [
        { name: 'ProductInteractionSet', children: [] },
      ],
    },
    { name: 'ProductFileNameSet', children: [] },
    {
      name: 'ProductStockList',
      children: [
        { name: 'ProductStockSpecificationAdd', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
