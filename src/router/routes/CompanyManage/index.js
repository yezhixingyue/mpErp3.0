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
    /*  员工管理
    ------------------------------------------ */
    {
      path: '/StaffManageList',
      name: 'StaffManageList',
      meta: {
        title: '员工管理',
        icon: 'iconfont icon-yuangongguanli',
        pageName: 'StaffManageListPage',
        PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CompanyManage/StaffManage/StaffManageListPage.vue'),
    },
    {
      path: '/StaffManageSetup/:id',
      name: 'StaffManageSetup',
      meta: {
        title: '员工设置',
        pageName: 'StaffManageSetupPage',
        PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CompanyManage/StaffManage/StaffManageSetupPage.vue'),
    },
    /*  部门管理
    ------------------------------------------ */
    {
      path: '/departmentManage',
      name: 'departmentManage',
      meta: {
        title: '部门管理',
        icon: 'iconfont icon-bumenguanli_2',
        pageName: 'DepartmentManagePage',
        PermissionInfo: ['PermissionManageDepartment', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CompanyManage/DepartmentManage/DepartmentManagePage.vue'),
    },
    /*  岗位管理
    ------------------------------------------ */
    {
      path: '/PostManageList',
      name: 'PostManageList',
      meta: {
        title: '岗位管理',
        icon: 'el-icon-monitor',
        pageName: 'PostManageListPage',
        PermissionInfo: ['PermissionManageJob', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CompanyManage/JobPostManage/PostManageListPage.vue'),
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
      component: () => import('../../../views/CompanyManage/JobPostManage/PostManageSetupPage.vue'),
    },
    /*  花名管理
    ------------------------------------------ */
    {
      path: '/ScreenNameManage',
      name: 'ScreenNameManage',
      meta: {
        title: '花名管理',
        icon: 'el-icon-notebook-1',
        pageName: 'ScreenNameManagePage',
        PermissionInfo: ['PermissionManageRoster', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CompanyManage/ScreenNameManage/ScreenNameManagePage.vue'),
    },
    /*  资产管理
    ------------------------------------------ */
    {
      path: '/EquipmentList',
      name: 'EquipmentList',
      meta: {
        title: '办公设备管理',
        icon: 'el-icon-s-platform',
        pageName: 'EquipmentListManageView',
        PermissionInfo: ['PermissionManagePC', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CompanyManage/EquipmentManage/EquipmentList/EquipmentListManageView.vue'),
    },
    /*  资产管理
    ------------------------------------------ */
    // {
    //   path: '/ComputerList',
    //   name: 'ComputerList',
    //   meta: {
    //     title: '办公电脑管理',
    //     icon: 'el-icon-s-platform',
    //     pageName: 'ComputerListManageView',
    //     PermissionInfo: ['PermissionManagePC', 'HavePomission'],
    //     requiresAuth: true,
    //   },
    //   component: () => import('../../../views/CompanyManage/EquipmentManage/ComputerList/ComputerListManageView.vue'),
    // },
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
    /*  员工管理
    ------------------------------------------ */
    {
      name: 'StaffManageList',
      children: [
        { name: 'StaffManageSetup', children: [] },
      ],
    },
    /*  部门管理
    ------------------------------------------ */
    {
      name: 'departmentManage',
      children: [],
    },
    /*  花名管理
    ------------------------------------------ */
    {
      name: 'ScreenNameManage',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
