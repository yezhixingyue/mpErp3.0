import api from '@/api/index';
import CommonClassType from '@/store/CommonClassType';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

const _condition = {
  SellArea: { // 销售区域
    RegionalID: '',
    CityID: '',
    CountyID: '',
  },
  CustomerType: { // 客户类型和等级
    First: '',
    Second: '',
  },
  CreateTime: { // 时间筛选
    First: `${ConvertTimeFormat(new Date())}T00:00:00.000Z`,
    Second: `${ConvertTimeFormat(new Date())}T23:59:59.997Z`,
  },
  ExpressType: '', // 配送方式
  Status: '', // 物流状态
  KeyWords: '', // 关键词搜索
  DateType: 'today',
  Page: 1,
  PageSize: 30,
  initDateText: '今天',
};

export default {
  namespaced: true,
  state: {
    packageDataList: [],
    packageDataNumber: 0,
    condition4DataList: JSON.parse(JSON.stringify(_condition)),
    isTableDataLoading: false,
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
    ---------------------------------------- */
    setCondition4DataList(state, [[key1, key2], value]) {
      if (!key2) state.condition4DataList[key1] = value;
      else state.condition4DataList[key1][key2] = value;
    },
    /** 设置请求列表数据 及 条目数量
     ---------------------------------------- */
    setPackageDataList(state, [list, count]) {
      state.packageDataList = list;
      if (!count && count !== 0) return;
      state.packageDataNumber = count;
    },
    /** 设置列表数据是否正在加载中
    ---------------------------------------- */
    setConditionDateFormat(state) {
      CommonClassType.setDate(state.condition4DataList, 'CreateTime');
    },
    /** 设置列表数据是否正在加载中
    ---------------------------------------- */
    setisTableDataLoading(state, bool) {
      state.isTableDataLoading = bool;
    },
    clearCondition4DataList(state) {
      state.condition4DataList = JSON.parse(JSON.stringify(_condition));
    },
  },
  actions: {
    async getPackageDataList({ state, commit }, page = 1) {
      // commit('setConditionDateFormat');
      commit('setCondition4DataList', [['Page', ''], page]);
      commit('setPackageDataList', [[], undefined]);
      const _obj = CommonClassType.filter(state.condition4DataList, true);
      commit('setisTableDataLoading', true);
      let key = true;
      const res = await api.getTransportList(_obj).catch(() => { key = false; });
      commit('setisTableDataLoading', false);
      if (key && res && res.status === 200 && res.data.Status === 1000) {
        commit('setPackageDataList', [res.data.Data, res.data.DataNumber]);
      }
    },
  },
};
