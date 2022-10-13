import Vue, { nextTick } from 'vue';
import VueRouter, { NavigationGuardNext, RawLocation, Route } from 'vue-router';
import { IPermissionList, IUser } from '@/store/modules/user/types';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { message } from '@/assets/js/message';
import { useUserStore } from '@/store/modules/user';
import { useRouteRecordStore } from '@/store/modules/routeRecord';
import { getLocalStorageUser, tokenHandler } from '../api/utils/handleToken/tokenHandler';
import { getLastRouteInfoByName } from './getLastRouteInfoByName';

/*  页面进度条
------------------------------------------ */
NProgress.configure({
  trickleSpeed: 50,
  showSpinner: false,
});

/*  处理跳转报错
------------------------------------------ */
const routerPush: (to: RawLocation) => Promise<Route> = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return routerPush.call(this, location).catch((error: any) => error);
};

/**
 * @description: 主要作用为在页面跳转时向vuex中加入跳转前的历史记录
 * @param {*}
 * @return {*}
 */
const NextHandler = (from: Route, to: Route, next: NavigationGuardNext) => {
  try {
    const routeRecordStore = useRouteRecordStore();
    routeRecordStore.setLastPagePaths(from);
  } catch (err) {
    // console.log(err);
  } finally {
    next();
  }
};

/**
 * @description: 记录是否为首次初始化运行
 */
let isInit = true;

/**
  * 处理权限验证信息，在forEach中使用
  *
  * @param {*} to
  * @param {*} next
  * @param {*} Permission 权限信息列表
  */
function handlePermission(to: Route, next: NavigationGuardNext, Permission: IPermissionList, from: Route) {
  let key = !!Permission;
  if (!to.meta?.PermissionInfo) { // 如果没有设定则予以通过
    key = true;
  } else {
    try {
      if (process.env.NODE_ENV === 'development' && to.meta.PermissionInfo && to.meta.PermissionInfo[0] && to.meta.PermissionInfo[0] === 'Developing') {
        key = true;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let temp: any = Permission;
        to.meta.PermissionInfo.forEach(item => { // 2.5 获取到当前页面所需要的权限信息，看是否满足权限要求
          temp = temp[item];
        });
        if (typeof temp === 'boolean') {
          key = temp;
        }
      }
    } catch (error) {
      message.error({ title: '[ 权限信息读取失败 ]' });
    }
  }
  if (key) {
    if (isInit) { // 初始根页面跳转
      if (to.matched.length >= 2) {
        if (to.name) {
          const t = getLastRouteInfoByName(to.name, 'root');
          if (t && typeof t === 'string') next({ name: t });
        }
      }
      isInit = false;
    }
    if (from.name !== to.name) NProgress.start();
    NextHandler(from, to, next); // 2.6 如果满足权限要求则允许跳转， 否则跳转提示页面
  } else next({ path: '/notauth' });
}

const handleRouterEach = (router: VueRouter) => {
  router.beforeEach((to, from, next) => { // 使用全局路由导航守卫进行权限控制
    if (to.path === '/pathFromClient') {
      const { url, token } = to.query;
      if (url && token && typeof token === 'string' && typeof url === 'string') {
        tokenHandler.setToken(token);
        next({
          path: url,
          query: {},
        });
        return;
      }
    }
    const token = tokenHandler.getToken();
    if (to.matched.some(record => record.meta.requiresAuth)) { // 2.2 判断要去往的页面中有无token要求，如果无则跳转否则则进入判
      if (to.name === 'login') { // 2.3 登录页面不考虑，直接跳转
        if (token) { // 如果有token 不允许跳转
          next({ name: 'home' });
        } else {
          tokenHandler.removeToken();
          NextHandler(from, to, next);
        }
      } else if (token) { // 2.4 如果有token信息，获取到当前用户权限信息
        const user = getLocalStorageUser();
        if (!user || user.Token !== token) {
          tokenHandler.getUserInfo<IUser>(token).then((res) => {
            if (res && !(res instanceof Error) && Object.prototype.toString.call(res) === '[object Object]' && res.Token && res.Token === token) {
              const userStore = useUserStore();
              userStore.setUser(res);
              handlePermission(to, next, res.PermissionList, from);
            }
          });
        } else if (user.Token === token) {
          handlePermission(to, next, user.PermissionList, from);
          nextTick(() => {
            const userStore = useUserStore();
            if (!userStore.user || userStore.user.Token !== token) {
              userStore.setUser(user);
            }
          });
        } else {
          tokenHandler.removeToken();
          next({
            path: '/login',
          });
        }
      } else { // 如果没有token，跳转登录或提示页面
        tokenHandler.removeToken();
        next({
          path: '/login', // 此处应当跳转登录页面
          // query: { redirect: to.fullPath },
        });
      }
    } else if (to.name === 'login' && token) {
      next({ name: 'home' });
    } else {
      tokenHandler.removeToken();
      NextHandler(from, to, next);
    }
  });

  router.afterEach((to: Route) => {
    if (to.meta?.title) { // 1. 根据路由元信息中title信息设置页面标题
      document.title = `${to.meta.title} - 名片之家转换器`;
    }
    NProgress.done();
  });

  /**
   * @description:  用于替代系统回退的方法
   * @param {*}
   * @return {*}
   */
  const goBackLastPage = () => {
    if (!router || !router.currentRoute) return;
    const curRouteName = router.currentRoute.name;
    if (!curRouteName) return;
    // 1 首先找到其上一级的路由name名称
    const lastRouteName = getLastRouteInfoByName(curRouteName);
    if (!lastRouteName) return;
    // 2 然后根据该name名称在lastPaths中从后往前找到其上级name所对应的路径名称
    const routeRecordStore = useRouteRecordStore();

    const lastPaths = routeRecordStore.lastPagePaths;
    if (!Array.isArray(lastPaths)) return;
    const t = lastPaths.find(it => it.name === lastRouteName);
    if (!t) return;

    // 3 完成跳转 并在缓存状态中清除掉刚已跳转离开的页面缓存信息
    router.replace(t.fullPath);
    setTimeout(() => {
      routeRecordStore.setLastPagePathsFilterAfterGoback(curRouteName);
    }, 0);
  };

  /**
   * @description: 阻止并替换浏览器默认回退方法
   * @param {*}
   * @return {*}
   */
  window.addEventListener('popstate', () => {
    let url = '/';
    if (router && router.currentRoute && router.currentRoute.fullPath) {
      url = `#${router.currentRoute.fullPath}`;
    }
    window.history.pushState(null, '', url);
    goBackLastPage();
  });

  Vue.prototype.$goback = goBackLastPage;
};

export default handleRouterEach;
