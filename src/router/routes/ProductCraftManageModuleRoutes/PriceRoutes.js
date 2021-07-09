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
];

const routeTree = {
  name: 'PriceManageList',
  children: [
  ],
};

export default {
  routes,
  routeTree,
};
