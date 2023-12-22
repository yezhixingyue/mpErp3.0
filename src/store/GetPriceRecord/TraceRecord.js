import CommonClassType from '@/store/CommonClassType';
import api from '../../api';

class RecordListConditonClass {
  Page = 1; // 页码

  KeyWords = ''; // 关键词 (活动名称)

  PageSize = 30; // 页容量

  DateType = 'today';

  CalculateDate = {
    First: '',
    Second: '',
  }

  SellArea = { // 销售区域
    RegionalID: '',
    CityID: '',
    SellArea: '',
  }

  ProductID = '';

  ProductClass = { // 产品
    First: '',
    Second: '',
  }

  Amount = { // 成交价
    First: '',
    Second: '',
  }

  Terminal = '';

  CustomerType= {
    First: '',
    Second: '',
  }
  // initDateText = '今天';
}
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
