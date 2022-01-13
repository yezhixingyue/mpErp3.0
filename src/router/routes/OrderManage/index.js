import CommonNullView from '@/components/common/Layout/CommonNullView.vue';
import StatisticAnalyseRoutes from './StatisticAnalyse';

const routes = { // 客户订单管理
  path: '/customeOrderManage',
  component: CommonNullView,
  meta: {
    title: '客户订单管理',
    requiresAuth: true,
    icon: 'el-icon-s-order',
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
    {
      path: '/GetPriceRecord',
      name: 'GetPriceRecord',
      meta: {
        title: '报价记录',
        icon: 'el-icon-edit-outline el-icon',
        pageName: 'GetPriceRecordListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'HavePomission'],
      },
      component: () => import('../../../views/GetPriceRecord/index.vue'),
    },
    {
      path: '/BatchUpload',
      name: 'BatchUpload',
      meta: {
        title: '批量上传',
        // icon: 'el-icon-upload el-icon',
        icon: 'iconfont icon-shangchuan',
        pageName: 'OrderBatchUploadPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionPlateOrder', 'Obj', 'BatchUpload'],
      },
      component: () => import('../../../views/BatchUpload/BatchUploadPage.vue'),
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
        PermissionInfo: ['PermissionWaybill', 'HavePomission'],
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
        PermissionInfo: ['PermissionPayment', 'HavePomission'],
      },
      component: () => import('../../../views/PaymentListPage.vue'),
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
        PermissionInfo: ['Developing', 'Obj', 'HelpSubmit'],
      },
      component: () => import('../../../views/QutstandingPage.vue'),
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
        PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
      },
      component: () => import('../../../views/ServicePage.vue'),
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
        PermissionInfo: ['PermissionAfterSalesApply', 'HavePomission'],
      },
      component: () => import('../../../views/FeedbackPage.vue'),
    },
    /*  客户管理
    ------------------------------------------ */
    {
      path: '/CustomerManageList',
      name: 'CustomerManageList',
      meta: {
        title: '客户管理',
        icon: 'el-icon-s-custom',
        pageName: 'CustomerManageListPage',
        PermissionInfo: ['PermissionManageCustomer', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CustomerManage/CustomerManageListPage.vue'),
    },
    {
      path: '/CustomerManageSetup/:ID',
      name: 'CustomerManageSetup',
      meta: {
        title: '客户设置',
        pageName: 'CustomerManageSetupPage',
        PermissionInfo: ['PermissionManageCustomer', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CustomerManage/CustomerManageSetupPage.vue'),
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
    { name: 'GetPriceRecord', children: [] },
    { name: 'BatchUpload', children: [] },
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
    /*  客户管理
    ------------------------------------------ */
    { name: 'CustomerManageList',
      children: [
        { name: 'CustomerManageSetup', children: [] },
      ],
    },
    /*  统计分析
    ------------------------------------------ */
    ...StatisticAnalyseRoutes.routeTree,
  ],
};

export default {
  routes,
  routeTree,
};
