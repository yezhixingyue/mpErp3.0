import CommonNullView from '@/components/common/Layout/CommonNullView.vue';

const routes = { // 基本设置
  path: '/companyManage',
  component: CommonNullView,
  name: 'companyManage',
  meta: {
    title: '企业管理',
    requiresAuth: true,
    icon: 'el-icon-s-home',
  },
  children: [
    /*  岗位管理
    ------------------------------------------ */
    {
      path: '/PostManageList',
      name: 'PostManageList',
      meta: {
        title: '岗位管理',
        icon: 'el-icon-monitor',
        pageName: 'PostManageListPage',
        PermissionInfo: ['PermissionManageJob', 'Obj', 'Setup'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/PostManage/PostManageListPage.vue'),
    },
    {
      path: '/PostManageSetup/:PositionID',
      name: 'PostManageSetup',
      meta: {
        title: '岗位权限设置',
        pageName: 'PostManageSetupPage',
        PermissionInfo: ['PermissionManageJob', 'Obj', 'SetupPermission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/PostManage/PostManageSetupPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'companyManage',
  isModuleRoot: true,
  children: [
    /*  岗位管理
    ------------------------------------------ */
    {
      name: 'PostManageList',
      children: [
        { name: 'PostManageSetup', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
