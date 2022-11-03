import Home from '@/views/Home.vue';
import { RouteConfig } from 'vue-router';
import { IRouteTree } from '../types/types';
import transformerRoutes from './transformer';
import serverManageRoutes from './serverManage';
import companyManageRoutes from './companyManage';

const routes: Array<RouteConfig> = [
  { // 首页
    path: '/',
    meta: {
      title: '首页',
      requiresAuth: true,
      hideMenu: false,
      icon: 'el-icon-s-platform',
      // PermissionInfo: [],
    },
    name: 'home',
    component: Home,
  },
  { // 登录页面
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      requiresAuth: false,
      hideMenu: true,
    },
    component: () => import(/* webpackChunkName: "LoginPage" */ '@/views/LoginPage.vue'),
  },
  transformerRoutes.routes,
  serverManageRoutes.routes,
  companyManageRoutes.routes,
  { // 无权限页
    path: '/notauth',
    name: 'notauth',
    meta: {
      title: '没有访问权限',
      hideMenu: true,
      requiresAuth: true,
    },
    component: () => import('../../views/NoAuthPage.vue'),
  },
];

/**
 * 1. meta中带有icon的路由信息会被渲染至左侧的导航列表区域
 * 2.
 */

const routeTree: IRouteTree[] = [
  transformerRoutes.routeTree,
  serverManageRoutes.routeTree,
  companyManageRoutes.routeTree,
];

export default {
  routes,
  routeTree,
};
