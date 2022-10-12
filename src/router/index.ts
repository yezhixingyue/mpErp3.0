import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      name: '首页',
    },
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue'),
  },
  {
    path: '/test',
    name: 'test',
    meta: {
      name: '测试页面',
    },
    component: () => import(/* webpackChunkName: "Test" */ '@/views/Test.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      name: '登录页面',
    },
    component: () => import(/* webpackChunkName: "LoginPage" */ '@/views/LoginPage.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
