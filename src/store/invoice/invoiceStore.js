import CommonClassType from '@/store/CommonClassType';
import api from '../../api';
import Condition4InvoiceMakeUpList from './Condition4InvoiceMakeUpList';

export default {
  namespaced: true,
  state: {
    loading: false,
    /** 发票开具相关
     ---------------------------------------- */
    condition4InvoiceMakeUpList: new Condition4InvoiceMakeUpList(),
    InvoiceMakeUpList: [],
    InvoiceMakeUpListNumber: 0,
    /** 发票类别相关
     ---------------------------------------- */
    InvoiceInfoList: [],
    InvoiceInfoListNumber: 0,
  },
  getters: {
  },
  mutations: {
    setLoading(state, bool) {
      state.loading = bool;
    },
    /** 发票开具相关
     ---------------------------------------- */
    setCondition4InvoiceMakeUpList(state, [[key1, key2], value]) {
      state.condition4InvoiceMakeUpList.setCondition([[key1, key2], value]);
    },
    clearCondition4InvoiceMakeUpList(state) {
      state.condition4InvoiceMakeUpList = new Condition4InvoiceMakeUpList();
    },
    transformCondition4InvoiceMakeUpList(state) {
      CommonClassType.setDate(state.condition4InvoiceMakeUpList, 'CalculateDate'); // 需要改key值
    },
    setInvoiceMakeUpList(state, { Data, DataNumber }) {
      state.InvoiceMakeUpList = Data;
      if (DataNumber || DataNumber === 0) state.InvoiceMakeUpListNumber = DataNumber;
    },
    /** 发票类别相关
     ---------------------------------------- */
    setInvoiceInfoList(state, { Data, DataNumber }) {
      state.InvoiceInfoList = Data;
      if (DataNumber || DataNumber === 0) state.InvoiceInfoListNumber = DataNumber;
    },
    setInvoiceInfoItemChange(state, { itemData, isEdit, isRemove }) {
      if (isEdit || isRemove) { // 编辑 | 删除
        const i = state.InvoiceInfoList.findIndex(it => it.ID === itemData.ID);
        if (i > -1) {
          if (isEdit) {
            state.InvoiceInfoList.splice(i, 1, itemData);
          } else if (isRemove) {
            state.InvoiceInfoList.splice(i, 1);
            state.InvoiceInfoListNumber -= 1;
          }
        }
        return;
      }
      // 添加
      state.InvoiceInfoList.unshift(itemData);
      state.InvoiceInfoListNumber += 1;
    },
  },
  actions: {
    /** 发票开具相关
     ---------------------------------------- */
    async getInvoiceMakeUpList({ state, commit }, page = 1) {
      // 获取发票开具列表数据
      commit('setCondition4InvoiceMakeUpList', [['Page', ''], page]);
      commit('transformCondition4InvoiceMakeUpList');
      const temp = CommonClassType.filter(state.condition4InvoiceMakeUpList, true);
      commit('setInvoiceMakeUpList', { Data: [], DataNumber: undefined });
      commit('setLoading', true);
      const resp = await api.getCalculatePriceRecordList(temp).catch(() => null); // 需要改接口
      if (resp && resp.data.Status === 1000) {
        commit('setInvoiceMakeUpList', resp.data);
      }
      commit('setLoading', false);
    },
    /** 发票类别相关
     ---------------------------------------- */
    async getInvoiceInfoList({ commit }) {
      // 获取发票类别列表数据
      commit('setInvoiceInfoList', { Data: [], DataNumber: undefined });
      commit('setLoading', true);
      const resp = await api.getInvoiceCategoryList().catch(() => null); // 需要改接口
      if (resp && resp.data.Status === 1000) {
        commit('setInvoiceInfoList', resp.data);
      }
      commit('setLoading', false);
    },
  },
};
