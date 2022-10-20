<template>
  <div class="mp-erp-layout-left-menu-comp-wrap" :class="isCollapse ? 'collapsed':'unfold'">
    <div class="logo-box" @click="onMenuItemClick(homeRouteInfo, '0')">
      <img src="@/assets/images/logo.png" alt="" class="broad">
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="defaultActive" :default-openeds='defaultOpeneds' background-color="#222B3A" :collapse="isCollapse"
        :collapse-transition='true' text-color="#fff" class="el-menu-vertical-demo" active-text-color="#26bcf9">
        <el-submenu v-for="(routeWrap, index) in menuList" :key="routeWrap.path" :index='`${index + 1}`'
          v-show="routeWrap.children &&routeWrap.children.length > 0">
          <template slot="title">
            <i :class="routeWrap.meta?.icon" class="title-icon" v-show="isCollapse"></i>
            <span slot="title">{{routeWrap.meta?.title}}</span>
          </template>
          <el-menu-item
           :index="`${index + 1}-${i + 1}`"
           @click="onMenuItemClick(route, `${index + 1}-${i + 1}`)"
            v-for="(route, i) in routeWrap.children"
           :key="route.path"
           :class="{hidden: route.meta?.hideMenu}">
            <i v-if="route.meta" :class="route.meta.icon"></i>
            <span v-if="route.meta" slot="title">{{route.meta.title}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue';
import router, { routes } from '@/router';
import { storeToRefs } from 'pinia';
import { RawLocation, Route, RouteConfig } from 'vue-router';
import { useLayoutStore } from '@/store/modules/layout';
import { useUserStore } from '@/store/modules/user';
import { getJudgmentWhetherIsSamePage, modulePageNames, getChildrenRouteNamesByParentRouteName } from '@/router/getLastRouteInfoByName';

const layoutStore = useLayoutStore();
const userStore = useUserStore();

const userDetail = computed(() => userStore.user);

const {
  editableTabs, leftMenuDefaultActive, isLeftCollapse, editableTabsValue,
} = storeToRefs(layoutStore);

const defaultActive = computed({
  get() {
    return leftMenuDefaultActive.value;
  },
  set(val) {
    layoutStore.setLeftMenuDefaultActive(val);
  },
});

const menuList = ref<RouteConfig[]>([]);
const defaultOpeneds = ref<string[]>([]);
const homeRouteInfo: RouteConfig = { // 用于logo点击使用
  meta: {
    title: '首页',
    requiresAuth: true,
  },
  path: '/',
};
const isCollapse = ref(false);
const showLoginout = ref(true);

const getIsMatchPermission = (route: RouteConfig) => { // 判断是否符合权限
  if (!route.meta?.requiresAuth || !route.meta.PermissionInfo || route.meta.PermissionInfo.length === 0 || !userDetail.value) return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let key: any = userDetail.value.PermissionList;
  try {
    if (process.env.NODE_ENV === 'development' && route.meta.PermissionInfo[0] === 'Developing') {
      key = true;
    } else {
      route.meta.PermissionInfo.forEach(item => { // 2.5 获取到当前页面所需要的权限信息，看是否满足权限要求
        key = key[item];
      });
    }
  } catch (error) {
    key = false;
  }
  return key === true;
};

const getShowMenuList = () => { // 初始化获取左侧按钮列表
  if (!routes || routes.length === 0 || !userDetail.value) return;
  const list = routes.filter(it => (!it.meta || !it.meta.hideMenu) && (it.meta && it.meta.icon)).map(_it => {
    if (!Array.isArray(_it.children)) return _it;
    return {
      ..._it,
      children: _it.children.filter(child => child.meta && child.meta.icon && getIsMatchPermission(child)), // 此处筛选权限
    };
  });
  menuList.value = list;
  defaultOpeneds.value = list.map((it, i) => `${i + 1}`);
};

const onMenuItemClick = (route: RouteConfig, index: string) => { // 点击左侧导航栏按钮事件：1 跳转路由 2 动态改变头部按钮列表
  if (index) defaultActive.value = index;
  let _path = route.redirect as RawLocation || route.path; // 此处报错
  const targetTab = editableTabs.value.find(it => it.name === index);
  if (targetTab) { // 处理页面路径变化后的情况
    _path = targetTab.path;
  }
  const t = editableTabs.value.find(it => it.path === _path);
  if (t) {
    layoutStore.setEditableTabsValue(t.name);
  } else {
    const name = index;
    const item = {
      title: route.meta?.title || '未知标题',
      name,
      path: _path,
      closable: true,
      isNew: true,
      pageName: route.meta?.pageName || 'errorPageName',
    };
    layoutStore.addTabItem(item);
  }
  router.push(_path);
};

const getNormalActiveResult = (route: Route) => { // 除去首页或matched.length = 1的除外  获取到该路径的activeName值和对应的路由信息(筛选处理过后)
  const { matched } = route;
  if (matched.length >= 2) {
    const m1 = matched[0];
    const index1 = menuList.value.findIndex(it => it.path === m1.path);
    if (!index1 && index1 !== 0) return null;
    const m2 = matched[1];
    const index2 = menuList.value[index1].children?.findIndex(it => it.path === m2.path);
    if (!index2 && index2 !== 0) return null;
    return {
      activeName: `${index1 + 1}-${index2 + 1}`,
      targetRoute: menuList.value[index1].children?.[index2],
    };
  }
  return null;
};
const setInitMenuDefaultActive = (route: Route, bool = false) => {
  const { matched } = route;
  if (matched.length >= 2) {
    const result = getNormalActiveResult(route);
    if (result) {
      const { activeName, targetRoute } = result;
      defaultActive.value = activeName;
      if (bool && targetRoute) onMenuItemClick(targetRoute, activeName);
    }
  } else if (route.path === '/') {
    defaultActive.value = '0';
    if (bool) onMenuItemClick(route as RouteConfig, defaultActive.value);
  }
};

const handlePathChange = (pathName: string) => {
  let lv1Index;
  let lv2Index;
  let target: RouteConfig | null = null;
  menuList.value.forEach((lv1, index1) => {
    if (target) return;
    lv1.children?.forEach((lv2, index2) => {
      if (target) return;
      if (lv2.name === pathName) {
        lv1Index = index1;
        lv2Index = index2;
        target = lv2;
      }
    });
  });
  if (target && typeof lv1Index === 'number' && typeof lv2Index === 'number') {
    const tempIndex = `${lv1Index + 1}-${lv2Index + 1}`;
    onMenuItemClick(target, tempIndex);
  }
};

defineExpose({
  handlePathChange,
});

const handleRouteChange = (newRoute: Route, oldRoute: Route) => {
  const bool = getJudgmentWhetherIsSamePage(newRoute, oldRoute);
  if (bool) { // 相同最小页面模块内调整
    if (defaultActive.value === editableTabsValue.value) { // 修改目标路径名称 newRoute.path   另 借用store中this.editableTabsValue值
      layoutStore.changeCurTabPath(newRoute.path);
    }
    if (newRoute.name && !modulePageNames.includes(newRoute.name)) {
      layoutStore.setOtherTabPageNames(newRoute);
    }
  }
  const names = newRoute.name ? getChildrenRouteNamesByParentRouteName(newRoute.name) : '';
  if (Array.isArray(names)) {
    layoutStore.filterOtherTabPageNames(names);
  }
  if (defaultActive.value || !menuList.value || menuList.value.length === 0) return;
  setInitMenuDefaultActive(newRoute, true);
};

// const menuInited = ref(false);
router.afterEach((to: Route, from: Route) => {
  // if (!menuInited.value) {
  handleRouteChange(to, from);
  // menuInited.value = true;
  // }
});

watch(() => isLeftCollapse.value, (newVal) => {
  showLoginout.value = false;
  if (!newVal) {
    if (router.currentRoute.path === '/') defaultOpeneds.value = ['1'];
    isCollapse.value = newVal;
    showLoginout.value = true;
  } else {
    defaultOpeneds.value = [];
    setTimeout(() => {
      isCollapse.value = newVal;
    }, 300);
    setTimeout(() => {
      showLoginout.value = true;
    }, 700);
  }
}, { immediate: true });

watch(() => userDetail.value, (val) => {
  if (val) getShowMenuList();
});

onMounted(() => {
  getShowMenuList();
});

</script>

<style lang='scss'>
  .mp-erp-layout-left-menu-comp-wrap{
    width: 186px;
    background-color: rgb(34, 43, 58);
    font-size: 14px;
    flex: none;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    transition: width 0.3s ease-in-out;
    a {
      text-decoration: none;
    }
    > div.logo-box {
      cursor: pointer;
      background-color: rgb(25, 31, 42);
      width: 100%;
      height: 47px;
      box-sizing: border-box;
      text-align: center;
      line-height: 35px;
      padding: 6px;
    }
    .el-menu {
      border: none;
    }
    .el-scrollbar {
      .el-scrollbar__wrap {
        overflow: hidden;
        overflow-y: auto;
        padding-bottom: 30px;
        // width: 100%;
        .el-scrollbar__view {
          max-width: 186px;
        }
      }
    }

    p.login-out-box {
      width: 100%;
      padding: 15px 18px;
      box-sizing: border-box;
      cursor: pointer;
      background-color: rgb(34, 43, 58);
      color: #fff;
      // padding-bottom: 40px;
      // margin: 20px 0;
      margin-top: 20px;
      &:hover {
        background-color: rgb(54, 66, 88);
      }
      &:active {
        background-color: rgb(15, 29, 53);
      }
      display: flex;
      align-items: center;
      // justify-content: center;
      white-space: nowrap;
      > i {
        font-size: 18px;
        margin-right: 5px;
        &.not-c {
          margin-right: 12px;
        }
      }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 100%;
      min-height: 400px;
      min-height: calc(100vh - 120px);
      .el-submenu .el-menu-item {
        width: 100%;
        height: 42px;
        line-height: 42px;
        box-sizing: border-box;
        min-width: unset;
        background-color: rgb(15, 29, 53);
        transition: 0.05s ease-in-out;
        user-select: none;
        > i {
          margin-right: 5px;
          margin-top: -2px;
          &.iconfont {
            font-size: 15px;
            margin-left: 4px;
            margin-right: 10px;
          }
        }
        > i, > span {
          color: #fff;
        }
        &:hover {
          background-color: rgb(38, 188, 249) !important;
          background-color: rgb(14, 23, 39) !important;
          > i, > span {
            color: #fff;
          }
        }
        &.is-active {
          background-color: rgb(14, 23, 39) !important;
          > i, > span {
            color: #fff;
            color: rgb(38, 188, 249) !important;
          }
        }
        &.hidden {
          display: none;
        }
      }
    }
    &:not(.collapsed) {
      .el-submenu__title > i:last-of-type {
        transform: rotateZ(-90deg);
        margin-top: -8px;
      }
    }
    .el-submenu__title {
      background-color: rgb(15, 29, 53) !important;
      height: 42px;
      line-height: 38px;
      user-select: none;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0px;
        background-color: rgb(38, 188, 249);
        transition: width 0.1s ease-in-out;
      }
      &:hover {
        color: rgb(38, 188, 249) !important;
        &::before {
          width: 2px;
        }
        > i.title-icon {
          color: rgb(38, 188, 249) !important;
        }
      }
      > i {
        font-size: 17px;
        color: #fff;
        &.title-icon {
          margin-left: -2px !important;
          transition: color 0.1s ease-in-out;
        }
      }
    }
    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
      transform: rotateZ(0deg);
    }
    .el-menu--collapse {
      width: 55px;
    }
    &.collapsed {
      width: 55px;
    }
    .login-out-box.show{
      animation: hiddenFrames 0.6s ease-in-out;
    }
    @keyframes hiddenFrames {
      from {
        opacity: 1;
      };
      1% {
        opacity: 0;
      };
      99% {
        opacity: 0;
      };
      to {
        opacity: 1;
      }
    }
  }
  .el-menu .el-menu-item > i.el-icon {
    margin-right: 0;
  }
  .el-menu--vertical > .el-menu .el-menu-item > i.el-icon {
    text-align: left;
    margin-left: 5px;
  }
</style>
