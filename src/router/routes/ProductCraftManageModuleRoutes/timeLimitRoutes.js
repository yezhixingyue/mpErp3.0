const routes = [
  {
    path: '/timeLimitList',
    name: 'timeLimitList',
    meta: {
      title: '工期列表',
      icon: 'iconfont icon-gongqiliebiao',
      pageName: 'timeLimitList',
      requiresAuth: true,
      PermissionInfo: ['PermissionProducePeriod', 'HavePomission'],
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
      PermissionInfo: ['PermissionProducePeriod', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/TimeLimitPage/TimeLimitSet.vue'),
  },
  {
    path: '/SchemaItemSet/:EditIndex',
    name: 'SchemaItemSet',
    meta: {
      title: '单个工期设置',
      requiresAuth: true,
      pageName: 'SchemaItemSet',
      PermissionInfo: ['PermissionProducePeriod', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/TimeLimitPage/SchemaItemSetPage.vue'),
  },
  {
    path: '/SingleCraftPeriodItemSet/:EditIndex',
    name: 'SingleCraftPeriodItemSet',
    meta: {
      title: '单个工艺工期设置',
      requiresAuth: true,
      pageName: 'SingleCraftPeriodItemSet',
      PermissionInfo: ['PermissionProducePeriod', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/TimeLimitPage/SingleCraftPeriodItemSetPage.vue'),
  },
];

const routeTree = {
  name: 'timeLimitList',
  children: [
    {
      name: 'timeLimitSet',
      children: [
        { name: 'SchemaItemSet', children: [] },
        { name: 'SingleCraftPeriodItemSet', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
