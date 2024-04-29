<template>
  <header class="mp-erp-layout-header-comp-wrap">
    <div class="list" @contextmenu="onContextmenuclick" ref="oList">
      <!-- <div class="collapse-ctrl-box">
        <i class="el-icon-s-fold" v-if="!isLeftCollapse" @click="onCollapseClick(true)"></i>
        <i class="el-icon-s-unfold" v-else @click="onCollapseClick(false)"></i>
      </div> -->
      <!-- <el-tabs
        v-model="localTabsValue"
        type="border-card"
        @tab-remove="onCloseCurClick"
      >
        <el-tab-pane
          v-for="(item) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.closable"
        >
        </el-tab-pane>
      </el-tabs> -->
      <div class="menus">
        <span
          v-for="(item) in editableTabs.filter(it => it.closable)"
          :key="item.name"
          @click="localTabsValue = item.name"
          :class="{active: localTabsValue === item.name}"
          :style="`width:calc(${item.title.length}em + 55px)`"
          :title="item.title"
          >
          <em>{{ item.title }}</em>
          <i class="close el-icon-close" @click="onCloseCurClick(item.name)"></i>
        </span>
      </div>
      <el-tooltip
        popper-class="mp-common-tip-span-btn-popper-box"
        :open-delay="280"
        :visible-arrow="false"
        transition="none"
        :enterable="false"
        content="关闭所有标签"
        placement="bottom-start"
        v-if="editableTabs.length > 1"
      >
        <div class="clear-box" @click="onCloseAllClick">
          <i class="el-icon-close"></i>
        </div>
      </el-tooltip>
      <ul
        class="mp-erp-layout-header-show-menu-box"
        v-show="showContextMenu"
        :style="`left:${contextMenuLeft}px;top:${contextMenuTop}px`"
      >
        <li @click="() => onCloseCurClick()">关闭</li>
        <li @click="onCloseOtherClick">关闭其它</li>
        <li @click="onCloseAllClick">关闭所有</li>
      </ul>
      <div class="user">
        <!-- <span class="menu ft-12 mr-18" v-if="showFileCheck" @click="handleFileCheck"> <i class="iconfont icon-pindianjiancha ft-16"></i> 检查文件内容</span> -->
        <el-dropdown trigger="click" v-if="Permission && (showBatchUpload || showFileCheck)" @command='onCommand' class="mr-15">
          <span class="el-dropdown-link">
            <i class="iconfont icon-qitafuwu ft-18"></i>
            <span>其他设置</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="mp-erp-user-drop-down-wrap">
            <el-dropdown-item v-if="showFileCheck" command='checkFile'>
              <i class="iconfont icon-pindianjiancha"></i>检查文件内容</el-dropdown-item>
            <el-dropdown-item v-if="showBatchUpload" command='batchUpload'>
              <i class="iconfont icon-shangchuan ft-13 ml-2"></i>批量上传</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" v-if="Permission" @command='onCommand'>
          <el-tooltip placement="bottom-end" popper-class="mp-erp-header-username-tooltip-popper-box">
            <div slot="content" class="mp-erp-header-username-tooltip-content">
              <img :src="Permission.HeadPic" style="width: 100px;height: 140px;object-fit: cover;" alt="">
              <div class="right">
                <div class="position">
                  <p class="mb-2">岗位：</p>
                  <p v-for="(it, i) in departmentList" :key="it + i" :title="it">{{ it }}</p>
                </div>
                <div class="version">
                  <p class="mb-2">当前版本：</p>
                  <p style="letter-spacing: 1px;">{{ VERSION }}</p>
                </div>
              </div>
            </div>
            <span class="el-dropdown-link">
              <i class="el-icon-user"></i>
              <span :title="Permission.StaffName">{{Permission.StaffName}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown" class="mp-erp-user-drop-down-wrap">
            <el-dropdown-item icon="el-icon-lock" command='changePwd'>修改密码</el-dropdown-item>
            <el-dropdown-item v-if="docPermissions && docPermissions.manage" command='manage'>
              <i class="iconfont icon-wendangguanli1"></i>文档管理</el-dropdown-item>
            <el-dropdown-item v-if="docPermissions && docPermissions.read" command='document'>
              <i class="iconfont icon-bangzhuzhongxin"></i>帮助中心</el-dropdown-item>
            <!-- <el-dropdown-item command='downtime' class="downtime">
              <img src="@/assets/images/downtime.png" alt="">
              <span>停机维护</span>
            </el-dropdown-item> -->
            <el-dropdown-item icon="el-icon-switch-button" command='logout'>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <ChangePwdDialog :visible.sync="visible4ChangePassword" />
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { throttle } from '@/assets/js/utils/throttle';
import TokenClass from '@/assets/js/utils/tokenManage';
// import sortable from '../../../assets/js/mixins/Sortable/Sortable';
import ChangePwdDialog from './ChangePwdDialog.vue';
import { WikiHandler } from '@/assets/js/TypeClass/WikiHandler';

export default {
  components: {
    ChangePwdDialog,
  },
  data() {
    return {
      showContextMenu: false,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      contextmenuItemData: null,
      departmentLevelList: [], // 部门树形列表 -- 后面不用则删除
      sortItem: null,
      visible4ChangePassword: false, // 修改密码弹窗打开状态
      isIntranet: true,
      VERSION: '',
    };
  },
  computed: {
    ...mapState('layout', ['editableTabsValue', 'editableTabs', 'isLeftCollapse']),
    ...mapState('common', ['Permission']),
    localTabsValue: {
      get() {
        return this.editableTabsValue;
      },
      set(val) {
        if (this.editableTabsValue === val) return;
        const t = this.editableTabs.find((it) => it.name === val);
        if (t) {
          this.$store.commit('layout/setEditableTabsValue', t.name);
          this.$store.commit('layout/setLeftMenuDefaultActive', t.name);
          this.$router.push(t.path);
        }
      },
    },
    showFileCheck() {
      if (this.Permission && this.Permission.PermissionList && this.Permission.PermissionList.PermissionCheckFileContent) {
        return this.Permission.PermissionList.PermissionCheckFileContent.HavePomission;
      }

      return false;
    },
    showBatchUpload() {
      if (this.Permission && this.Permission.PermissionList && this.Permission.PermissionList.PermissionPlateOrder) {
        return this.Permission.PermissionList.PermissionPlateOrder.Obj.BatchUpload;
      }

      return false;
    },
    docPermissions() { // 文档权限
      if (!this.Permission) return null;

      const {
        ReadLevel1, ReadLevel2, ReadLevel3, ReadLevel4, ReadLevel5, Setup,
      } = this.Permission.PermissionList.PermissionManageArticle.Obj || {};

      return {
        manage: Setup,
        read: [ReadLevel1, ReadLevel2, ReadLevel3, ReadLevel4, ReadLevel5].includes(true),
      };
    },
    departmentList() {
      if (this.departmentLevelList.length && this.Permission) {
        const str = this.formatDepartment(this.Permission, this.departmentLevelList);
        if (str) return str.split(' | ');
      }

      return [];
    },
  },
  methods: {
    ...mapMutations('layout', ['removeOther']),
    getContextmenuItemData(title) {
      const t = this.editableTabs.find((it) => it.title === title);
      if (t) this.contextmenuItemData = t;
      else this.contextmenuItemData = null;
    },
    onContextmenuclick(e) {
      const bool = e.target.classList.contains('el-tabs__item')
        || e.target.parentNode.classList.contains('el-tabs__item');
      if (bool) {
        e.preventDefault();
        let title = e.target.innerText;
        if (!title && e.target.parentNode.classList.contains('el-tabs__item')) {
          title = e.target.parentNode.innerText;
        }
        if (title) {
          this.contextMenuLeft = e.pageX - this.$refs.oList.offsetLeft;
          this.contextMenuTop = e.pageY - this.$refs.oList.offsetTop;
          this.showContextMenu = true;
          // console.log(title);
          this.getContextmenuItemData(title);
        }
      }
    },
    onDocumentClick() {
      if (!this.showContextMenu) return;
      this.showContextMenu = false;
    },
    onCloseCurClick(name) {
      // 关闭
      if ((!this.contextmenuItemData && !name) || (this.contextmenuItemData && this.contextmenuItemData.title === '首页')) return;
      const tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      const itemName = name || this.contextmenuItemData.name;
      if (activeName === itemName) {
        tabs.forEach((tab, index) => {
          if (tab.name === itemName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.$store.commit('layout/removeTabItem', itemName);
      this.localTabsValue = activeName;

      // this.$router.go(0); // 硬刷新 和 window.location.reload() 类似

      // this.$store.commit('layout/setShowCommonView', false);
      // this.$nextTick(() => {
      //   this.$store.commit('layout/setShowCommonView', true);
      // });
    },
    onCloseOtherClick() {
      // 关闭其它
      if (!this.contextmenuItemData) return;
      this.removeOther(this.contextmenuItemData.name);
      this.localTabsValue = this.contextmenuItemData.name;
    },
    onCloseAllClick() {
      // 关闭所有
      this.$store.commit('layout/removeAll');
      this.localTabsValue = '1';
    },
    tableSort() {
      // const tbody = document.querySelector('.mp-erp-layout-header-comp-wrap .list .el-tabs__nav-scroll > div ');
      // const ops = {
      //   draggable: '.is-closable',
      // };
      // this.sortItem = sortable.create(tbody, ops);
    },
    setIsLeftCollapse(bool) {
      this.$store.commit('layout/setIsLeftCollapse', bool);
    },
    onCollapseClick(bool) {
      this.setLeftCollapse(bool);
    },
    onCommand(command) {
      switch (command) {
        case 'logout': // 退出登录
          this.handleLogoutClick();
          break;
        case 'changePwd': // 修改密码
          this.visible4ChangePassword = true;
          break;
        case 'downtime': // 停机维护
          this.handleOpenPageClick('downtimeManage');
          break;

        case 'checkFile': // 检查文件内容
          this.handleFileCheck();
          break;

        case 'batchUpload': // 批量上传
          // this.$router.push('/BatchUpload');
          this.handleOpenPageClick('BatchUpload');
          break;

        default:
          this.onDocClick(command);
          break;
      }
    },
    onDocClick(target) {
      if (!this.Permission) return;
      const siteType = 1;
      // window.open(`http://file.ybz888.com:7006/init?token=${this.Permission.Token}&siteType=${siteType}&target=${target}`);
      WikiHandler.toWikiPageWithToken({ token: this.Permission.Token, siteType, target });
    },
    handleLogoutClick() { // 退出
      this.messageBox.warnCancelNullMsg('确定退出登录吗?', () => {
        TokenClass.removeToken();
        this.$router.replace('/login');
      });
    },
    handleOpenPageClick(routeName) { // 停机维护点击事件
      if (this.$route.name === routeName) return;
      this.$emit('openPage', routeName);
    },
    handleFileCheck() {
      window.open('/checkFileContent');
    },
    async getDepartmentList() { // 获取部门列表数据
      const resp = await this.api.getDepartmentList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const _list = resp.data.Data || [];
        const level1List = _list.filter(item => item.Level === 1).map(i => ({ ...i, children: [] }));
        level1List.forEach(level1 => {
          const _level1list = _list.filter(item => item.Level === 2 && item.ParentID === level1.ID)
            .map(item => ({ ...item, children: [] }));
          // eslint-disable-next-line no-param-reassign
          level1.children = _level1list;
          level1.children.forEach(level2 => {
            const _level3list = _list.filter(item => item.Level === 3 && item.ParentID === level2.ID);
            // eslint-disable-next-line no-param-reassign
            level2.children = _level3list;
          });
        });
        this.departmentLevelList = level1List;
      }
    },
    formatDepartment({ PositionList }, departmentLevelList) {
      if (Array.isArray(PositionList) && PositionList.length > 0) {
        const list = PositionList.map(({ First, Second }) => {
          const { FirstDepartmentID, SecondDepartmentID, ThirdDepartmentID } = First;
          const { PositionName } = Second;
          let str = '';
          const _getDepartmentName = (id, _list) => {
            if ((!id && id !== 0) || id === -666 || !Array.isArray(_list)) return undefined;
            const t = _list.find(it => it.ID === id);
            return t && { ClassName: t.ClassName, arr: t.children };
          };
          const f = _getDepartmentName(FirstDepartmentID, departmentLevelList);
          if (f) {
            str += f.ClassName;
            const s = _getDepartmentName(SecondDepartmentID, f.arr);
            if (s) {
              str += `-${s.ClassName}`;
              const third = _getDepartmentName(ThirdDepartmentID, s.arr);
              if (third) {
                str += `-${third.ClassName}`;
              }
            }
          }
          return [str, PositionName].filter(it => it).join(' ');
        });
        return list.filter(it => it).join(' | ');
      }
      return '';
    },
  },
  mounted() {
    document.addEventListener('click', this.onDocumentClick);
    // this.tableSort();
    this.setLeftCollapse = throttle(this.setIsLeftCollapse, 360);

    this.isIntranet = !window.location.protocol.startsWith('https');
    this.getDepartmentList();

    this.VERSION = process.env.VUE_APP_VERSION;
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
    if (this.sortItem) this.sortItem.destroy();
  },
};
</script>
<style lang='scss'>
.mp-erp-layout-header-comp-wrap {
  box-sizing: border-box;
  width: 100%;
  min-width: 400px;
  background-color: #f5f5f5;
  > .list {
    display: flex;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    // border-bottom: 1px solid #d8dce5;
    align-items: center;
    height: 40px;
    padding-top: 8px;
    position: relative;
    // padding-bottom: 2px;
    padding-right: 260px;
    width: 100%;
    box-sizing: border-box;
    background-color: #191F2A;
    margin-bottom: 7px;
    > div.collapse-ctrl-box {
      margin-right: 5px;
      font-size: 20px;
      margin-left: 20px;
      width: 25px;
      box-sizing: border-box;
      flex: none;
      > i {
        cursor: pointer;
      }
    }
    .el-scrollbar__view {
      display: flex;
      align-items: center;
    }
    .el-tabs {
      border: none;
      margin-left: 12px;
      box-shadow: none;
      flex: 0 1 auto;
      height: 26px;
      overflow-x: hidden;
      .el-tabs__header {
        margin: 0;
        border: none;
        background-color: #fff;
        .el-tabs__item {
          border: none;
          font-size: 12px;
          height: 26px;
          line-height: 24px;
          padding: 0 10px !important;
          border: 1px solid #ddd;
          margin-left: 8px !important;
          margin-top: 0 !important;
          color: #585858;
          transition: padding 0.2s ease-in-out;
          user-select: none;
          border-radius: 2px;
          > span {
            margin-left: 13px;
          }
          &::before {
            content: "";
            position: absolute;
            width: 8px;
            height: 8px;
            left: 8px;
            top: calc(50% - 4px);
            background-color: #fff;
            border-radius: 50%;
            // display: none;
            opacity: 0;
            transition: 0.2s ease-in-out;
          }
          &.is-active {
            background-color: rgb(38, 188, 249);
            color: #fff !important;
            border-color: rgb(38, 188, 249);
            // border: none;
            // background: linear-gradient(to right, #26bcf9, #35dff9);
            padding-left: 25px !important;
            // margin-top: -1px;
            &::before {
              display: block;
              opacity: 1;
            }
          }
          &:active:not(.is-active) {
            background-color: #eee;
          }
        }
        .el-tabs__nav-next, .el-tabs__nav-prev {
          height: 26px;
          line-height: 26px;
          cursor: pointer !important;
          color: #444;
        }
      }
      .el-tabs__content {
        display: none;
      }
    }
    .clear-box {
      margin-left: 12px;
      border: 1px solid #ababab;
      padding: 2px;
      color: #ababab;
      border-radius: 2px;
      cursor: pointer;
      transition: 0.1s ease-in-out;
      font-size: 14px;
      flex: none;
      margin-right: 20px;
      &:hover {
        border-color: #999;
        color: #999;
      }
      &:active {
        border-color: #444;
        color: #444;
        box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3),
          0 1px 2px rgba(0, 0, 0, 0.15);
      }
    }
    > .mp-erp-layout-header-show-menu-box {
      position: absolute;
      width: 80px;
      height: 90px;
      font-size: 12px;
      padding: 6px 0;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      background-color: #fff;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
      z-index: 99;
      box-sizing: border-box;
      border-radius: 4px;
      color: #333;
      > li {
        padding: 6px 12px;
        cursor: pointer;
        user-select: none;
        &:hover {
          background-color: #eee;
          color: rgb(38, 188, 249);
        }
      }
    }
    > .user {
      position: absolute;
      flex: none;
      text-align: right;
      width: 260px;
      right: 0;
      top: 0;
      bottom: 0;
      font-size: 14px;
      padding: 10px;
      // padding-top: 14px;
      padding: 0 10px;
      padding-right: 20px;
      box-sizing: border-box;
      > .menu {
        position: relative;
        top: -1px;
        cursor: pointer;
        color: #ddd;
        user-select: none;
        > i {
          font-weight: 700;
          vertical-align: -1px;
          color: #26bcf9;
        }
        &:hover {
          color: #26bcf9;
        }
        &:active {
          color: #428dfa;
        }
      }
      .el-dropdown-link {
        color: #ddd;
        font-size: 13px;
        line-height: 21px;
        display: flex;
        align-items: center;
        height: 24px;
        padding: 5px 0;
        padding-top: 8px;
        padding-right: 5px;
        .el-icon-user {
          font-size: 16px;
          margin-right: 4px;
          font-weight: 700;
          color: #26bcf9;
        }
        span {
          margin: 0 4px;
          max-width: 6em;
          overflow: hidden;
          // text-overflow: ellipsis;
          white-space: nowrap;
        }
        i {
          font-weight: 700;
          color: #26bcf9;
        }
        transition: color 0.12s ease-in-out;
        user-select: none;
        &:hover {
          color: #26bcf9;
        }
        &:active {
          color: #428dfa;
        }
      }
    }

    > .menus {
      color: #ababab;
      font-size: 14px;
      display: flex;
      flex: 0 1 auto;
      overflow: hidden;
      height: 31px;
      white-space: nowrap;
      > span {
        padding-left: 15px;
        padding-right: 12px;
        background-color: #32405A;
        border-radius: 4px 4px 0px 0px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 2px;
        cursor: pointer;
        margin-right: 1px;
        flex: 0 1 auto;
        overflow: hidden;
        i {
          margin-left: 8px;
          flex: none;
          &:hover {
            color: #26bcf9;
          }
        }
        em {
          flex: 0 1 auto;
          overflow: hidden;
        }
        &:hover {
          background-color: #454C5A;
        }
        &.active {
          background-color: #f5f5f5;
          color: #444444;
        }
      }
    }
  }
}
.mp-erp-user-drop-down-wrap {
  padding: 10px 0px !important;
  width: 130px !important;
  .el-dropdown-menu__item {
    line-height: 32px;
    padding: 0 15px;
    padding-left: 18px;
    margin: 0;
    i {
      font-weight: 700;
      font-size: 16px;
      margin-right: 8px;
      color: #888;
      transition: color 0.08s ease-in-out;
    }
    transition: 0.08s ease-in-out;
    color: #585858;
    &.downtime {
      > img {
        width: 15px;
        position: relative;
        top: 2px;
        margin-right: 8px;
      }
    }
    & + .el-dropdown-menu__item {
      margin-top: 4px;
    }
    &:hover > i {
      color: #26bcf9;
    }
  }
  // &.el-popper[x-placement^=bottom] {
  //   margin-top: 1px !important;
  // }
  &.el-popper[x-placement^=bottom] {
    margin-top: 12px !important;
    & > div::after,
    & > div{
      display: block !important;
    }
    overflow-y: visible;
  }
}
.mp-erp-header-username-tooltip-content {
  display: flex;
  padding: 8px;
  padding-bottom: 5px;

  .right {
    width: 210px;
    box-sizing: border-box;
    padding-left: 15px;
    line-height: 16px;
    color: #eee;
    .position {
      min-height: 102px;
    }
    p {
      margin-bottom: 5px;
      &.mb-2 {
        margin-bottom: 2px;
      }
    }
    .version {
      padding-top: 5px;
    }
  }
}
.mp-erp-header-username-tooltip-popper-box {
  background: rgb(25, 31, 42) !important;
  background: rgb(34, 43, 58) !important;
}
</style>
