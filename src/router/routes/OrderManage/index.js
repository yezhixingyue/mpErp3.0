import CommonNullView from '@/components/common/Layout/CommonNullView.vue';
import StatisticAnalyseRoutes from './StatisticAnalyse';

const routes = { // 客户订单管理
  path: '/customeOrderManage',
  component: CommonNullView,
  meta: {
    title: '客户订单管理',
    requiresAuth: true,
    icon: 'el-icon-s-platform',
  },
  children: [
    /*  订单管理
    ------------------------------------------ */
    {
      path: '/orderManage',
      name: 'orderManage',
      meta: {
        title: '订单管理',
        icon: 'iconfont icon-dingdanguanli1',
        pageName: 'Order',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageOrder', 'HavePomission'],
      },
      component: () => import('../../../components/order/Order.vue'),
    },
    /*  运单管理
    ------------------------------------------ */
    {
      path: '/transport',
      name: 'transport',
      meta: {
        title: '运单管理',
        icon: 'iconfont icon-yundanguanli',
        pageName: 'PackageListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageOrder', 'HavePomission'],
      },
      component: () => import('../../../views/PackageListPage.vue'),
    },
    /*  付款单列表
    ------------------------------------------ */
    {
      path: '/paymentList',
      name: 'paymentList',
      meta: {
        title: '付款单列表',
        icon: 'iconfont icon-fukuandanliebiao',
        pageName: 'PaymentListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageOrder', 'Obj', 'HelpSubmit'],
      },
      component: () => import('../../../views/PaymentListPage.vue'),
    },
    /*  售后管理
    ------------------------------------------ */
    {
      path: '/service',
      name: 'service',
      meta: {
        title: '售后管理',
        icon: 'iconfont icon-shouhouguanli',
        pageName: 'ServicePage',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageOrder', 'Obj', 'ApplyAfterSales'],
      },
      component: () => import('../../../views/ServicePage.vue'),
    },
    /*  未付款订单
    ------------------------------------------ */
    {
      path: '/qutstandingpayment',
      name: 'qutstandingpayment',
      meta: {
        title: '未付款订单',
        icon: 'iconfont icon-weifukuandingdan',
        pageName: 'QutstandingPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageOrder', 'Obj', 'HelpSubmit'],
      },
      component: () => import('../../../views/QutstandingPage.vue'),
    },
    /*  售后申请列表
    ------------------------------------------ */
    {
      path: '/feedback',
      name: 'feedback',
      meta: {
        title: '售后申请列表',
        icon: 'iconfont icon-shouhoushenqingliebiao',
        pageName: 'FeedbackPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
      },
      component: () => import('../../../views/FeedbackPage.vue'),
    },
    /*  统计分析
    ------------------------------------------ */
    ...StatisticAnalyseRoutes.routes,
  ],
};

const routeTree = {
  name: 'customeOrderManage',
  isModuleRoot: true,
  children: [
    /*  订单管理
    ------------------------------------------ */
    { name: 'orderManage', children: [] },
    /*  运单管理
    ------------------------------------------ */
    { name: 'transport', children: [] },
    /*  付款单列表
    ------------------------------------------ */
    { name: 'paymentList', children: [] },
    /*  售后管理
    ------------------------------------------ */
    { name: 'service', children: [] },
    /*  未付款订单
    ------------------------------------------ */
    { name: 'qutstandingpayment', children: [] },
    /*  售后申请列表
    ------------------------------------------ */
    { name: 'feedback', children: [] },
    /*  统计分析
    ------------------------------------------ */
    ...StatisticAnalyseRoutes.routeTree,
  ],
};

export default {
  routes,
  routeTree,
};
