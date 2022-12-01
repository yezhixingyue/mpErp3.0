const routes = [
  {
    path: '/reviewSetupList',
    name: 'reviewSetupList',
    meta: {
      title: '审稿设置',
      icon: 'el-icon-news',
      pageName: 'reviewSetupListPage',
      requiresAuth: true,
      PermissionInfo: ['PermissionCheckFileSetup', 'HavePomission'],
    },
    component: () => import('../../../views/ReviewManage/reviewSetupPages/index.vue'),
  },
  /* 管理输出文件页面
  ---------------------------------------------------------*/
  {
    path: '/outFileNameManage',
    name: 'outFileNameManage',
    meta: {
      title: '管理输出文件',
      requiresAuth: true,
      pageName: 'outFileNameManagePage',
      PermissionInfo: ['PermissionCheckFileSetup', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/ReviewManage/reviewSetupPages/outFileNameManage/outFileNameManagePage.vue'),
  },
  /* 审稿设置相关页面
  ---------------------------------------------------------*/
  {
    path: '/reviewPanelsList',
    name: 'reviewPanelsList',
    meta: {
      title: '审稿设置',
      requiresAuth: true,
      pageName: 'reviewPanelsListPage',
      PermissionInfo: ['PermissionCheckFileSetup', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/ReviewManage/reviewSetupPages/reviewPanels/reviewPanelsListPage.vue'),
  },
  {
    path: '/reviewPanelsSetup',
    name: 'reviewPanelsSetup',
    meta: {
      title: '审稿设置',
      requiresAuth: true,
      pageName: 'reviewPanelsSetupPage',
      PermissionInfo: ['PermissionCheckFileSetup', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/ReviewManage/reviewSetupPages/reviewPanels/reviewPanelsSetupPage.vue'),
  },
  /* 其它设置相关页面
  ---------------------------------------------------------*/
  {
    path: '/reviewOtherSetting',
    name: 'reviewOtherSetting',
    meta: {
      title: '其它设置',
      requiresAuth: true,
      pageName: 'reviewOtherSettingPage',
      PermissionInfo: ['PermissionCheckFileSetup', 'Obj', 'Setup'],
    },
    component: () => import('../../../views/ReviewManage/reviewSetupPages/reviewOtherSetting/reviewOtherSettingPage.vue'),
  },
];

const routeTree = {
  name: 'reviewSetupList',
  children: [
    {
      name: 'outFileNameManage',
      children: [],
    },
    {
      name: 'reviewPanelsList',
      children: [
        { name: 'reviewPanelsSetup', children: [] },
      ],
    },
    {
      name: 'outputFileList',
      children: [
        { name: 'outputFileSetup', children: [] },
      ],
    },
    {
      name: 'sizeNumberCheckList',
      children: [
        { name: 'sizeNumberCheckSetup', children: [] },
      ],
    },
    {
      name: 'filePageNumber',
      children: [
        { name: 'filePageNumberSetup', children: [] },
      ],
    },
    {
      name: 'reviewOtherSetting',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
