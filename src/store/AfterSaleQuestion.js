/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import api from '@/api/index';

export default {
  namespaced: true,
  state: {
    OrderAfterSaleQuestionClassList: [], //
    SaveDialogData: {
      ID: '',
      DivideName: '',
      ProductIDS: [],
    },
  },
  getters: {
  },
  mutations: {
    setOrderAfterSaleQuestionClassList(state, list) {
      state.OrderAfterSaleQuestionClassList = list;
    },
    ChangeSaveDialogData(state, [key, data]) {
      state.SaveDialogData[key] = data;
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
