import api from '../../api';

export default {
  namespaced: true,
  state: {
    CustomerTrackDetail: {},
  },
  getters: {
  },
  mutations: {
    addCustomerCommunicateLogs(state, item) {
      state.CustomerTrackDetail?.CustomerCommunicateLogs?.push(item);
    },
    addCustomerTrackLogs(state, item) {
      state.CustomerTrackDetail?.CustomerTrackLogs?.push(item);
    },
    setCustomerTrackDetail(state, list) {
      state.CustomerTrackDetail = list;
    },
  },
  actions: {
    getCustomerTrackDetail({ commit }, customerID) {
      api.getCustomerTrackDetail(customerID).then(res => {
        if (res.data.Status === 1000) {
          commit('setCustomerTrackDetail', res.data.Data);
        }
      });
    },
  },
};
