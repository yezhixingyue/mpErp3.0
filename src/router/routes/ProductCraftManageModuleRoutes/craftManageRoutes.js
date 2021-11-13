const routes = [
  {
    path: '/CraftManageList',
    name: 'CraftManageList',
    meta: {
      title: '工艺管理',
      icon: 'iconfont icon-gongyiguanli',
      pageName: 'CraftManageList',
      requiresAuth: true,
      PermissionInfo: ['PermissionCraftBase', 'HavePomission'],
    },
    component: () => import('../../../views/Craft/CraftManageListPage.vue'),
  },
  {
    path: '/CraftClassifyManage',
    name: 'CraftClassifyManage',
    meta: {
      title: '工艺分类管理',
      requiresAuth: true,
      pageName: 'CraftClassifyManagePage',
      PermissionInfo: ['PermissionCraftBase', 'Obj', 'Setup'],
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Craft/CraftClassifyManagePage.vue'),
  },
  {
    path: '/CraftElementSet/:id/:name',
    name: 'CraftElementSet',
    meta: {
      title: '工艺界面元素设置',
      requiresAuth: true,
      pageName: 'CraftElementSetPage',
      PermissionInfo: ['PermissionCraftBase', 'Obj', 'Setup'],
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/Craft/CraftElementSetPage.vue'),
  },
];

const routeTree = {
  name: 'CraftManageList',
  children: [
    { name: 'CraftClassifyManage', children: [] },
    { name: 'CraftElementSet', children: [] },
  ],
};

export default {
  routes,
  routeTree,
};
