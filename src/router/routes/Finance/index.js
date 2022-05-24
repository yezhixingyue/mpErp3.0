import CommonNullView from '@/components/common/Layout/CommonNullView.vue';

const routes = { // 财务管理
  path: '/financeManage',
  component: CommonNullView,
  name: 'financeManage',
  meta: {
    title: '财务管理',
    requiresAuth: true,
    icon: 'el-icon-s-finance',
  },
  children: [
    /*  财务管理
    ------------------------------------------ */
    {
      path: '/finance',
      name: 'finance',
      meta: {
        title: '财务管理',
        icon: 'iconfont icon-caiwuguanli',
        pageName: 'FinancePage',
        requiresAuth: true,
        PermissionInfo: ['PermissionFinance', 'HavePomission'],
      },
      component: () => import('../../../views/FinancePage.vue'),
    },
    /*  客户流水
    ------------------------------------------ */
    {
      path: '/fundBill',
      name: 'fundBill',
      meta: {
        title: '客户流水',
        icon: 'iconfont icon-kehuliushui',
        pageName: 'FundBillPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCustomerBill', 'HavePomission'],
      },
      component: () => import('../../../views/FundBillPage.vue'),
    },
    /*  发票管理
    ------------------------------------------ */
    {
      path: '/InvoiceMakeOutList',
      name: 'InvoiceMakeOutList',
      meta: {
        title: '发票开具',
        icon: 'iconfont icon-kehuliushui',
        pageName: 'InvoiceMakeOutListPage',
        requiresAuth: true,
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/InvoicePages/InvoiceMakeOutListPage.vue'),
    },
    {
      path: '/InvoiceMakeOutDetail',
      name: 'InvoiceMakeOutDetail',
      meta: {
        title: '发票开具详情',
        pageName: 'InvoiceMakeOutDetailPage',
        requiresAuth: true,
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/InvoicePages/InvoiceMakeOutDetailPage.vue'),
    },
    {
      path: '/InvoiceQualificationManage',
      name: 'InvoiceQualificationManage',
      meta: {
        title: '发票资质管理',
        icon: 'iconfont icon-kehuliushui',
        pageName: 'InvoiceQualificationManagePage',
        requiresAuth: true,
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/InvoicePages/InvoiceQualificationManagePage.vue'),
    },
    {
      path: '/InvoiceInfoList',
      name: 'InvoiceInfoList',
      meta: {
        title: '开票类别',
        icon: 'iconfont icon-kehuliushui',
        pageName: 'InvoiceInfoListPage',
        requiresAuth: true,
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/InvoicePages/InvoiceInfoListPage.vue'),
    },
    {
      path: '/InvoiceInfoSetting/:id',
      name: 'InvoiceInfoSetting',
      meta: {
        title: '开票类别设置',
        pageName: 'InvoiceInfoSettingPage',
        requiresAuth: true,
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/InvoicePages/InvoiceInfoSettingPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'financeManage',
  isModuleRoot: true,
  children: [
    /*  财务管理
    ------------------------------------------ */
    {
      name: 'finance',
      children: [],
    },
    /*  客户流水
    ------------------------------------------ */
    {
      name: 'fundBill',
      children: [],
    },
    /*  发票管理
    ------------------------------------------ */
    {
      name: 'InvoiceMakeOutList',
      children: [
        {
          name: 'InvoiceMakeOutDetail',
          children: [],
        },
      ],
    },
    {
      name: 'InvoiceQualificationManage',
      children: [],
    },
    {
      name: 'InvoiceInfoList',
      children: [
        {
          name: 'InvoiceInfoSetting',
          children: [],
        },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
