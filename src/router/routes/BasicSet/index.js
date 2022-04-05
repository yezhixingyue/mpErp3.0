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
    /*  客户设置
    ------------------------------------------ */
    {
      path: '/customerSetup',
      name: 'customerSetup',
      meta: {
        title: '客户设置',
        icon: 'iconfont icon-kehushezhi',
        pageName: 'CustomerSetupPage',
        PermissionInfo: ['PermissionSetupCustomerType', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/CustomerSetupPage.vue'),
    },
    /*  销售区域
    ------------------------------------------ */
    {
      path: '/sellArea',
      name: 'sellArea',
      meta: {
        title: '销售区域',
        icon: 'iconfont icon-xiaoshouquyu',
        pageName: 'SellAreaSetupPage',
        PermissionInfo: ['PermissionSetupSellArea', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/SellAreaSetupPage.vue'),
    },
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
        PermissionInfo: ['PermissionSetupDeposit', 'Obj', 'Manage'],
      },
      component: () => import('../../../views/DepositPage/DepositSettingsAddPage.vue'),
    },
    /*  物流费用
    ------------------------------------------ */
    {
      path: '/LogisticList',
      name: 'LogisticList',
      meta: {
        title: '物流快递',
        requiresAuth: true,
        pageName: 'LogisticManageListPage',
        icon: 'el-icon-connection',
        PermissionInfo: ['PermissionManageLogistics', 'HavePomission'],
      },
      component: () => import('../../../views/LogisticManagePages/LogisticManageListPage.vue'),
    },
    {
      path: '/LogisticPriceList/:id/:name',
      name: 'LogisticPriceList',
      meta: {
        title: '设置价格 - 物流快递',
        requiresAuth: true,
        pageName: 'LogisticPriceSettingListPage',
        PermissionInfo: ['PermissionManageLogistics', 'Obj', 'Setup'],
      },
      component: () => import('../../../views/LogisticManagePages/LogisticPriceSettingListPage.vue'),
    },
    {
      path: '/LogisticPriceSetup/:id/:name',
      name: 'LogisticPriceSetup',
      meta: {
        title: '物流价格添加与编辑',
        requiresAuth: true,
        pageName: 'LogisticPriceSetupPage',
        PermissionInfo: ['Developing', 'None'],
      },
      component: () => import('../../../views/LogisticManagePages/LogisticPriceSetupPage.vue'),
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
        PermissionInfo: ['PermissionBreadth', 'HavePomission'],
      },
      component: () => import('../../../views/BasicSetup/PrintFormat/PrintFormatListPage.vue'),
    },
    {
      path: '/PrintFormatClassManage',
      name: 'PrintFormatClassManage',
      meta: {
        title: '印刷幅面分类管理',
        requiresAuth: true,
        PermissionInfo: ['PermissionBreadth', 'Obj', 'SetupBreadthClass'],
        pageName: 'PrintFormatClassManagePage',
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
        PermissionInfo: ['PermissionElementTemplate', 'HavePomission'],
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
        PermissionInfo: ['PermissionFileCategory', 'HavePomission'],
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
        PermissionInfo: ['PermissionSetupFactoryBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/FactoryManagePage.vue'),
    },
    /*  停机维护
    ------------------------------------------ */
    {
      path: '/downtimeManage',
      name: 'downtimeManage',
      meta: {
        title: '停机维护',
        pageName: 'DowntimeManagePage',
        icon: 'el-icon-school',
        PermissionInfo: ['Developing', 'HavePomission'],
        requiresAuth: true,
        hiddenItem: true,
      },
      component: () => import('../../../views/BasicSetup/DowntimeManagePage.vue'),
    },
  ],
};

const routeTree = {
  name: 'basicSet',
  isModuleRoot: true,
  children: [
    /*  客户设置
    ------------------------------------------ */
    {
      name: 'customerSetup',
      children: [],
    },
    /*  销售区域
    ------------------------------------------ */
    {
      name: 'sellArea',
      children: [],
    },
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
      name: 'LogisticList',
      children: [
        { name: 'LogisticPriceList',
          children: [
            { name: 'LogisticPriceSetup', children: [] },
          ],
        },
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
    /*  停机维护
    ------------------------------------------ */
    {
      name: 'downtimeManage',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
