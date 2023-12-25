import CommonClassType from '@/store/CommonClassType';
import api from '../../api';

class CommunicationRecordConditonClass {
  Page = 1; // 页码

  KeyWords = ''; // 关键词 (活动名称)

  PageSize = 30; // 页容量

  DateType = 'today';

  CommunicateTime = {
    First: '',
    Second: '',
  }

  SellArea = { // 销售区域
    RegionalID: '',
    CountyID: '',
    CityID: '',
    SellArea: '',
  }

  CustomerType= {
    First: '',
    Second: '',
  }

  CommunicateType= ''

  OperatorID= ''

  FieldType= 1

  Order= {
    First: '',
    Second: '',
  }
}
export default {
  namespaced: true,
  state: {
    condition4RecordList: new CommunicationRecordConditonClass(),
    CommunicationRecordList: [],
    CommunicationRecordNumber: 0,
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
      state.condition4RecordList = new CommunicationRecordConditonClass();
    },
    transformCondition4RecordListDate(state) {
      CommonClassType.setDate(state.condition4RecordList, 'CommunicateTime');
    },
    setCommunicationRecordList(state, { Data, DataNumber }) {
      state.CommunicationRecordList = Data;
      if (DataNumber || DataNumber === 0) state.CommunicationRecordNumber = DataNumber;
    },
    setLoading(state, bool) {
      state.loading = bool;
    },
  },
  actions: {
    async getCommunicationRecordList({ state, commit }, page = 1) {
      commit('setCondition4RecordList', [['Page', ''], page]);
      commit('transformCondition4RecordListDate');
      const temp = CommonClassType.filter(state.condition4RecordList, true);
      commit('setCommunicationRecordList', { Data: [], DataNumber: undefined });
      commit('setLoading', true);
      const resp = await api.getCustomerCommunicateLogList(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setCommunicationRecordList', resp.data);
      }
      commit('setLoading', false);
    },
  },
};
