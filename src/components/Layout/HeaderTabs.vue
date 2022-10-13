<template>
  <header class="mp-erp-layout-header-comp-wrap">
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
        <li @click="() => onCloseCurClick('')">关闭</li>
        <li @click="onCloseOtherClick">关闭其它</li>
        <li @click="onCloseAllClick">关闭所有</li>
      </ul>
      <div class="user">
        <el-dropdown trigger="click" v-if="user" @command='onCommand'>
          <span class="el-dropdown-link">
            <i class="el-icon-user"></i>
            <span :title="user.Name">{{user.Name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="mp-erp-user-drop-down-wrap">
            <el-dropdown-item icon="el-icon-lock" command='changePwd'>修改密码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" command='logout'>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <ChangePwdDialog :visible.sync="visible4ChangePassword" />
  </header>
</template>

<script setup lang="ts">
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import sortable from 'sortablejs';
import { tokenHandler } from '@/api/utils/handleToken/tokenHandler';
import { message } from '@/assets/js/message';
import { IEditableTabItem } from '@/store/modules/layout/types';
import { useLayoutStore } from '@/store/modules/layout';
import { useUserStore } from '@/store/modules/user';
import router from '@/router';
import ChangePwdDialog from './ChangePwdDialog.vue';

const showContextMenu = ref(false);
const contextMenuLeft = ref(0);
const contextMenuTop = ref(0);
const contextmenuItemData = ref<null | IEditableTabItem>(null);
const sortItem = ref<null | sortable>(null);
const visible4ChangePassword = ref(false); // 修改密码弹窗打开状态
const oList = ref<InstanceType<typeof HTMLElement>>();

const layoutStore = useLayoutStore();
const { editableTabsValue, editableTabs, isLeftCollapse } = storeToRefs(layoutStore);

const userStore = useUserStore();
const user = computed(() => userStore.user);

const localTabsValue = computed({
  get() {
    return editableTabsValue.value;
  },
  set(val) {
    if (editableTabsValue.value === val) return;
    const t = editableTabs.value.find((it) => it.name === val);
    if (t) {
      layoutStore.setEditableTabsValue(t.name);
      layoutStore.setLeftMenuDefaultActive(t.name);
      router.push(t.path);
    }
  },
});

const getContextmenuItemData = (title: string) => {
  const t = editableTabs.value.find((it) => it.title === title);
  if (t) contextmenuItemData.value = t;
  else contextmenuItemData.value = null;
};

const onContextmenuclick = (e: MouseEvent) => {
  if (!e || !e.target || !(e.target instanceof HTMLElement)) return;
  let bool = e.target.classList.contains('el-tabs__item');
  if (!bool && e.target.parentNode && e.target.parentNode instanceof HTMLElement) {
    bool = e.target.parentNode?.classList.contains('el-tabs__item');
  }

  if (bool) {
    e.preventDefault();
    let title = e.target.innerText;
    if (!title && e.target.parentNode && e.target.parentNode instanceof HTMLElement && e.target.parentNode.classList.contains('el-tabs__item')) {
      title = e.target.parentNode.innerText;
    }
    if (title && oList.value && title !== '首页') {
      contextMenuLeft.value = e.pageX - oList.value.offsetLeft;
      contextMenuTop.value = e.pageY - oList.value.offsetTop;
      showContextMenu.value = true;
      getContextmenuItemData(title);
    }
  }
};

const onDocumentClick = () => {
  if (!showContextMenu.value) return;
  showContextMenu.value = false;
};

const onCloseCurClick = (name: string) => { // 关闭
  if ((!contextmenuItemData.value && !name) || (contextmenuItemData.value && contextmenuItemData.value.title === '首页')) return;
  const tabs = editableTabs.value;
  let activeName = editableTabsValue.value;
  const itemName = name || contextmenuItemData.value?.name || '';
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
  layoutStore.removeTabItem(itemName);
  localTabsValue.value = activeName;
};

const onCloseOtherClick = () => { // 关闭其它
  if (!contextmenuItemData.value) return;
  layoutStore.removeOther(contextmenuItemData.value.name);
  localTabsValue.value = contextmenuItemData.value.name;
};

const onCloseAllClick = () => { // 关闭所有
  layoutStore.removeAll();
  localTabsValue.value = '1';
};

const tableSort = () => {
  const tbody = document.querySelector('.mp-erp-layout-header-comp-wrap .list .el-tabs__nav-scroll > div ');
  if (!tbody || !(tbody instanceof HTMLElement)) return;
  const ops = {
    draggable: '.is-closable',
  };
  sortItem.value = sortable.create(tbody, ops);
};

const isOngoing = ref(false);

const onCollapseClick = (bool: boolean) => {
  if (isOngoing.value) return;
  layoutStore.setIsLeftCollapse(bool);
  isOngoing.value = true;
  setTimeout(() => {
    isOngoing.value = false;
  }, 500);
};

const handleLogoutClick = () => { // 退出
  message.confirm({
    title: '确定退出登录吗?',
    onOk: () => {
      tokenHandler.removeToken();
      router.replace('/login');
    },
  });
};

const onCommand = (command: string) => {
  switch (command) {
    case 'logout': // 退出登录
      handleLogoutClick();
      break;
    case 'changePwd': // 修改密码
      visible4ChangePassword.value = true;
      break;

    default:
      break;
  }
};

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  tableSort();
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
  if (sortItem.value) sortItem.value.destroy();
});

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
    padding-top: 5px;
    position: relative;
    padding-bottom: 3px;
    padding-right: 245px;
    width: 100%;
    box-sizing: border-box;
    z-index: 5;
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
      height: 20px;
      width: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
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
      height: 100px;
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
      width: 180px;
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
        color: #888e99;
        user-select: none;
        > i {
          font-weight: 700;
          vertical-align: -1px;
        }
        &:hover {
          color: #26bcf9;
        }
        &:active {
          color: #428dfa;
        }
      }
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
