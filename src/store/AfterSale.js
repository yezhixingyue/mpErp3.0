import api from '@/api/index';

export default {
  namespaced: true,
  state: {
    QuestionClassList: [], // 售后问题列表
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
    setOrderAfterSaleQuestionClassList(state, list) {
      state.QuestionClassList = list;
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
