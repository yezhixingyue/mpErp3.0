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
  ],
};

export default {
  routes,
  routeTree,
};
