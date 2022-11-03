import CommonNullView from '@/components/Layout/CommonNullView.vue';

const routes = { // 企业管理
  path: '/company',
  component: CommonNullView,
  name: 'company',
  meta: {
    title: '企业管理',
    requiresAuth: true,
    icon: 'el-icon-s-home',
  },
  children: [
    /*  员工管理
    ------------------------------------------ */
    {
      path: '/staffManageList',
      name: 'staffManageList',
      meta: {
        title: '员工管理',
        icon: 'el-icon-s-custom',
        pageName: 'StaffManageListPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/companyManage/StaffManageListPage/StaffManageListPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'company',
  isModuleRoot: true,
  children: [
    /*  员工管理
    ------------------------------------------ */
    {
      name: 'staffManageList',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
