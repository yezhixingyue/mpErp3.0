export default {
  namespaced: true,
  state: {
    editableTabsValue: '1',
    editableTabs: [{
      title: '首页',
      name: '1',
      path: '/',
      closable: false,
    }],
    leftMenuDefaultActive: '',
    showCommonView: true,
    isLeftCollapse: false, // 控制左侧导航栏是否折叠
  },
  getters: {
    curTabPagesNameList(state) {
      if (!state.editableTabs || state.editableTabs.length === 0) return [];
      // return state.editableTabs.filter(it => !it.isNew && it.pageName).map(it => it.pageName);
      return state.editableTabs.filter(it => it.pageName).map(it => it.pageName);
    },
  },
  mutations: {
    setEditableTabsValue(state, itemName) { // 设置顶部导航按钮值
      if (state.editableTabsValue === itemName) return;
      const t = state.editableTabs.find(it => it.name === itemName);
      if (t) t.isNew = false;
      state.editableTabsValue = itemName;
    },
    addTabItem(state, item) { // 添加顶部导航按钮
      state.editableTabs.push(item);
      state.editableTabsValue = item.name;
    },
    removeTabItem(state, itemName) { // 关闭当前
      const tabs = state.editableTabs;
      state.editableTabs = tabs.filter(tab => tab.name !== itemName);
    },
    removeOther(state, itemName) { // 关闭其它
      const tabs = state.editableTabs;
      state.editableTabs = tabs.filter(tab => tab.name === itemName || !tab.closable);
    },
    removeAll(state) { // 关闭所有
      const tabs = state.editableTabs;
      state.editableTabs = tabs.filter(tab => !tab.closable);
    },
    setLeftMenuDefaultActive(state, name) { // 设置左侧导航活动按钮索引值
      state.leftMenuDefaultActive = name;
    },
    setShowCommonView(state, bool) {
      state.showCommonView = bool;
    },
    setIsLeftCollapse(state, bool) {
      state.isLeftCollapse = bool;
    },
    changeCurTabPath(state, newPath) { // 页面内路由跳转时 记录其路径记录 方便页面跳转不会返回最初页面
      const targetTab = state.editableTabs.find(it => it.name === state.editableTabsValue);
      if (targetTab && targetTab.path !== newPath) targetTab.path = newPath;
    },
  },
  actions: {},
};
