import CommonClassType from '@/store/CommonClassType';
import api from '../../api';

class TraceRecordConditonClass {
  Page = 1; // 页码

  KeyWords = ''; // 关键词 (活动名称)

  PageSize = 20; // 页容量

  DateType = 'today';

  AddTime = {
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

  Product= {
    ClassID: '',
    TypeID: '',
    ProductID: '',
  }

  TrackStatus= ''

  FieldType= 1

  Order= {
    First: '',
    Second: '',
  }
}
export default {
  namespaced: true,
  state: {
    condition4TraceRecordList: new TraceRecordConditonClass(),
    TraceRecordList: [],
    TraceRecordDataNumber: 0,
    loading: false,
    TrackStatusList: [
      {
        label: '未知',
        value: 0,
      },
      {
        label: '未定稿',
        value: 10,
      },
      {
        label: '比价中',
        value: 20,
      },
      {
        label: '对接给市场',
        value: 30,
      },
      {
        label: '已下单',
        value: 50,
      },
      {
        label: '已流失',
        value: 255,
      },
    ],
  },
  getters: {
    getTraceRecordPage(state) {
      return state.condition4TraceRecordList.Page;
    },
  },
  mutations: {
    /** 设置请求列表数据的对象信息
     ---------------------------------------- */
    setCondition4List(state, [[key1, key2], value]) {
      if (!key2) state.condition4TraceRecordList[key1] = value;
      else state.condition4TraceRecordList[key1][key2] = value;
    },
    /** 重置清除请求对象信息
     ---------------------------------------- */
    clearCondition4List(state) {
      state.condition4TraceRecordList = new TraceRecordConditonClass();
    },
    transformCondition4RecordListDate(state) {
      CommonClassType.setDate(state.condition4TraceRecordList, 'AddTime');
    },
    setTraceRecordList(state, { Data, DataNumber }) {
      state.TraceRecordList = Data;
      if (DataNumber || DataNumber === 0) state.TraceRecordDataNumber = DataNumber;
    },
    setLoading(state, bool) {
      state.loading = bool;
    },
  },
  actions: {
    async getCustomerTrackLogList({ state, commit }, page = 1) {
      commit('setCondition4List', [['Page', ''], page]);
      commit('transformCondition4RecordListDate');
      const temp = CommonClassType.filter(state.condition4TraceRecordList, true);
      commit('setTraceRecordList', { Data: [], DataNumber: undefined });
      commit('setLoading', true);
      const resp = await api.getCustomerTrackLogList(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setTraceRecordList', resp.data);
      }
      commit('setLoading', false);
    },
  },
};
