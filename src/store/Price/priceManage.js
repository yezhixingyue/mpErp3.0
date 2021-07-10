import api from '@/api/index';
// import messageBox from '@/assets/js/utils/message';
import CommonClassType from '@/store/CommonClassType';

const initConditon = {
  ProductClass: {
    First: '',
    Second: '',
    Third: '',
  },
  Page: 1,
  PageSize: 24,
  KeyWords: '',
  FieldType: 4,
  NoPrice: false,
};

export default {
  namespaced: true,
  state: {
    /** 请求列表数据的对象
     ---------------------------------------- */
    condition4PriceManageList: JSON.parse(JSON.stringify(initConditon)),
    PriceManageList: [],
    PriceManageListNumber: 0,
    isPriceDataLoading: false,
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
     ---------------------------------------- */
    setCondition4PriceManageList(state, [[key1, key2], value]) {
      if (!key2) state.condition4PriceManageList[key1] = value;
      else state.condition4PriceManageList[key1][key2] = value;
    },
    /** 设置请求列表数据 及 条目数量
     ---------------------------------------- */
    setPriceManageList(state, [list, count]) {
      state.PriceManageList = list;
      if (!count && count !== 0) return;
      state.PriceManageListNumber = count;
    },
    /** 设置列表数据是否正在加载中
     ---------------------------------------- */
    setIsPriceDataLoading(state, bool) {
      state.isPriceDataLoading = bool;
    },
    /** 清除列表数据请求信息
     ---------------------------------------- */
    clearCondition4PriceManageList(state) {
      state.condition4PriceManageList = JSON.parse(JSON.stringify(initConditon));
    },
  },
  actions: {
    async getPriceManageList({ state, commit }, page = 1) { // 获取产品列表数据
      commit('setCondition4PriceManageList', [['Page', ''], page]);
      commit('setPriceManageList', [[], undefined]);
      const _obj = CommonClassType.filter(state.condition4PriceManageList);
      commit('setIsPriceDataLoading', true);
      let key = true;
      const res = await api.getManageProductLists(_obj).catch(() => { key = false; });
      commit('setIsPriceDataLoading', false);
      if (key && res && res.status === 200 && res.data.Status === 1000) {
        commit('setPriceManageList', [res.data.Data, res.data.DataNumber]);
      }
    },
  },
};
