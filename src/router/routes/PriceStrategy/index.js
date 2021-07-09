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
    /*  优惠券
    ------------------------------------------ */
    {
      path: '/couponList',
      name: 'couponList',
      meta: {
        title: '优惠券',
        icon: 'el-icon-s-ticket',
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
        PermissionInfo: ['PermissionCoupon', 'HavePomission'],
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
        icon: 'el-icon-s-claim',
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
        PermissionInfo: ['PermissionPromote', 'HavePomission'],
      },
      component: () => import('../../../views/PromotePage/PromoteAddPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'priceTactics',
  isModuleRoot: true,
  children: [
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
        { name: 'promoteAdd', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
