<template>
  <div class="mp-erp-layout-left-menu-comp-wrap" :class="isCollapse ? 'collapsed':'unfold'">
    <div class="logo-box" @click="onMenuItemClick(homeRouteInfo, '0')">
      <img src="@/assets/images/logo.png" alt="" class="broad">
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="defaultActive" :default-openeds='defaultOpeneds' background-color="#222B3A" :collapse="isCollapse"
        :collapse-transition='true' text-color="#fff" class="el-menu-vertical-demo" active-text-color="#26bcf9">
        <el-submenu v-for="(routeWrap, index) in menuList" :key="routeWrap.path" :index='`${index + 1}`'>
          <template slot="title">
            <i :class="routeWrap.meta.icon" class="title-icon" v-show="isCollapse"></i>
            <span slot="title">{{routeWrap.meta.title}}</span>
          </template>
          <el-menu-item :index="`${index + 1}-${i + 1}`" @click="onMenuItemClick(route, `${index + 1}-${i + 1}`)"
            v-for="(route, i) in routeWrap.children" :key="route.path">
            <i v-if="route.meta" :class="route.meta.icon"></i>
            <span v-if="route.meta" slot="title">{{route.meta.title}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <p @click="handleClick" class="login-out-box" :class="isCollapse?'hiden':'show'" v-show="showLoginout">
        <template v-if="!isCollapse">
          <i class="el-icon-switch-button not-c"></i>
          <span>退出登录</span>
        </template>
        <TipsSpanButton tipContent='退出登录' v-else><i class="el-icon-switch-button"></i></TipsSpanButton>
      </p>
    </el-scrollbar>
  </div>
</template>

<script>
import { routes } from '@/router';
import { getJudgmentWhetherIsSamePage, modulePageNames, getChildrenRouteNamesByParentRouteName } from '@/router/getLastRouteInfoByName';
import { mapState } from 'vuex';
import TipsSpanButton from '../NewComps/TipsSpanButton.vue';

export default {
  components: {
    TipsSpanButton,
  },
  computed: {
    ...mapState('layout', ['editableTabs', 'leftMenuDefaultActive', 'isLeftCollapse', 'editableTabsValue']),
    ...mapState('common', ['Permission']),
    curRoute() {
      return this.$route;
    },
    defaultActive: {
      get() {
        return this.leftMenuDefaultActive;
      },
      set(val) {
        this.$store.commit('layout/setLeftMenuDefaultActive', val);
      },
    },
  },
  data() {
    return {
      menuList: [],
      defaultOpeneds: [], // 默认打开的一级分类目录
      homeRouteInfo: { // 用于logo点击使用
        meta: {
          title: '首页',
        },
        path: '/',
      },
      isCollapse: false,
      showLoginout: true,
    };
  },
  methods: {
    handleClick() { // 退出
      this.messageBox.warnCancelNullMsg('确定退出登录吗?', () => {
        sessionStorage.removeItem('ErpToken');
        this.$router.replace('/login');
      });
    },
    getShowMenuList() { // 初始化获取左侧按钮列表
      if (!routes || routes.length === 0 || !this.Permission) return;
      const list = routes.filter(it => (!it.meta || !it.meta.hideMenu) && (it.meta && it.meta.icon)).map(_it => {
        if (!Array.isArray(_it.children)) return _it;
        return {
          ..._it,
          children: _it.children.filter(child => child.meta && child.meta.icon && this.getIsMatchPermission(child)), // 此处筛选权限
        };
      });
      this.menuList = list;
      this.defaultOpeneds = list.map((it, i) => `${i + 1}`);
    },
    getIsMatchPermission(route) { // 判断是否符合权限
      if (!route.meta.requiresAuth || !route.meta.PermissionInfo || route.meta.PermissionInfo.length === 0) return true;
      let key = this.Permission.PermissionList;
      try {
        route.meta.PermissionInfo.forEach(item => { // 2.5 获取到当前页面所需要的权限信息，看是否满足权限要求
          key = key[item];
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development' && route.meta.PermissionInfo[0] === 'Developing') {
          key = true;
        } else {
          key = false;
        }
      }
      return key === true;
    },
    onMenuItemClick(route, index) { // 点击左侧导航栏按钮事件：1 跳转路由 2 动态改变头部按钮列表
      if (index) this.defaultActive = index;
      let _path = route.redirect || route.path; // 此处报错
      const targetTab = this.editableTabs.find(it => it.name === index);
      if (targetTab) { // 处理页面路径变化后的情况
        _path = targetTab.path;
      }
      const t = this.editableTabs.find(it => it.path === _path);
      if (t) {
        this.$store.commit('layout/setEditableTabsValue', t.name);
      } else {
        const name = index;
        const item = {
          title: route.meta.title,
          name,
          path: _path,
          closable: true,
          isNew: true,
          pageName: route.meta.pageName,
        };
        this.$store.commit('layout/addTabItem', item);
      }
      this.$router.push(_path);
    },
    getNormalActiveResult(route) { // 除去首页或matched.length = 1的除外  获取到该路径的activeName值和对应的路由信息(筛选处理过后)
      const { matched } = route;
      if (matched.length >= 2) {
        const m1 = matched[0];
        const index1 = this.menuList.findIndex(it => it.path === m1.path);
        if (!index1 && index1 !== 0) return null;
        const m2 = matched[1];
        const index2 = this.menuList[index1].children.findIndex(it => it.path === m2.path);
        if (!index2 && index2 !== 0) return null;
        return {
          activeName: `${index1 + 1}-${index2 + 1}`,
          targetRoute: this.menuList[index1].children[index2],
        };
      }
      return null;
    },
    setInitMenuDefaultActive(route, bool = false) {
      const { matched } = route;
      if (matched.length >= 2) {
        const result = this.getNormalActiveResult(route);
        if (result) {
          const { activeName, targetRoute } = result;
          this.defaultActive = activeName;
          if (bool) this.onMenuItemClick(targetRoute, activeName);
        }
      } else if (route.path === '/') {
        this.defaultActive = '0';
        if (bool) this.onMenuItemClick(route, this.defaultActive);
      }
    },
  },
  watch: {
    curRoute(newRoute, oldRoute) { // 动态改变活动菜单索引 ----- 只刷新初始化时执行一次
      const bool = getJudgmentWhetherIsSamePage(newRoute, oldRoute);
      if (bool) {
        // 相同最小页面模块内调整
        if (this.defaultActive === this.editableTabsValue) {
          // 修改目标路径名称 newRoute.path   另 借用store中this.editableTabsValue值
          this.$store.commit('layout/changeCurTabPath', newRoute.path);
        }
        if (!modulePageNames.includes(newRoute.name)) {
          this.$store.commit('layout/setOtherTabPageNames', newRoute);
        }
      }
      const names = getChildrenRouteNamesByParentRouteName(newRoute.name);
      if (Array.isArray(names)) {
        this.$store.commit('layout/filterOtherTabPageNames', names);
      }
      if (this.defaultActive || !this.menuList || this.menuList.length === 0) return;
      this.setInitMenuDefaultActive(newRoute, true);
    },
    isLeftCollapse: { // 设置左侧折叠
      handler(newVal) {
        this.showLoginout = false;
        if (!newVal) {
          if (this.$route.path === '/') this.defaultOpeneds = ['1'];
          this.isCollapse = newVal;
          this.showLoginout = true;
        } else {
          this.defaultOpeneds = [];
          setTimeout(() => {
            this.isCollapse = newVal;
          }, 300);
          setTimeout(() => {
            this.showLoginout = true;
          }, 700);
        }
      },
      immediate: true,
    },
    Permission(val) {
      if (val) this.getShowMenuList();
    },
  },
  mounted() {
    this.getShowMenuList();
  },
};
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
      line-height: 47px;
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
      margin: 20px 0;
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
      .el-submenu .el-menu-item {
        width: 100%;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        min-width: unset;
        background-color: rgb(15, 29, 53);
        transition: 0.05s ease-in-out;
        user-select: none;
        // display: flex;
        // align-items: center;
        > i {
          margin-right: 6px;
          margin-top: -2px;
          &.iconfont {
            font-size: 15px;
            margin-left: 4px;
            margin-right: 10px;
            // position: relative;
            // top: 1px;
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
      height: 40px;
      line-height: 36px;
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
        // > i {
        //   color: rgb(38, 188, 249);
        // }
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
</style>
