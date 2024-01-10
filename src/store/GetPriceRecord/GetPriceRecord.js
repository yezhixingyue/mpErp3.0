import CommonClassType from '@/store/CommonClassType';
import api from '../../api';
import RecordListConditonClass from './ConditionClassType';

export default {
  namespaced: true,
  state: {
    condition4RecordList: new RecordListConditonClass(),
    RecordDataList: [],
    RecordDataNumber: 0,
    loading: false,
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
     ---------------------------------------- */
    setCondition4RecordList(state, [[key1, key2], value]) {
      if (!key2) state.condition4RecordList[key1] = value;
      else state.condition4RecordList[key1][key2] = value;
    },
    /** 重置清除请求对象信息
     ---------------------------------------- */
    clearCondition4RecordList(state) {
      state.condition4RecordList = new RecordListConditonClass();
    },
    transformCondition4RecordListDate(state) {
      CommonClassType.setDate(state.condition4RecordList, 'CalculateDate');
    },
    setRecordDataList(state, { Data, DataNumber }) {
      state.RecordDataList = Data;
      if (DataNumber || DataNumber === 0) state.RecordDataNumber = DataNumber;
    },
    setTrackStatus(state, { QuotationNumber, Status }) {
      state.RecordDataList.forEach((element, index) => {
        if (element.QuotationNumber === QuotationNumber) {
          state.RecordDataList[index].TrackStatus = Status;
          console.log(state.RecordDataList[index].TrackStatus);
        }
      });
    },
    setLoading(state, bool) {
      state.loading = bool;
    },
  },
  actions: {
    async getRecordList({ state, commit }, page = 1) {
      commit('setCondition4RecordList', [['Page', ''], page]);
      commit('transformCondition4RecordListDate');
      const temp = CommonClassType.filter(state.condition4RecordList, true);
      commit('setRecordDataList', { Data: [], DataNumber: undefined });
      commit('setLoading', true);
      const resp = await api.getCalculatePriceRecordList(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setRecordDataList', resp.data);
      }
      commit('setLoading', false);
    },
  },
};
