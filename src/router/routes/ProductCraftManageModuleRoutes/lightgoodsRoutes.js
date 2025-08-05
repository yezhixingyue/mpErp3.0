const routes = [
  {
    path: '/lightgoodsManageList',
    name: 'lightgoodsManageList',
    meta: {
      title: '抛货管理',
      icon: 'iconfont icon-paohuoguanli',
      pageName: 'LightgoodsManageListView',
      requiresAuth: true,
      PermissionInfo: ['PermissionBulkyCargo', 'HavePomission'],
    },
    component: () => import('../../../views/LightgoodsManage/LightgoodsManageListView/LightgoodsManageListView.vue'),
  },
  {
    path: '/packagingSchemeList',
    name: 'packagingSchemeList',
    meta: {
      title: '打包方案',
      requiresAuth: true,
      pageName: 'PackagingSchemeListView',
      PermissionInfo: ['PermissionBulkyCargo', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/LightgoodsManage/PackagingSchemeListView/PackagingSchemeListView.vue'),
  },
  {
    path: '/packagingSchemeDesign',
    name: 'packagingSchemeDesign',
    meta: {
      title: '设置打包方案',
      requiresAuth: true,
      pageName: 'PackagingSchemeDesignView',
      PermissionInfo: ['PermissionBulkyCargo', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/LightgoodsManage/PackagingSchemeDesign/PackagingSchemeDesignView.vue'),
  },
];

const routeTree = {
  name: 'lightgoodsManageList',
  children: [
    {
      name: 'packagingSchemeList',
      children: [
        { name: 'packagingSchemeDesign', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
