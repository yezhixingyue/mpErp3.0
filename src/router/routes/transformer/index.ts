import CommonNullView from '@/components/Layout/CommonNullView.vue';

const routes = { // 基本设置
  path: '/transformer',
  component: CommonNullView,
  name: 'transformer',
  meta: {
    title: '信息转换',
    requiresAuth: true,
    icon: 'el-icon-s-help',
  },
  children: [
    /*  转换设置
    ------------------------------------------ */
    {
      path: '/transformerList',
      name: 'transformerList',
      meta: {
        title: '转换设置',
        icon: 'el-icon-s-help',
        pageName: 'TransformerListPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/transformer/TransformerListPage.vue'),
    },
    {
      path: '/mapAssist',
      name: 'mapAssist',
      meta: {
        title: '辅助文件映射',
        hideMenu: true,
        pageName: 'assistMapPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/transformer/assistTypeSetupPages/assistInfoMap/assistMapPage.vue'),
    },
    {
      path: '/mapColor',
      name: 'mapColor',
      meta: {
        title: '专色文件映射',
        hideMenu: true,
        pageName: 'colorInfoMapPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/transformer/assistTypeSetupPages/colorInfoMap/colorInfoMapPage.vue'),
    },
    {
      path: '/mapMakeup',
      name: 'mapMakeup',
      meta: {
        title: '拼版文件映射',
        hideMenu: true,
        pageName: 'MakeupInfoMapPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/transformer/assistTypeSetupPages/makeupInfoMap/MakeupInfoMapPage.vue'),
    },
    {
      path: '/mapMaterial',
      name: 'mapMaterial',
      meta: {
        title: '物料映射',
        hideMenu: true,
        pageName: 'MaterialInfoMapPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/transformer/assistTypeSetupPages/materialMap/MaterialInfoMapPage.vue'),
    },
    {
      path: '/mapWords',
      name: 'mapWords',
      meta: {
        title: '文字信息映射',
        hideMenu: true,
        pageName: 'WordsInfoMapPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/transformer/assistTypeSetupPages/wordsInfoMap/WordsInfoMapPage.vue'),
    },
    {
      path: '/mapWorkTimes',
      name: 'mapWorkTimes',
      meta: {
        title: '作业次数',
        hideMenu: true,
        pageName: 'WorkTimesMapPage',
        // PermissionInfo: ['PermissionManageStaffBase', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('@/views/transformer/assistTypeSetupPages/workTimesMap/WorkTimesMapPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'transformer',
  isModuleRoot: true,
  children: [
    /*  转换设置
    ------------------------------------------ */
    {
      name: 'transformerList',
      children: [
        { name: 'mapAssist', children: [] },
        { name: 'mapColor', children: [] },
        { name: 'mapMakeup', children: [] },
        { name: 'mapMaterial', children: [] },
        { name: 'mapWords', children: [] },
        { name: 'mapWorkTimes', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
