import CommonNullView from '@/components/common/Layout/CommonNullView.vue';

const routes = { // 跟踪报价
  path: '/TraceGetPriceManage',
  component: CommonNullView,
  meta: {
    title: '跟踪报价',
    requiresAuth: true,
    icon: 'el-icon-s-order',
  },
  children: [
    {
      path: '/GetPriceRecord',
      name: 'GetPriceRecord',
      meta: {
        title: '报价记录',
        icon: 'el-icon-edit-outline el-icon',
        pageName: 'GetPriceRecordListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'Obj', 'QueryAll'],
      },
      component: () => import('../../../views/GetPriceRecord/index.vue'),
    },
    {
      path: '/GetPriceRecordDetail',
      name: 'GetPriceRecordDetail',
      meta: {
        title: '报价记录',
        pageName: 'GetPriceRecordDetailPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'HavePomission'],
      },
      component: () => import('../../../views/GetPriceRecord/detail.vue'),
    },
    {
      path: '/TraceClientList',
      name: 'TraceClientList',
      meta: {
        title: '追踪客户列表',
        icon: 'icon-zhuizongkehuliebiao iconfont',
        pageName: 'TraceClientListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'Obj', 'QueryTrack'],
      },
      component: () => import('../../../views/TraceClientList/index.vue'),
    },
    {
      path: '/TraceClientListDetail',
      name: 'TraceClientListDetail',
      meta: {
        title: '报价记录',
        pageName: 'TraceClientListDetailPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'HavePomission'],
      },
      component: () => import('../../../views/TraceClientList/detail.vue'),
    },
    {
      path: '/CommunicationRecord',
      name: 'CommunicationRecord',
      meta: {
        title: '沟通记录',
        icon: 'icon-goutongjilu iconfont',
        pageName: 'CommunicationRecordPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'Obj', 'QueryCommunicateLog'],
      },
      component: () => import('../../../views/CommunicationRecord/index.vue'),
    },
    {
      path: '/CommunicationRecordDetail',
      name: 'CommunicationRecordDetail',
      meta: {
        title: '报价记录',
        pageName: 'CommunicationRecordDetailPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'HavePomission'],
      },
      component: () => import('../../../views/CommunicationRecord/detail.vue'),
    },
    {
      path: '/TraceRecord',
      name: 'TraceRecord',
      meta: {
        title: '追踪记录',
        icon: 'icon-zhuizongjilu iconfont',
        pageName: 'TraceRecordPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'Obj', 'QueryTrackLog'],
      },
      component: () => import('../../../views/TraceRecord/index.vue'),
    },
    {
      path: '/TraceRecordDetail',
      name: 'TraceRecordDetail',
      meta: {
        title: '报价记录',
        pageName: 'TraceRecordDetailPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionCalculateRecord', 'HavePomission'],
      },
      component: () => import('../../../views/TraceRecord/detail.vue'),
    },
  ],
};

const routeTree = {
  name: 'customeOrderManage',
  isModuleRoot: true,
  children: [
    { name: 'GetPriceRecord',
      children: [
        { name: 'GetPriceRecordDetail', children: [] },
      ] },
    { name: 'TraceClientList',
      children: [
        { name: 'TraceClientListDetail', children: [] },
      ] },
    { name: 'CommunicationRecord',
      children: [
        { name: 'CommunicationRecordDetail', children: [] },
      ] },
    { name: 'TraceRecord',
      children: [
        { name: 'TraceRecordDetail', children: [] },
      ] },
  ],
};

export default {
  routes,
  routeTree,
};
