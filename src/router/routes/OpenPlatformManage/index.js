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
      path: '/docManage',
      name: 'docManage',
      meta: {
        title: '帮助文档管理',
        icon: 'el-icon-s-data',
        pageName: 'DocManagePage',
        // PermissionInfo: ['PermissionCheckFileStastics', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/OpenPlatform/DocManage/DocManagePage.vue'),
    },
    /*  消息管理
    ------------------------------------------ */
    {
      path: '/noticeManage',
      name: 'noticeManage',
      meta: {
        title: '消息管理',
        icon: 'el-icon-s-data',
        pageName: 'NoticeManagePage',
        // PermissionInfo: ['PermissionCheckFileStastics', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/OpenPlatform/NoticeManage/NoticeManagePage.vue'),
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
  ],
};

export default {
  routes,
  routeTree,
};
