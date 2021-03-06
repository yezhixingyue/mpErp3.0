import CommonNullView from '@/components/common/Layout/CommonNullView.vue';

const routes = { // 物料管理
  path: '/materialManageModule',
  component: CommonNullView,
  meta: {
    title: '物料管理',
    requiresAuth: true,
    icon: 'el-icon-s-management',
  },
  children: [
    /*  物料尺寸
    ------------------------------------------ */
    {
      path: '/materialSize',
      name: 'materialSize',
      meta: {
        title: '物料尺寸',
        icon: 'el-icon-notebook-2',
        pageName: 'MaterialSizePage',
        PermissionInfo: ['PermissionMaterialSize', 'Obj', 'Setup'],
        requiresAuth: true,
      },
      component: () => import('../../../views/BasicSetup/MaterialSizePage.vue'),
    },
    /*  物料类型
    ------------------------------------------ */
    {
      path: '/MaterialTypeList',
      name: 'MaterialTypeList',
      meta: {
        title: '物料类型',
        icon: 'el-icon-toilet-paper',
        pageName: 'MaterialTypeListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionMaterialType', 'HavePomission'],
      },
      component: () => import('../../../views/BasicSetup/MaterialType/MaterialTypeListPage.vue'),
    },
    {
      path: '/MaterialFormulaList/:id/:name/:timer',
      name: 'MaterialFormulaList',
      meta: {
        title: '物料公式列表',
        requiresAuth: true,
        pageName: 'MaterialFormulaListPage',
        PermissionInfo: ['PermissionMaterialType', 'Obj', 'Setup'],
      },
      component: () => import('../../../views/BasicSetup/MaterialType/MaterialFormulaListPage.vue'),
    },
    {
      path: '/MaterialFormulaSetup/:id/:name/:timer',
      name: 'MaterialFormulaSetup',
      meta: {
        title: '物料公式设置',
        requiresAuth: true,
        pageName: 'MaterialFormulaSetupPage',
        PermissionInfo: ['PermissionMaterialType', 'Obj', 'Setup'],
      },
      component: () => import('../../../views/BasicSetup/MaterialType/MaterialFormulaSetupPage.vue'),
    },
    {
      path: '/MaterialElementSet/:id/:name',
      name: 'MaterialElementSet',
      meta: {
        title: '物料类型 - 设置元素',
        requiresAuth: true,
        pageName: 'MaterialElementSetPage',
        PermissionInfo: ['PermissionMaterialType', 'Obj', 'Setup'],
      },
      component: () => import('../../../views/BasicSetup/MaterialType/MaterialElementSetPage.vue'),
    },
    /*  物料列表
    ------------------------------------------ */
    {
      path: '/MaterialList',
      name: 'MaterialList',
      meta: {
        title: '物料列表',
        icon: 'el-icon-document-copy',
        pageName: 'MaterialListPage',
        requiresAuth: true,
        PermissionInfo: ['PermissionMaterial', 'HavePomission'],
      },
      component: () => import('../../../views/BasicSetup/MaterialList/MaterialListPage.vue'),
    },
    {
      path: '/MaterialMassProduction/:type',
      name: 'MaterialMassProduction',
      meta: {
        title: '物料批量生成',
        requiresAuth: true,
        pageName: 'MaterialMassProductionPage',
        PermissionInfo: ['PermissionMaterial', 'Obj', 'Setup'],
      },
      component: () => import('../../../views/BasicSetup/MaterialList/MaterialMassProductionPage.vue'),
    },
  ],
};

const routeTree = {
  name: 'materialManageModule',
  isModuleRoot: true,
  children: [
    /*  物料尺寸
    ------------------------------------------ */
    {
      name: 'materialSize',
      children: [],
    },
    /*  物料类型
    ------------------------------------------ */
    {
      name: 'MaterialTypeList',
      children: [
        {
          name: 'MaterialFormulaList',
          children: [
            { name: 'MaterialFormulaSetup', children: [] },
          ],
        },
        { name: 'MaterialElementSet', children: [] },
      ],
    },
    /*  物料列表
    ------------------------------------------ */
    {
      name: 'MaterialList',
      children: [
        { name: 'MaterialMassProduction', children: [] },
      ],
    },
  ],
};

export default {
  routes,
  routeTree,
};
