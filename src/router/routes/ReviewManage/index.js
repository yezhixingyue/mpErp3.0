import CommonNullView from '@/components/common/Layout/CommonNullView.vue';
import reviewSetupRoutes from './reviewSetupRoutes';

const routes = { // 审稿
  name: 'reviewManage',
  path: '/reviewManage',
  component: CommonNullView,
  meta: {
    title: '审稿管理',
    requiresAuth: true,
    icon: 'el-icon-news',
  },
  children: [
    /*  审稿设置
    ------------------------------------------ */
    ...reviewSetupRoutes.routes,
    /*  分配策略
    ------------------------------------------ */
    {
      path: '/reviewAllocation',
      name: 'reviewAllocation',
      meta: {
        title: '分配策略',
        icon: 'el-icon-pear',
        pageName: 'reviewAllocationListPage',
        PermissionInfo: ['PermissionCheckFileStrategy', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/ReviewManage/reviewAllocation/reviewAllocationListPage.vue'),
    },
    {
      path: '/reviewAllocationSetup',
      name: 'reviewAllocationSetup',
      meta: {
        title: '设置分配策略',
        pageName: 'reviewAllocationSetupPage',
        PermissionInfo: ['PermissionCheckFileStrategy', 'Obj', 'Setup'],
        requiresAuth: true,
      },
      component: () => import('../../../views/ReviewManage/reviewAllocation/reviewAllocationSetupPage.vue'),
    },
    /*  人员分组
    ------------------------------------------ */
    {
      path: '/reviewGroupManage',
      name: 'reviewGroupManage',
      meta: {
        title: '人员分组',
        icon: 'el-icon-picture-outline-round',
        pageName: 'reviewGroupManagePage',
        PermissionInfo: ['PermissionCheckFileMemberGroup', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/ReviewManage/reviewGroup/reviewGroupManagePage.vue'),
    },
    {
      path: '/ForceExitRecord',
      name: 'ForceExitRecord',
      meta: {
        title: '强退人员名单',
        pageName: 'ForceExitRecordListPage',
        PermissionInfo: ['PermissionCheckFileMemberGroup', 'Obj', 'QueryForcedExit'],
        requiresAuth: true,
      },
      component: () => import('../../../views/ReviewManage/reviewGroup/ForceExitRecordListPage.vue'),
    },
    {
      path: '/reviewGroupMembers/:id',
      name: 'reviewGroupMembers',
      meta: {
        title: '分组成员',
        pageName: 'reviewGroupMembersManagePage',
        PermissionInfo: ['PermissionCheckFileMemberGroup', 'Obj', 'QueryMember'],
        requiresAuth: true,
      },
      component: () => import('../../../views/ReviewManage/reviewGroup/reviewGroupMembersManagePage.vue'),
    },
    /*  审稿统计
    ------------------------------------------ */
    {
      path: '/reviewStatistics',
      name: 'reviewStatistics',
      meta: {
        title: '审稿统计',
        icon: 'el-icon-s-data',
        pageName: 'reviewStatisticsPage',
        PermissionInfo: ['PermissionCheckFileStastics', 'HavePomission'],
        requiresAuth: true,
      },
      component: () => import('../../../views/ReviewManage/reviewStatistics/reviewStatisticsPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'reviewManage',
  isModuleRoot: true,
  children: [
    /*  审稿设置
    ------------------------------------------ */
    reviewSetupRoutes.routeTree,
    /*  分配策略
    ------------------------------------------ */
    {
      name: 'reviewAllocation',
      children: [
        { name: 'reviewAllocationSetup', children: [] },
      ],
    },
    /*  人员分组
    ------------------------------------------ */
    {
      name: 'reviewGroupManage',
      children: [
        { name: 'ForceExitRecord', children: [] },
        { name: 'reviewGroupMembers', children: [] },
      ],
    },
    /*  审稿统计
    ------------------------------------------ */
    {
      name: 'reviewStatistics',
      children: [],
    },
  ],
};

export default {
  routes,
  routeTree,
};
