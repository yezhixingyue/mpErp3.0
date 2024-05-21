import api from '@/api/index';

export default {
  namespaced: true,
  state: {
    AfterSalesList: [], // 售后列表
    AfterSalesDetail: null, // 售后详情
  },
  getters: {
  },
  mutations: {
    setAfterSalesList(state, list) {
      state.AfterSalesList = list;
    },
    setAfterSalesDetail(state, Detail) {
      state.AfterSalesDetail = Detail;
    },
  },
  actions: {
    async getOrderAfterSaleQuestionClassList({ commit }, data) {
      const res = await api.getOrderAfterSaleQuestionClassList(data);
      if (!res.data.Data && res.data.Status !== 1000) return;
      commit('setOrderAfterSaleQuestionClassList', res.data.Data);
    },
  },
};
