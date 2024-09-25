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
      path: '/applyAfterSales',
      name: 'applyAfterSales',
      meta: {
        title: '申请售后',
        pageName: 'applyAfterSalesPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageOrder', 'HavePomission'],
      },
      component: () => import('../../../views/AfterSales/OnBehalfOfConsumerAfterSales.vue'),
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
        hiddenItem: true,
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
    // {
    //   path: '/qutstandingpayment',
    //   name: 'qutstandingpayment',
    //   meta: {
    //     title: '未付款订单',
    //     icon: 'iconfont icon-weifukuandingdan',
    //     pageName: 'QutstandingPage',
    //     requiresAuth: true,
    //     PermissionInfo: ['Developing', 'Obj', 'HelpSubmit'],
    //   },
    //   component: () => import('../../../views/QutstandingPage.vue'),
    // },
    /*  售后管理
    ------------------------------------------ */
    // {
    //   path: '/Service',
    //   name: 'Service',
    //   meta: {
    //     title: '售后管理',
    //     icon: 'iconfont icon-shouhouguanli',
    //     pageName: 'ServicePage',
    //     requiresAuth: true,
    //     PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
    //   },
    //   component: () => import('../../../views/AfterSaleQuestion/ServicePage.vue'),
    // },
    // {
    //   path: '/ResponsibilityMeasure',
    //   name: 'ResponsibilityMeasure',
    //   meta: {
    //     title: '售后管理',
    //     pageName: 'ResponsibilityMeasurePage',
    //     requiresAuth: true,
    //     PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
    //   },
    //   component: () => import('../../../views/AfterSaleQuestion/ResponsibilityMeasurePage.vue'),
    // },
    {
      path: '/QuestionClass',
      name: 'QuestionClass',
      meta: {
        title: '管理问题分类',
        pageName: 'QuestionClassPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
      },
      component: () => import('../../../views/AfterSaleQuestion/QuestionClassPage.vue'),
    },
    // {
    //   path: '/ServiceInfo',
    //   name: 'ServiceInfo',
    //   meta: {
    //     title: '售后详情',
    //     pageName: 'ServiceAfterSaleInfoPage',
    //     PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
    //     requiresAuth: true,
    //   },
    //   component: () => import('../../../components/ServiceAfterSale/Main/ServiceAfterSaleInfoPage.vue'),
    // },
    /*  售后申请列表
    ------------------------------------------ */
    // {
    //   path: '/Feedback',
    //   name: 'Feedback',
    //   meta: {
    //     title: '售后申请列表',
    //     icon: 'iconfont icon-shouhoushenqingliebiao',
    //     pageName: 'FeedbackPage',
    //     requiresAuth: true,
    //     PermissionInfo: ['PermissionAfterSalesApply', 'HavePomission'],
    //   },
    //   component: () => import('../../../views/FeedbackPage/FeedbackListPage.vue'),
    // },
    /*  售后详情
    ------------------------------------------ */
    // {
    //   path: '/FeedbackInfo',
    //   name: 'FeedbackInfo',
    //   meta: {
    //     title: '售后详情',
    //     pageName: 'feedbackInfoPage',
    //     PermissionInfo: ['PermissionAfterSalesApply', 'HavePomission'],
    //     requiresAuth: true,
    //   },
    //   component: () => import('../../../views/FeedbackPage/FeedbackInfoPage.vue'),
    // },
    /*  新售后列表
    ------------------------------------------ */
    {
      path: '/AfterSalesList',
      name: 'AfterSalesList',
      meta: {
        title: '售后列表',
        icon: 'iconfont icon-shouhouliebiao',
        pageName: 'AfterSalesListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
      },
      component: () => import('../../../views/AfterSales/AfterSalesListPage.vue'),
    },
    /*  售后详情
    ------------------------------------------ */
    {
      path: '/AfterSalesInfo',
      name: 'AfterSalesInfo',
      meta: {
        title: '售后详情',
        pageName: 'AfterSalesInfoPage',
        PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/AfterSales/AfterSalesInfoPage.vue'),
    },
    /*  责任划分
    ------------------------------------------ */
    {
      path: '/ResponsibilityMeasureList',
      name: 'ResponsibilityMeasureList',
      meta: {
        title: '划分责任',
        icon: 'iconfont icon-huafenzeren',
        pageName: 'ResponsibilityMeasureListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionResponsibilityDivide', 'HavePomission'],
      },
      component: () => import('../../../views/AfterSales/ResponsibilityMeasureList.vue'),
    },
    /*  责任划分详情
    ------------------------------------------ */
    {
      path: '/ResponsibilityMeasureInfo',
      name: 'ResponsibilityMeasureInfo',
      meta: {
        title: '责任划分详情',
        pageName: 'ResponsibilityMeasurePage',
        PermissionInfo: ['PermissionResponsibilityDivide', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/AfterSales/ResponsibilityMeasureInfoPage.vue'),
    },
    /*  责任确认
    ------------------------------------------ */
    {
      path: '/LiabilityRecognitionList',
      name: 'LiabilityRecognitionList',
      meta: {
        title: '责任确认',
        icon: 'iconfont icon-querenzeren',
        pageName: 'LiabilityRecognitionListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionResponsibilityConfirm', 'HavePomission'],
      },
      component: () => import('../../../views/AfterSales/LiabilityRecognitionList.vue'),
    },
    /*  责任确认详情
    ------------------------------------------ */
    {
      path: '/LiabilityRecognitionInfo',
      name: 'LiabilityRecognitionInfo',
      meta: {
        title: '责任确认详情',
        pageName: 'LiabilityRecognitionPage',
        PermissionInfo: ['PermissionResponsibilityConfirm', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/AfterSales/LiabilityRecognitionInfoPage.vue'),
    },
    /*  客户管理
    ------------------------------------------ */
    {
      path: '/CustomerManageList',
      name: 'CustomerManageList',
      meta: {
        title: '客户管理',
        icon: 'iconfont icon-kehuguanli',
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
    /*  证书管理
    ------------------------------------------ */
    {
      path: '/CertificateList',
      name: 'CertificateList',
      meta: {
        title: '证书管理',
        icon: 'iconfont icon-zhengshuguanli',
        pageName: 'CertificateListPage',
        PermissionInfo: ['PermissionCertificate', 'Obj', 'Query'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CertificateManage/CertificateManageListPage.vue'),
    },
    {
      path: '/AuditCertificate',
      name: 'AuditCertificate',
      meta: {
        title: '审核证书',
        icon: 'iconfont icon-shenhezhengshu',
        pageName: 'AuditCertificatePage',
        PermissionInfo: ['PermissionCertificate', 'Obj', 'Check'],
        requiresAuth: true,
      },
      component: () => import('../../../views/CertificateManage/AuditCertificatePage.vue'),
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
    { name: 'orderManage',
      children: [
        { name: 'applyAfterSales', children: [] },
      ] },
    { name: 'BatchUpload', children: [] },
    /*  运单管理
    ------------------------------------------ */
    { name: 'transport', children: [] },
    /*  付款单列表
    ------------------------------------------ */
    { name: 'paymentList', children: [] },
    /*  售后管理
    ------------------------------------------ */
    // { name: 'service', children: [] },
    // { name: 'Service',
    //   children: [
    //     { name: 'ServiceInfo', children: [] },
    //     { name: 'ResponsibilityMeasure',
    //       children: [
    //         { name: 'QuestionClass', children: [] },
    //       ] },
    //   ],
    // },
    /*  售后列表
    ------------------------------------------ */
    { name: 'AfterSalesList',
      children: [
        { name: 'AfterSalesInfo', children: [] },
        { name: 'QuestionClass', children: [] },
      ],
    },
    /*  责任划分详情
    ------------------------------------------ */
    { name: 'ResponsibilityMeasureList',
      children: [
        { name: 'ResponsibilityMeasureInfo', children: [] },
      ],
    },
    /*  责任确认详情
    ------------------------------------------ */
    { name: 'LiabilityRecognitionList',
      children: [
        { name: 'LiabilityRecognitionInfo', children: [] },
      ],
    },
    /*  未付款订单
    ------------------------------------------ */
    { name: 'qutstandingpayment', children: [] },
    /*  售后申请列表
    ------------------------------------------ */
    { name: 'Feedback',
      children: [
        { name: 'FeedbackInfo', children: [] },
      ],
    },
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
