import api from '@/api/index';
import CommonClassType from '@/store/CommonClassType';

export default {
  namespaced: true,
  state: {
    /** 请求列表数据的对象
     ---------------------------------------- */
    condition4ProductManageList: {
      ProductClass: {
        First: '',
        Second: '',
      },
      Page: 1,
      PageSize: 24,
      KeyWords: '',
    },
    ProductManageList: [],
    ProductManageListNumber: 0,
    isTableDataLoading: false,
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
     ---------------------------------------- */
    setCondition4ProductManageList(state, [[key1, key2], value]) {
      if (!key2) state.condition4ProductManageList[key1] = value;
      else state.condition4ProductManageList[key1][key2] = value;
    },
    /** 设置请求列表数据 及 条目数量
     ---------------------------------------- */
    setProductManageList(state, [list, count]) {
      state.ProductManageList = list;
      if (!count && count !== 0) return;
      state.ProductManageListNumber = count;
    },
    /** 设置列表数据是否正在加载中
     ---------------------------------------- */
    setisTableDataLoading(state, bool) {
      state.isTableDataLoading = bool;
    },
    setTableDataOrderStatusChange(state, [type, productID]) { // type: ValetOrderStatus | CustomOrderStatus 更改产品自助上传和代客下单状态
      if (state.ProductManageList.length === 0) return;
      const t = state.ProductManageList.find(it => it.ProductID === productID);
      if (t) {
        // console.log(t);
        if (type === 'ValetOrderStatus') t.AllowValetOrder = !t.AllowValetOrder;
        if (type === 'CustomOrderStatus') t.AllowCustomOrder = !t.AllowCustomOrder;
      }
    },
    /** 清除列表数据请求信息
     ---------------------------------------- */
    clearCondition4ProductManageList(state) {
      state.condition4ProductManageList = {
        ProductClass: {
          First: '',
          Second: '',
        },
        Page: 1,
        PageSize: 24,
        KeyWords: '',
      };
    },
  },
  actions: {
    async getManageProductList({ state, commit }, page = 1) { // 获取产品列表数据
      commit('setCondition4ProductManageList', [['Page', ''], page]);
      commit('setProductManageList', [[], undefined]);
      const _obj = CommonClassType.filter(state.condition4ProductManageList);
      commit('setisTableDataLoading', true);
      let key = true;
      const res = await api.getManageProductLists(_obj).catch(() => { key = false; });
      commit('setisTableDataLoading', false);
      if (key && res && res.status === 200 && res.data.Status === 1000) {
        commit('setProductManageList', [res.data.Data, res.data.DataNumber]);
      }
    },
    async getOrderStatusChange({ state, commit }, [type, productID]) { // 更改产品自助上传和代客下单状态
      if (state.ProductManageList.length === 0) return;
      const t = state.ProductManageList.find(it => it.ProductID === productID);
      if (t) {
        let changeRequstFunc = null;
        if (type === 'ValetOrderStatus') changeRequstFunc = api.getValetOrderStatusChange;
        if (type === 'CustomOrderStatus') changeRequstFunc = api.getCustomOrderStatusChange;
        if (!changeRequstFunc) return;
        const res = await changeRequstFunc(productID);
        if (res && res.status === 200 && res.data.Status === 1000) commit('setTableDataOrderStatusChange', [type, productID]);
      }
    },
  },
};
