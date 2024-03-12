import CommonNullView from '@/components/common/Layout/CommonNullView.vue';

const routes = { // 审稿
  name: 'openPlatform',
  path: '/openPlatform',
  component: CommonNullView,
  meta: {
    title: '开放平台管理',
    requiresAuth: true,
    icon: 'el-icon-news',
  },
  children: [
    /*  文档编辑
    ------------------------------------------ */
    {
      path: '/developerList',
      name: 'developerList',
      meta: {
        title: '开发者账号',
        icon: 'icon-kaifazhezhanghao iconfont',
        pageName: 'DeveloperListManagePage',
        // PermissionInfo: ['PermissionCheckFileStastics', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/OpenPlatform/DeveloperListManage/DeveloperListManagePage.vue'),
    },
    /*  消息管理
    ------------------------------------------ */
    {
      path: '/noticeManage',
      name: 'noticeManage',
      meta: {
        title: '消息管理',
        icon: 'icon-xiaoxiguanli iconfont',
        pageName: 'NoticeManagePage',
        // PermissionInfo: ['PermissionCheckFileStastics', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/OpenPlatform/NoticeManage/NoticeManagePage.vue'),
    },
    /*  文档编辑
    ------------------------------------------ */
    {
      path: '/docManage',
      name: 'docManage',
      meta: {
        title: '帮助文档管理',
        icon: 'icon-bangzhuwendangguanli iconfont',
        pageName: 'DocManagePage',
        // PermissionInfo: ['PermissionCheckFileStastics', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/OpenPlatform/DocManage/DocManagePage.vue'),
    },
    /*  应用列表
    ------------------------------------------ */
    {
      path: '/appList',
      name: 'appList',
      meta: {
        title: '应用列表',
        icon: 'icon-yingyongliebiao iconfont',
        pageName: 'AppListManagePage',
        // PermissionInfo: ['PermissionCheckFileStastics', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/OpenPlatform/AppList/AppListManagePage.vue'),
    },
  ],
};

const routeTree = {
  name: 'openPlatform',
  isModuleRoot: true,
  children: [
    /*  文档编辑
    ------------------------------------------ */
    {
      name: 'docManage',
      children: [],
    },
    {
      name: 'developerList',
      children: [],
    },
    {
      name: 'noticeManage',
      children: [],
    },
    {
      name: 'appList',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
