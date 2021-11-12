import CommonClassType from '@/store/CommonClassType';
import RecordListConditonClass from './ConditionClassType';

export default {
  namespaced: true,
  state: {
    condition4RecordList: new RecordListConditonClass(),
    RecordDataList: [],
    RecordDataNumber: 0,
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
  },
  actions: {
    getRecordList({ state, commit }) {
      commit('transformCondition4RecordListDate');
      console.log('getRecordList action', state.condition4RecordList);
    },
  },
};
