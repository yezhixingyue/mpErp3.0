import CommonNullView from '@/components/common/Layout/CommonNullView.vue';

const routes = { // 价格策略
  path: '/priceTactics',
  component: CommonNullView,
  meta: {
    title: '价格策略',
    requiresAuth: true,
    icon: 'el-icon-s-help',
  },
  children: [
    /*  价格策略
    ------------------------------------------ */
    {
      path: '/priceTacticList',
      name: 'priceTacticList',
      meta: {
        requiresAuth: true,
        title: '价格策略',
        icon: 'iconfont icon-jiagecelve',
        pageName: 'PriceTacticListPage',
        PermissionInfo: ['PermissionPricePolicy', 'HavePomission'],
      },
      component: () => import('../../../views/PriceTactic/PriceTacticListPage.vue'),
    },
    /*  优惠券
    ------------------------------------------ */
    {
      path: '/couponList',
      name: 'couponList',
      meta: {
        title: '优惠券',
        icon: 'iconfont icon-youhuiquan2',
        pageName: 'CouponListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCoupon', 'HavePomission'],
      },
      component: () => import('../../../views/CouponPage/CouponListPage.vue'),
    },
    {
      path: '/couponAdd/:type',
      name: 'couponAdd',
      meta: {
        title: '添加优惠券',
        requiresAuth: true,
        pageName: 'CouponAddPage',
        PermissionInfo: ['PermissionCoupon', 'Obj', 'Setup'],
      },
      component: () => import('../../../views/CouponPage/CouponAddPage.vue'),
    },
    {
      path: '/couponDetailList',
      name: 'couponDetailList',
      meta: {
        title: '优惠券使用列表',
        requiresAuth: true,
        pageName: 'CouponDetailPage',
        PermissionInfo: ['PermissionCoupon', 'HavePomission'],
      },
      component: () => import('../../../views/CouponPage/CouponDetailPage.vue'),
    },
    /*  促销活动
    ------------------------------------------ */
    {
      path: '/promoteList',
      name: 'promoteList',
      meta: {
        requiresAuth: true,
        title: '促销活动',
        icon: 'iconfont icon-cuxiaohuodong',
        pageName: 'PromoteListPage',
        PermissionInfo: ['PermissionPromote', 'HavePomission'],
      },
      component: () => import('../../../views/PromotePage/PromoteListPage.vue'),
    },
    {
      path: '/promoteAdd/:type',
      name: 'promoteAdd',
      meta: {
        title: '活动添加',
        requiresAuth: true,
        pageName: 'PromoteAddPage',
        // PermissionInfo: ['PermissionPromote', 'Obj', 'Setup'],
        PermissionInfo: ['PermissionPromote', 'HavePomission'],
      },
      component: () => import('../../../views/PromotePage/PromoteAddPage.vue'),
    },
    {
      path: '/promoteConditionSet/:productIndex/:itemIndex/:productNames',
      name: 'promoteConditionSet',
      meta: {
        title: '设置活动价格',
        requiresAuth: true,
        pageName: 'promoteConditionSet',
        PermissionInfo: ['PermissionPromote', 'Obj', 'Setup'],
      },
      component: () => import('../../../views/PromotePage/PromoteConditionSet.vue'),
    },
    /*  印豆管理
    ------------------------------------------ */
    {
      path: '/printBeanList',
      name: 'printBeanList',
      meta: {
        requiresAuth: true,
        title: '印豆管理',
        icon: 'iconfont icon-yindouguanli',
        pageName: 'PrintBeanListPage',
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/PrintBeanManagePages/PrintBeanListPage.vue'),
    },
    {
      path: '/printBeanSetup/:ID',
      name: 'printBeanSetup',
      meta: {
        requiresAuth: true,
        title: '印豆设置',
        pageName: 'PrintBeanSetupPage',
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/PrintBeanManagePages/PrintBeanSetupPage.vue'),
    },
    /*  消费返现
    ------------------------------------------ */
    {
      path: '/cashBackList',
      name: 'cashBackList',
      meta: {
        requiresAuth: true,
        title: '消费返现',
        icon: 'iconfont icon-xiaofeifanxian',
        pageName: 'CashBackListPage',
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/PrintBeanManagePages/CashBackListPage.vue'),
    },
    {
      path: '/cashBackSetup/:ID',
      name: 'cashBackSetup',
      meta: {
        requiresAuth: true,
        title: '消费返现设置',
        pageName: 'CashBackSetupPage',
        PermissionInfo: ['Developing', 'HavePomission'],
      },
      component: () => import('../../../views/PrintBeanManagePages/CashBackSetupPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'priceTactics',
  isModuleRoot: true,
  children: [
    /*  价格策略
    ------------------------------------------ */
    {
      name: 'priceTacticList',
      children: [],
    },
    /*  优惠券
    ------------------------------------------ */
    {
      name: 'couponList',
      children: [
        { name: 'couponAdd', children: [] },
        { name: 'couponDetailList', children: [] },
      ],
    },
    /*  促销活动
    ------------------------------------------ */
    {
      name: 'promoteList',
      children: [
        { name: 'promoteAdd',
          children: [
            { name: 'promoteConditionSet', children: [] },
          ],
        },
      ],
    },
    /*  印豆管理
    ------------------------------------------ */
    {
      name: 'printBeanList',
      children: [
        { name: 'printBeanSetup', children: [] },
      ],
    },
    /*  消费返现
    ------------------------------------------ */
    {
      name: 'cashBackList',
      children: [
        { name: 'cashBackSetup', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
