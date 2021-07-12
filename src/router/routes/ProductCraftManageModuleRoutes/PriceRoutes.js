const routes = [
  {
    path: '/PriceManageList',
    name: 'PriceManageList',
    meta: {
      title: '产品定价',
      icon: 'el-icon-s-goods',
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
    component: () => import('../../../views/Price/MakeupRuleePage.vue'),
  },
];

const routeTree = {
  name: 'PriceManageList',
  children: [
    { name: 'AreaTemplate', children: [] },
    { name: 'MakeupRule', children: [] },
  ],
};

export default {
  routes,
  routeTree,
};
