
import Vue from 'vue';
import VueRouter from 'vue-router';
import routeConfig from './routes';

import handleRouterEach from './handleRouterEach';


export const { routes } = routeConfig;

Vue.use(VueRouter);


/**
 * 可根据路由信息自动生成左侧导航按钮，只支持2级目录(大分类模块下小页面模块)，页面模块中可设置多个children，允许在页面内进行多页面跳转,但只会根据第一个children[0]值生成对应导航按钮
 * 页面间跳转 返回时禁用go(-1)跳转  应使用replace或push等方式 不然会导致页面间跳转错乱
 */
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

handleRouterEach(router);


export default router;
