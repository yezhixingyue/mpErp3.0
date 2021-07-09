import CommonNullView from '@/components/common/Layout/CommonNullView.vue';

const routes = { // 基本设置
  path: '/basicSet',
  component: CommonNullView,
  name: 'basicSet',
  meta: {
    title: '基本设置',
    requiresAuth: true,
    icon: 'el-icon-s-tools',
  },
  children: [
    /*  定金设置
    ------------------------------------------ */
    {
      path: '/depositList',
      name: 'depositList',
      meta: {
        title: '定金设置',
        icon: 'el-icon-news',
        pageName: 'DepositListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
      },
      component: () => import('../../../views/DepositPage/DepositListPage.vue'),
    },
    {
      path: '/depositSettingsAdd/:type',
      name: 'depositSettingsAdd',
      meta: {
        title: '添加编辑定金设置',
        requiresAuth: true,
        pageName: 'DepositSettingsPage',
        PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
      },
      component: () => import('../../../views/DepositPage/DepositSettingsAddPage.vue'),
    },
    /*  物流费用
    ------------------------------------------ */
    {
      path: '/ExpressList',
      name: 'ExpressList',
      meta: {
        title: '物流费用',
        requiresAuth: true,
        pageName: 'ExpressListPage',
        icon: 'el-icon-connection',
        // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
      },
      component: () => import('../../../views/ExpressManage/ExpressManageListPage.vue'),
    },
    {
      path: '/ExpressPriceSettingList/:id',
      name: 'ExpressPriceSettingList',
      meta: {
        title: '物流管理价格设置列表',
        requiresAuth: true,
        pageName: 'ExpressPriceSettingListPage',
        // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
      },
      component: () => import('../../../views/ExpressManage/ExpressPriceSettingListPage.vue'),
    },
    {
      path: '/ExpressPriceAddEdit/:type',
      name: 'ExpressPriceAddEdit',
      meta: {
        title: '物流价格添加与编辑',
        requiresAuth: true,
        pageName: 'ExpressPriceAddEditPage',
        // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
      },
      component: () => import('../../../views/ExpressManage/ExpressPriceAddEditPage.vue'),
    },
    /*  印刷幅面
    ------------------------------------------ */
    {
      path: '/PrintFormatList',
      name: 'PrintFormatList',
      meta: {
        title: '印刷幅面',
        icon: 'el-icon-wallet',
        pageName: 'PrintFormatListPage',
        requiresAuth: true,
        // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
      },
      component: () => import('../../../views/BasicSetup/PrintFormat/PrintFormatListPage.vue'),
    },
    {
      path: '/PrintFormatClassManage',
      name: 'PrintFormatClassManage',
      meta: {
        title: '印刷幅面分类管理',
        requiresAuth: true,
        pageName: 'PrintFormatClassManagePage',
        // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
      },
      component: () => import('../../../views/BasicSetup/PrintFormat/PrintFormatClassManagePage.vue'),
    },
    /*  元素模板
    ------------------------------------------ */
    {
      path: '/elementTemplate',
      name: 'elementTemplate',
      meta: {
        title: '元素模板',
        icon: 'el-icon-copy-document',
        pageName: 'ElementTemplatePage',
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/ElementTemplatePage.vue'),
    },
    /*  文件类目
    ------------------------------------------ */
    {
      path: '/fileListSet',
      name: 'fileListSet',
      meta: {
        title: '文件类目',
        icon: 'el-icon-files',
        pageName: 'FileSetupPage',
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/FileSetupView.vue'),
    },
    /*  生产工厂
    ------------------------------------------ */
    {
      path: '/factoryManag',
      name: 'factoryManage',
      meta: {
        title: '生产工厂',
        icon: 'el-icon-school',
        pageName: 'FactoryManagePage',
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/FactoryManagePage.vue'),
    },
  ],
};

const routeTree = {
  name: 'basicSet',
  isModuleRoot: true,
  children: [
    /*  定金设置
    ------------------------------------------ */
    {
      name: 'depositList',
      children: [
        { name: 'depositSettingsAdd', children: [] },
      ],
    },
    /*  物流费用
    ------------------------------------------ */
    {
      name: 'ExpressList',
      children: [
        { name: 'ExpressPriceSettingList', children: [] },
        { name: 'ExpressPriceAddEdit', children: [] },
      ],
    },
    /*  印刷幅面
    ------------------------------------------ */
    {
      name: 'PrintFormatList',
      children: [
        { name: 'PrintFormatClassManage', children: [] },
      ],
    },
    /*  元素模板
    ------------------------------------------ */
    {
      name: 'elementTemplate',
      children: [],
    },
    /*  文件类目
    ------------------------------------------ */
    {
      name: 'fileListSet',
      children: [],
    },
    /*  生产工厂
    ------------------------------------------ */
    {
      name: 'factoryManage',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
