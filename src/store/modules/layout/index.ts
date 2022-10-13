import { defineStore, DefineStoreOptions } from 'pinia';
import { Route } from 'vue-router';
import { IEditableTabItem } from './types';

interface IState {
  editableTabsValue: string
  editableTabs: IEditableTabItem[]
  otherTabPageNames: Route[]
  leftMenuDefaultActive: string
  showCommonView: boolean
  isLeftCollapse: boolean
}

type IGetters = {
  curTabPagesNameList:()=>string[]
};

interface IActions {
  setEditableTabsValue(itemName: string): void
  addTabItem(item: IEditableTabItem): void
  removeTabItem(itemName: string): void
  removeOther(itemName: string): void
  removeAll(): void
  setLeftMenuDefaultActive(name: string): void
  setShowCommonView(bool: boolean): void
  setIsLeftCollapse(bool: boolean): void
  changeCurTabPath(newPath: string): void
  setOtherTabPageNames(tabItem: Route): void
  filterOtherTabPageNames(routeNames: string[]): void
}

const storeOptions: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'layout',
  state: () => ({
    editableTabsValue: '1',
    editableTabs: [{
      title: '首页',
      name: '1',
      path: '/',
      closable: false,
    }],
    otherTabPageNames: [],
    leftMenuDefaultActive: '',
    showCommonView: true,
    isLeftCollapse: false, // 控制左侧导航栏是否折叠
  }),
  getters: {
    curTabPagesNameList() {
      const otherList = this.otherTabPageNames.map(it => it.meta);
      const list = [...this.editableTabs, ...otherList];
      if (list.length === 0) return [];
      return list.filter(it => it?.pageName).map(it => it?.pageName) as string[];
    },
  },
  actions: {
    setEditableTabsValue(itemName) { // 设置顶部导航按钮值
      if (this.editableTabsValue === itemName) return;
      const t = this.editableTabs.find(it => it.name === itemName);
      if (t) t.isNew = false;
      this.editableTabsValue = itemName;
    },
    addTabItem(item) { // 添加顶部导航按钮
      this.editableTabs.push(item);
      this.editableTabsValue = item.name;
    },
    removeTabItem(itemName) { // 关闭当前
      const tabs = this.editableTabs;
      this.editableTabs = tabs.filter(tab => tab.name !== itemName);
    },
    removeOther(itemName) { // 关闭其它
      const tabs = this.editableTabs;
      this.editableTabs = tabs.filter(tab => tab.name === itemName || !tab.closable);
    },
    removeAll() { // 关闭所有
      const tabs = this.editableTabs;
      this.editableTabs = tabs.filter(tab => !tab.closable);
    },
    setLeftMenuDefaultActive(name) { // 设置左侧导航活动按钮索引值
      this.leftMenuDefaultActive = name;
    },
    setShowCommonView(bool) {
      this.showCommonView = bool;
    },
    setIsLeftCollapse(bool) {
      this.isLeftCollapse = bool;
    },
    changeCurTabPath(newPath) { // 页面内路由跳转时 记录其路径记录 方便页面跳转不会返回最初页面
      const targetTab = this.editableTabs.find(it => it.name === this.editableTabsValue);
      if (targetTab && targetTab.path !== newPath) targetTab.path = newPath;
    },
    setOtherTabPageNames(tabItem) {
      const t = this.otherTabPageNames.find(it => it.name === tabItem.name);
      if (!t) this.otherTabPageNames.push(tabItem);
    },
    filterOtherTabPageNames(routeNames) {
      this.otherTabPageNames = this.otherTabPageNames.filter(it => it.name && !routeNames.includes(it.name));
    },
  },
};

export const useLayoutStore = defineStore(storeOptions);
