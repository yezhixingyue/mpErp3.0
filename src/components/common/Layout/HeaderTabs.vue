<template>
  <header class="mp-erp-layout-header-comp-wrap">
    <div class="info" v-if="false">
      <div class="collapse-ctrl-box">
        <i class="el-icon-s-fold" v-if="!isLeftCollapse" @click="onCollapseClick(true)"></i>
        <i class="el-icon-s-unfold" v-else @click="onCollapseClick(false)"></i>
      </div>
      <svg
        t="1619572986782"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="8184"
        width="22"
        height="22"
      >
        <path
          d="M849.92 51.2H174.08C106.24 51.2 51.2 102.72 51.2 166.528v690.944c0 63.68 54.848 115.328 122.88 115.328h675.84c67.84 0 122.88-51.52
         122.88-115.328V166.528C972.8 102.848 917.952 51.2 849.92 51.2z"
          fill="#428dfa"
          p-id="8185"
          data-spm-anchor-id="a313x.7781069.0.i11"
          class="selected"
        ></path>
        <path
          d="M538.496 497.28H290.304V292.544H219.52v477.76h70.848v-204.8h248.192v204.8h70.912V292.48H538.496zM715.776
          477.696h70.912v292.608h-70.912V477.696zM715.776 292.544h70.912v102.4h-70.912v-102.4z"
          fill="#ffffff"
          p-id="8186"
          data-spm-anchor-id="a313x.7781069.0.i8"
          class="selected"
        ></path>
      </svg>
      <span>你好，</span>
      <span>欢迎使用名片之家后台管理系统</span>
      <span v-if="dateString">，今天是{{ dateString }}，{{ weekString }}</span>
      <span>，开始今天的工作吧！</span>
      <!-- <i>!</i> -->
    </div>
    <div class="list" @contextmenu="onContextmenuclick" ref="oList">
      <div class="collapse-ctrl-box">
        <i class="el-icon-s-fold" v-if="!isLeftCollapse" @click="onCollapseClick(true)"></i>
        <i class="el-icon-s-unfold" v-else @click="onCollapseClick(false)"></i>
      </div>
      <el-tabs
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
      </el-tabs>
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
        <el-dropdown trigger="click" v-if="Permission" @command='onCommand'>
          <span class="el-dropdown-link">
            <i class="el-icon-user"></i>
            <span :title="Permission.StaffName">{{Permission.StaffName}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="mp-erp-user-drop-down-wrap">
            <el-dropdown-item icon="el-icon-lock" command='changePwd'>修改密码</el-dropdown-item>
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
import sortable from 'sortablejs';
import { throttle } from '@/assets/js/utils/throttle';
import TokenClass from '@/assets/js/utils/tokenManage';
import ChangePwdDialog from './ChangePwdDialog.vue';

export default {
  components: {
    ChangePwdDialog,
  },
  data() {
    return {
      dateString: '',
      weekString: '',
      weekTextList: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日',
      ],
      showContextMenu: false,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      contextmenuItemData: null,
      sortItem: null,
      visible4ChangePassword: false, // 修改密码弹窗打开状态
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
  },
  methods: {
    ...mapMutations('layout', ['removeOther']),
    getCurDate() {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const w = date.getDay() - 1;
      this.dateString = `${year}年${month}月${day}日`;
      this.weekString = this.weekTextList[w];
    },
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
      const tbody = document.querySelector('.mp-erp-layout-header-comp-wrap .list .el-tabs__nav-scroll > div ');
      const ops = {
        draggable: '.is-closable',
      };
      this.sortItem = sortable.create(tbody, ops);
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
          this.handleDownTimeClick();
          break;

        default:
          break;
      }
    },
    handleLogoutClick() { // 退出
      this.messageBox.warnCancelNullMsg('确定退出登录吗?', () => {
        TokenClass.removeToken();
        this.$router.replace('/login');
      });
    },
    handleDownTimeClick() { // 停机维护点击事件
      if (this.$route.name === 'downtimeManage') return;
      this.$emit('downtime', 'downtimeManage');
    },
  },
  mounted() {
    this.getCurDate();
    document.addEventListener('click', this.onDocumentClick);
    this.tableSort();
    this.setLeftCollapse = throttle(this.setIsLeftCollapse, 360);
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
  > .info {
    height: 48px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    > div.collapse-ctrl-box {
      margin-right: 19px;
      font-size: 20px;
      width: 35px;
      box-sizing: border-box;
      > i {
        cursor: pointer;
      }
    }
    > svg {
      margin-right: 10px;
    }
    > span {
      font-size: 12px;
      color: #999;
      white-space: nowrap;
    }
    > i {
      margin-left: 6px;
      font-size: 15px;
      color: #999;
    }
  }
  > .list {
    display: flex;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid #d8dce5;
    align-items: center;
    height: 40px;
    padding-top: 6px;
    position: relative;
    padding-bottom: 2px;
    padding-right: 160px;
    width: 100%;
    box-sizing: border-box;
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
          border-radius: 0;
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
      border: 1px solid #ddd;
      padding: 2px;
      color: #cbcbcb;
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
      width: 160px;
      right: 0;
      top: 0;
      bottom: 0;
      font-size: 14px;
      padding: 10px;
      // padding-top: 14px;
      padding: 0 10px;
      padding-right: 20px;
      box-sizing: border-box;
      .el-dropdown-link {
        color: #888e99;
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
  }
}
.mp-erp-user-drop-down-wrap {
  padding: 10px 0px !important;
  width: 130px !important;
  .el-dropdown-menu__item {
    line-height: 32px;
    padding: 0 20px;
    padding-left: 23px;
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
</style>
