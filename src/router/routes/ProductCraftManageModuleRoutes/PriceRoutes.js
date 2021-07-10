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
      title: '产品定价',
      pageName: 'AreaTemplate',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Price/AreaTemplatePage.vue'),
  },
];

const routeTree = {
  name: 'PriceManageList',
  children: [
    { name: 'AreaTemplate', children: [] },
  ],
};

export default {
  routes,
  routeTree,
};
