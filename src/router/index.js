
import Vue from 'vue';
import VueRouter from 'vue-router';
import getPermission from '@/assets/js/Permission/index';
import Home from '@/views/Home.vue';
import CommonNullView from '@/components/common/Layout/CommonNullView.vue';
import NProgress from 'nprogress';
import messageBox from '../assets/js/utils/message';
import Order from '../components/order/Order.vue';
import store from '../store';
import 'nprogress/nprogress.css';

NProgress.configure({
  trickleSpeed: 50,
  showSpinner: false,
});

Vue.use(VueRouter);

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};


/**
 * @description: 记录是否为首次初始化运行
 */
let isInit = true;

/**
 * 处理权限验证信息，在forEach中使用
 *
 * @param {*} to
 * @param {*} next
 * @param {*} Permission 权限信息列表
 */
function handlePermission(to, next, Permission) {
  let key = Permission;
  if (!to.meta.PermissionInfo) { // 如果没有设定则予以通过
    key = true;
  } else {
    try {
      to.meta.PermissionInfo.forEach(item => { // 2.5 获取到当前页面所需要的权限信息，看是否满足权限要求
        key = key[item];
      });
    } catch (error) {
      messageBox.failSingleError(undefined, '[ 权限信息读取失败 ]');
    }
  }
  if (key) {
    if (isInit) {
      if (to.matched.length >= 2) {
        const lastParent = to.matched[to.matched.length - 2];
        if (lastParent.redirect && lastParent.redirect !== to.path) {
          next({ path: lastParent.redirect });
          return;
        }
      }
      isInit = false;
    }
    NProgress.start();
    next(); // 2.6 如果满足权限要求则允许跳转， 否则跳转提示页面
  } else next({ path: '/notauth' });
}

/**
 * 可根据路由信息自动生成左侧导航按钮，只支持2级目录(大分类模块下小页面模块)，页面模块中可设置多个children，允许在页面内进行多页面跳转,但只会根据第一个children[0]值生成对应导航按钮
 * 页面间跳转 返回时禁用go(-1)跳转  应使用replace或push等方式 不然会导致页面间跳转错乱
 */
export const routes = [
  {
    path: '/',
    // redirect: '/orderManage',
    meta: {
      title: '首页 - 名片之家后台管理系统',
      requiresAuth: true,
      hideMenu: true,
    },
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      requiresAuth: false,
      hideMenu: true,
    },
    component: () => import('../views/LoginPage.vue'),
  },
  { // 客户订单管理
    path: '/customeOrderManage',
    // redirect: '/orderManage',
    component: CommonNullView,
    meta: {
      title: '客户订单管理',
      requiresAuth: true,
      icon: 'el-icon-s-platform',
    },
    children: [
      { // 订单管理
        path: '/orderManage',
        name: 'orderManage',
        meta: {
          title: '订单管理',
          icon: 'el-icon-s-order',
          pageName: 'Order',
          requiresAuth: true,
          PermissionInfo: ['PermissionManageOrder', 'HavePomission'],
        },
        component: Order,
      },
      {
        path: '/transport',
        name: 'transport',
        meta: {
          title: '运单管理',
          icon: 'el-icon-s-unfold',
          pageName: 'PackageListPage',
          requiresAuth: true,
          PermissionInfo: ['PermissionManageOrder', 'HavePomission'],
        },
        component: () => import('../views/PackageListPage.vue'),
      },
      {
        path: '/paymentList',
        name: 'paymentList',
        meta: {
          title: '付款单列表',
          icon: 'el-icon-s-fold',
          pageName: 'PaymentListPage',
          requiresAuth: true,
          PermissionInfo: ['PermissionManageOrder', 'Obj', 'HelpSubmit'],
        },
        component: () => import('../views/PaymentListPage.vue'),
      },
      {
        path: '/service',
        name: 'service',
        meta: {
          title: '售后管理',
          icon: 'el-icon-s-claim',
          pageName: 'ServicePage',
          requiresAuth: true,
          PermissionInfo: ['PermissionManageOrder', 'Obj', 'ApplyAfterSales'],
        },
        component: () => import('../views/ServicePage.vue'),
      },
      {
        path: '/qutstandingpayment',
        name: 'qutstandingpayment',
        meta: {
          title: '未付款订单',
          icon: 'el-icon-s-release',
          pageName: 'QutstandingPage',
          requiresAuth: true,
          PermissionInfo: ['PermissionManageOrder', 'Obj', 'HelpSubmit'],
        },
        component: () => import('../views/QutstandingPage.vue'),
      },
      {
        path: '/feedback',
        name: 'feedback',
        meta: {
          title: '售后申请列表',
          icon: 'el-icon-s-comment',
          pageName: 'FeedbackPage',
          requiresAuth: true,
          PermissionInfo: ['PermissionManageAfterSales', 'HavePomission'],
        },
        component: () => import('../views/FeedbackPage.vue'),
      },
      {
        path: '/StatisticAnalyse',
        name: 'StatisticAnalyse',
        meta: {
          title: '统计分析',
          icon: 'el-icon-s-data',
          pageName: 'StatisticAnalyseHomePage',
          requiresAuth: true,
        },
        redirect: '/StatisticalList',
        component: () => import('../views/StatisticAnalysePages/StatisticAnalyseHomePage.vue'),
        children: [
          {
            path: '/StatisticalList',
            name: 'StatisticalList',
            meta: {
              title: '统计列表',
              requiresAuth: true,
              scroll: 0,
            },
            component: () => import('../views/StatisticAnalysePages/StatisticalListPage.vue'),
          },
          {
            path: '/StatisticalSummary',
            name: 'StatisticalSummary',
            meta: {
              title: '汇总面板',
              requiresAuth: true,
              needFetch: true,
            },
            component: () => import('../views/StatisticAnalysePages/StatisticalSummaryPage.vue'),
          },
          {
            path: '/StatisticalFormSetting/:type',
            name: 'StatisticalFormSetting',
            meta: {
              title: '配置统计表',
              requiresAuth: true,
            },
            component: () => import('../views/StatisticAnalysePages/StatisticalFormAddEditPage.vue'),
          },
          {
            path: '/StatisticalSummarySetting/:type',
            name: 'StatisticalSummarySetting',
            meta: {
              title: '配置汇总面板',
              requiresAuth: true,
            },
            component: () => import('../views/StatisticAnalysePages/StatisticalSummaryAddEditPage.vue'),
          },
          {
            path: '/StatisticFormView/:id',
            name: 'StatisticFormView',
            meta: {
              title: '查看统计表',
              requiresAuth: true,
            },
            component: () => import('../views/StatisticAnalysePages/StatisticFormViewPage.vue'),
          },
          {
            path: '/StatisticSummaryView/:id',
            name: 'StatisticSummaryView',
            meta: {
              title: '查看汇总面板',
              requiresAuth: true,
            },
            component: () => import('../views/StatisticAnalysePages/StatisticSummaryViewPage.vue'),
          },
        ],
      },
    ],
  },
  { // 财务管理
    path: '/financeManage',
    // redirect: '/finance',
    component: CommonNullView,
    meta: {
      title: '财务管理',
      requiresAuth: true,
      icon: 'el-icon-s-finance',
    },
    children: [
      {
        path: '/finance',
        name: 'finance',
        meta: {
          title: '财务管理',
          icon: 'el-icon-s-finance',
          pageName: 'FinancePage',
          requiresAuth: true,
          PermissionInfo: ['PermissionFinance', 'HavePomission'],
        },
        component: () => import('../views/FinancePage.vue'),
      },
      {
        path: '/fundBill',
        name: 'fundBill',
        meta: {
          title: '客户流水',
          icon: 'el-icon-tickets',
          pageName: 'FundBillPage',
          requiresAuth: true,
        },
        component: () => import('../views/FundBillPage.vue'),
      },
    ],
  },
  { // 价格策略
    path: '/priceTactics',
    component: CommonNullView,
    meta: {
      title: '价格策略',
      requiresAuth: true,
      icon: 'el-icon-s-help',
    },
    children: [
      {
        path: '/coupon',
        name: 'coupon',
        meta: {
          title: '优惠券',
          icon: 'el-icon-s-ticket',
          pageName: 'CouponPage',
          requiresAuth: true,
        },
        redirect: '/couponList',
        component: () => import('../views/CouponPage/CouponPage.vue'),
        children: [
          {
            path: '/couponList',
            name: 'couponList',
            meta: {
              title: '优惠券',
              requiresAuth: true,
              PermissionInfo: ['PermissionCoupon', 'HavePomission'],
            },
            component: () => import('../views/CouponPage/CouponListPage.vue'),
          },
          {
            path: '/couponAdd/:type',
            name: 'couponAdd',
            meta: {
              title: '添加优惠券',
              requiresAuth: true,
              PermissionInfo: ['PermissionCoupon', 'HavePomission'],
            },
            component: () => import('../views/CouponPage/CouponAddPage.vue'),
          },
          {
            path: '/couponDetailList',
            name: 'couponDetailList',
            meta: {
              title: '优惠券使用列表',
              requiresAuth: true,
              PermissionInfo: ['PermissionCoupon', 'HavePomission'],
            },
            component: () => import('../views/CouponPage/CouponDetailPage.vue'),
          },
        ],
      },
      {
        path: '/promote',
        name: 'promote',
        meta: {
          title: '促销活动',
          icon: 'el-icon-s-claim',
          pageName: 'PromotePage',
          requiresAuth: true,
        },
        redirect: '/promoteList',
        component: () => import('../views/PromotePage/PromotePage.vue'),
        children: [
          {
            path: '/promoteList',
            name: 'promoteList',
            meta: {
              title: '活动列表',
              requiresAuth: true,
              PermissionInfo: ['PermissionPromote', 'HavePomission'],
            },
            component: () => import('../views/PromotePage/PromoteListPage.vue'),
          },
          {
            path: '/promoteAdd/:type',
            name: 'promoteAdd',
            meta: {
              title: '活动添加',
              requiresAuth: true,
              PermissionInfo: ['PermissionPromote', 'HavePomission'],
            },
            component: () => import('../views/PromotePage/PromoteAddPage.vue'),
          },
        ],
      },
    ],
  },
  { // 产品/工艺管理
    path: '/craftProductManage',
    // redirect: '/depositList',
    component: CommonNullView,
    meta: {
      title: '产品/工艺管理',
      requiresAuth: true,
      icon: 'el-icon-menu',
    },
    children: [
      { // 产品管理
        path: '/productRootPage',
        name: 'productRootPage',
        meta: {
          title: '产品管理',
          icon: 'el-icon-s-management',
          pageName: 'ProductRootPage',
          requiresAuth: true,
        },
        redirect: '/ProductManageList',
        component: () => import('../views/ProductManage/RootPage.vue'),
        children: [
          {
            path: '/ProductManageList',
            name: 'ProductManageList',
            meta: {
              title: '产品管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductManageListPage.vue'),
          },
          {
            path: '/ProductClassifyManage',
            name: 'ProductClassifyManage',
            meta: {
              title: '产品分类管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductClassifyManagePage.vue'),
          },
          {
            path: '/ProductDataSave/:times',
            name: 'ProductDataSave',
            meta: {
              title: '设置产品',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductDataSavePage.vue'),
          },
          {
            path: '/ProductElementSet/:id/:name/:type/:times',
            name: 'ProductElementSet',
            meta: {
              title: '界面元素设置 - 产品|部件管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductElementSetPage.vue'),
          },
          {
            // path: '/ProductSizeMaterialSet/:id/:name/:type/:times',
            path: '/ProductSizeMaterialSet/:ProductID/:PartID/:name/:type/:times',
            name: 'ProductSizeMaterialSet',
            meta: {
              title: '尺寸物料设置 - 产品|部件管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductSizeMaterialSetPage.vue'),
          },
          {
            path: '/ProductCraftSet/:ProductID/:PartID/:name/:type/:times',
            name: 'ProductCraftSet',
            meta: {
              title: '工艺设置 - 产品|部件管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductCraftSetPage.vue'),
          },
          {
            path: '/ProductDisplaySort/:ProductID/:PartID/:name/:type/:materialName/:times',
            name: 'ProductDisplaySort',
            meta: {
              title: '显示排序设置 - 产品管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductDisplaySortPage.vue'),
          },
          {
            path: '/ProductFactorySet/:ProductID/:PartID/:name/:type/:times',
            name: 'ProductFactorySet',
            meta: {
              title: '工厂设置 - 产品管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductFactorySetPage.vue'),
          },
          {
            path: '/ProductFileSet/:ProductID/:PartID/:name/:type/:times',
            name: 'ProductFileSet',
            meta: {
              title: '文件设置 - 产品管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductFileSetPage.vue'),
          },
          {
            path: '/ProductFormulaSet/:ProductID/:PartID/:name/:type/:times',
            name: 'ProductFormulaSet',
            meta: {
              title: '公式设置 - 产品管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductFormulaSetPage.vue'),
          },
          {
            path: '/ProductInteractionSet/:ProductID/:PartID/:name/:type/:times',
            name: 'ProductInteractionSet',
            meta: {
              title: '交互设置 - 产品管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductInteractionSetPage.vue'),
          },
          {
            path: '/ProductFileNameSet/:ProductID/:PartID/:name/:type/:times',
            name: 'ProductFileNameSet',
            meta: {
              title: '文件名设置 - 产品管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductFileNameSetPage.vue'),
          },
          {
            path: '/ProductStockSet/:ProductID/:PartID/:name/:type/:times',
            name: 'ProductStockSet',
            meta: {
              title: '库存设置 - 产品管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ProductManage/ProductStockSetPage.vue'),
          },
        ],
      },
      { // 工艺管理
        path: '/craftRootPage',
        name: 'craftRootPage',
        meta: {
          title: '工艺管理',
          icon: 'el-icon-s-cooperation',
          pageName: 'CraftRootPage',
          requiresAuth: true,
        },
        redirect: '/CraftManageList',
        component: () => import('../views/Craft/CraftRootPage.vue'),
        children: [
          {
            path: '/CraftManageList',
            name: 'CraftManageList',
            meta: {
              title: '工艺管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/Craft/CraftManageListPage.vue'),
          },
          {
            path: '/CraftClassifyManage',
            name: 'CraftClassifyManage',
            meta: {
              title: '工艺分类管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/Craft/CraftClassifyManagePage.vue'),
          },
          {
            path: '/CraftElementSet/:id/:name',
            name: 'CraftElementSet',
            meta: {
              title: '工艺界面元素设置',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/Craft/CraftElementSetPage.vue'),
          },
        ],
      },
      { // 工期管理
        path: '/timeLimit',
        name: 'timeLimit',
        meta: {
          title: '工期管理',
          icon: 'el-icon-s-marketing',
          pageName: 'TimeLimitPage',
          requiresAuth: true,
        },
        redirect: '/timeLimitList',
        component: () => import('../views/TimeLimitPage/TimeLimitPage.vue'),
        children: [
          {
            path: '/timeLimitList',
            name: 'timeLimitList',
            meta: {
              title: '工期列表',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/TimeLimitPage/TimeLimitList.vue'),
          },
          {
            path: '/timeLimitSet',
            name: 'timeLimitSet',
            meta: {
              title: '工期设置',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/TimeLimitPage/TimeLimitSet.vue'),
          },
        ],
      },
    ],
  },
  { // 物料管理
    path: '/materialManageModule',
    component: CommonNullView,
    meta: {
      title: '物料管理',
      requiresAuth: true,
      icon: 'el-icon-set-up',
    },
    children: [
      { // 物料尺寸
        path: '/materialSize',
        name: 'materialSize',
        meta: {
          title: '物料尺寸',
          icon: 'el-icon-notebook-2',
          pageName: 'MaterialSizePage',
          requiresAuth: true,
        },
        component: () => import('../views/BasicSetup/MaterialSizePage.vue'),
      },
      { // 物料类型
        path: '/materialType',
        name: 'materialType',
        meta: {
          title: '物料类型',
          icon: 'el-icon-toilet-paper',
          pageName: 'MaterialTypeRootPage',
          requiresAuth: true,
        },
        component: () => import('../views/BasicSetup/MaterialType/MaterialTypeRootPage.vue'),
        redirect: '/MaterialTypeList',
        children: [
          {
            path: '/MaterialTypeList',
            name: 'MaterialTypeList',
            meta: {
              title: '物料类型列表',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/BasicSetup/MaterialType/MaterialTypeListPage.vue'),
          },
          {
            path: '/MaterialFormulaList/:id/:name/:timer',
            name: 'MaterialFormulaList',
            meta: {
              title: '物料公式列表',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/BasicSetup/MaterialType/MaterialFormulaListPage.vue'),
          },
          {
            path: '/MaterialFormulaSetup/:id/:name/:timer',
            name: 'MaterialFormulaSetup',
            meta: {
              title: '物料公式设置',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/BasicSetup/MaterialType/MaterialFormulaSetupPage.vue'),
          },
          {
            path: '/MaterialElementSet/:id/:name',
            name: 'MaterialElementSet',
            meta: {
              title: '物料类型 - 设置元素',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/BasicSetup/MaterialType/MaterialElementSetPage.vue'),
          },
        ],
      },
      { // 物料列表
        path: '/material',
        name: 'material',
        meta: {
          title: '物料列表',
          icon: 'el-icon-document-copy',
          pageName: 'MaterialListRootPage',
          requiresAuth: true,
        },
        component: () => import('../views/BasicSetup/MaterialList/MaterialListRootPage.vue'),
        redirect: '/MaterialList',
        children: [
          {
            path: '/MaterialList',
            name: 'MaterialList',
            meta: {
              title: '物料列表',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/BasicSetup/MaterialList/MaterialListPage.vue'),
          },
          {
            path: '/MaterialMassProduction/:type',
            name: 'MaterialMassProduction',
            meta: {
              title: '物料批量生成',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/BasicSetup/MaterialList/MaterialMassProductionPage.vue'),
          },
        ],
      },
    ],
  },
  { // 基本设置
    path: '/basicSet',
    component: CommonNullView,
    meta: {
      title: '基本设置',
      requiresAuth: true,
      icon: 'el-icon-s-tools',
    },
    children: [
      { // 定金设置
        path: '/deposit',
        name: 'deposit',
        meta: {
          title: '定金设置',
          icon: 'el-icon-news',
          pageName: 'DepositPage',
          requiresAuth: true,
        },
        redirect: '/depositList',
        component: () => import('../views/DepositPage/DepositPage.vue'),
        children: [
          {
            path: '/depositList',
            name: 'depositList',
            meta: {
              title: '定金设置',
              requiresAuth: true,
              PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/DepositPage/DepositListPage.vue'),
          },
          {
            path: '/depositSettingsAdd/:type',
            name: 'depositSettingsAdd',
            meta: {
              title: '添加编辑定金设置',
              requiresAuth: true,
              PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/DepositPage/DepositSettingsAddPage.vue'),
          },
        ],
      },
      { // 物流费用
        path: '/ExpressManage',
        name: 'ExpressManage',
        meta: {
          title: '物流费用',
          requiresAuth: true,
          pageName: 'ExpressRootViewPage',
          icon: 'el-icon-connection',
        },
        redirect: '/ExpressList',
        component: () => import('../views/ExpressManage/RootViewPage.vue'),
        children: [
          {
            path: '/ExpressList',
            name: 'ExpressList',
            meta: {
              title: '物流费用管理列表',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ExpressManage/ExpressManageListPage.vue'),
          },
          {
            path: '/ExpressPriceSettingList/:id',
            name: 'ExpressPriceSettingList',
            meta: {
              title: '物流管理价格设置列表',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ExpressManage/ExpressPriceSettingListPage.vue'),
          },
          {
            path: '/ExpressPriceAddEdit/:type',
            name: 'ExpressPriceAddEdit',
            meta: {
              title: '物流价格添加与编辑',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/ExpressManage/ExpressPriceAddEditPage.vue'),
          },
        ],
      },
      { // 印刷幅面
        path: '/printFormat',
        name: 'printFormat',
        meta: {
          title: '印刷幅面',
          icon: 'el-icon-wallet',
          pageName: 'PrintFormatRootPage',
          requiresAuth: true,
        },
        component: () => import('../views/BasicSetup/PrintFormat/PrintFormatRootPage.vue'),
        redirect: '/PrintFormatList',
        children: [
          {
            path: '/PrintFormatList',
            name: 'PrintFormatList',
            meta: {
              title: '印刷幅面',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/BasicSetup/PrintFormat/PrintFormatListPage.vue'),
          },
          {
            path: '/PrintFormatClassManage',
            name: 'PrintFormatClassManage',
            meta: {
              title: '印刷幅面分类管理',
              requiresAuth: true,
              // PermissionInfo: ['PermissionSetupDeposit', 'HavePomission'],
            },
            component: () => import('../views/BasicSetup/PrintFormat/PrintFormatClassManagePage.vue'),
          },
        ],
      },
      { // 元素模板
        path: '/elementTemplate',
        name: 'elementTemplate',
        meta: {
          title: '元素模板',
          icon: 'el-icon-copy-document',
          pageName: 'ElementTemplatePage',
          requiresAuth: true,
        },
        component: () => import('../views/BasicSetup/ElementTemplatePage.vue'),
      },
      { // 文件类目
        path: '/fileListSet',
        name: 'fileListSet',
        meta: {
          title: '文件类目',
          icon: 'el-icon-files',
          pageName: 'FileSetupPage',
          requiresAuth: true,
        },
        component: () => import('../views/BasicSetup/FileSetupView.vue'),
      },
      { // 生产工厂
        path: '/factoryManag',
        name: 'factoryManage',
        meta: {
          title: '生产工厂',
          icon: 'el-icon-school',
          pageName: 'FactoryManagePage',
          requiresAuth: true,
        },
        component: () => import('../views/BasicSetup/FactoryManagePage.vue'),
      },
    ],
  },
  {
    path: '/notauth',
    name: 'notauth',
    meta: {
      title: '没有访问权限',
      hideMenu: true,
    },
    component: () => import('../views/NoAuthPage.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});


router.beforeEach((to, from, next) => { // 使用全局路由导航守卫进行权限控制
  if (to.meta.title) { // 1. 根据路由元信息中title信息设置页面标题
    document.title = to.meta.title;
  }
  const token = JSON.parse(sessionStorage.getItem('token')); // 2.1 获取到token信息，可能为undefined
  if (to.matched.some(record => record.meta.requiresAuth)) { // 2.2 判断要去往的页面中有无token要求，如果无则跳转否则则进入判断
    if (to.name === 'login') { // 2.3 登录页面不考虑，直接跳转
      next();
    } else if (token) { // 2.4 如果有token信息，获取到当前用户权限信息
      const permission = store.state.common.Permission;
      if (!permission || permission.Token !== token) {
        // console.log('setPermission');
        getPermission(token).then(res => {
          if (Object.prototype.toString.call(res) === '[object Object]' && res.Token && res.Token === token) {
            store.commit('common/setPermission', res);
            handlePermission(to, next, res.PermissionList);
          }
        });
      } else if (permission.Token === token) {
        handlePermission(to, next, permission.PermissionList);
      }
    } else { // 如果没有token，跳转登录或提示页面
      next({
        path: '/notauth', // 此处应当跳转登录页面
        // query: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
