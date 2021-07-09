const routes = [
  {
    path: '/timeLimitList',
    name: 'timeLimitList',
    meta: {
      title: '工期列表',
      icon: 'el-icon-s-marketing',
      pageName: 'timeLimitList',
      requiresAuth: true,
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/TimeLimitPage/TimeLimitList.vue'),
  },
  {
    path: '/timeLimitSet',
    name: 'timeLimitSet',
    meta: {
      title: '工期设置',
      requiresAuth: true,
      pageName: 'timeLimitSet',
      // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
    },
    component: () => import('../../../views/TimeLimitPage/TimeLimitSet.vue'),
  },
];

const routeTree = {
  name: 'timeLimitList',
  children: [
    { name: 'timeLimitSet', children: [] },
  ],
};

export default {
  routes,
  routeTree,
};
