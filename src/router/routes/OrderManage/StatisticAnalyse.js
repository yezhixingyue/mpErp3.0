const routes = [
  {
    path: '/StatisticalList',
    name: 'StatisticalList',
    meta: {
      title: '统计分析',
      icon: 'iconfont icon-tongjifenxi',
      pageName: 'StatisticAnalyseListPage',
      requiresAuth: true,
      scroll: 0,
    },
    component: () => import('../../../views/StatisticAnalysePages/StatisticalListPage.vue'),
  },
  {
    path: '/StatisticalSummary',
    name: 'StatisticalSummary',
    meta: {
      title: '汇总面板',
      requiresAuth: true,
      needFetch: true,
      pageName: 'StatisticalSummaryPage',
    },
    component: () => import('../../../views/StatisticAnalysePages/StatisticalSummaryPage.vue'),
  },
  {
    path: '/StatisticalFormSetting/:type',
    name: 'StatisticalFormSetting',
    meta: {
      title: '配置统计表',
      requiresAuth: true,
      pageName: 'StatisticalFormAddEditPage',
    },
    component: () => import('../../../views/StatisticAnalysePages/StatisticalFormAddEditPage.vue'),
  },
  {
    path: '/StatisticalSummarySetting/:type',
    name: 'StatisticalSummarySetting',
    meta: {
      title: '配置汇总面板',
      requiresAuth: true,
      pageName: 'StatisticalSummaryAddEditPage',
    },
    component: () => import('../../../views/StatisticAnalysePages/StatisticalSummaryAddEditPage.vue'),
  },
  {
    path: '/StatisticFormView/:id',
    name: 'StatisticFormView',
    meta: {
      title: '查看统计表',
      requiresAuth: true,
      pageName: 'StatisticFormViewPage',
    },
    component: () => import('../../../views/StatisticAnalysePages/StatisticFormViewPage.vue'),
  },
  {
    path: '/StatisticSummaryView/:id',
    name: 'StatisticSummaryView',
    meta: {
      title: '查看汇总面板',
      requiresAuth: true,
      pageName: 'StatisticSummaryViewPage',
    },
    component: () => import('../../../views/StatisticAnalysePages/StatisticSummaryViewPage.vue'),
  },
];

const routeTree = [{
  name: 'StatisticalList',
  children: [
    { name: 'StatisticalFormSetting', children: [] },
    { name: 'StatisticFormView', children: [] },
  ],
},
{
  name: 'StatisticalSummary',
  children: [
    { name: 'StatisticalSummarySetting', children: [] },
    { name: 'StatisticSummaryView', children: [] },
  ],
}];

export default {
  routes,
  routeTree,
};
