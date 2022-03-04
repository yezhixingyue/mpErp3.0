import api from '@/api/index';
import ClassType from '../CommonClassType';
import FundBillClassType from './fundBillClassType';

export default {
  namespaced: true,
  state: {
    /* 客户余额流水类型筛选条件信息
    -------------------------------*/
    condition4BalanceType: new FundBillClassType('today'),
    /* 客户订单流水类型筛选条件信息
    -------------------------------*/
    condition4OrderType: new FundBillClassType('today'),
    /* 列表数据
    -------------------------------*/
    balanceTypeDataList: [],
    orderTypeDataList: [],
    /* 列表数据条数
    -------------------------------*/
    balanceTypeDataCount: 0,
    orderTypeDataCount: 0,
    /* 列表数据是否正在加载中
    -------------------------------*/
    isBalanceDataLoading: false,
    isOrderDataLoading: false,
  },
  getters: {
  },
  mutations: {
    /* 设置筛选条件
    -------------------------------*/
    setCondition4BalanceType(state, [[key1, key2], value]) {
      if (key2) state.condition4BalanceType[key1][key2] = value;
      else state.condition4BalanceType[key1] = value;
    },
    setCondition4OrderType(state, [[key1, key2], value]) {
      if (key2) state.condition4OrderType[key1][key2] = value;
      else state.condition4OrderType[key1] = value;
    },
    /* 设置列表数据
    -------------------------------*/
    setBalanceTypeDataList(state, [list, count]) {
      state.balanceTypeDataList = list;
      if (count || count === 0) state.balanceTypeDataCount = count;
    },
    setOrderTypeDataList(state, [list, count]) {
      state.orderTypeDataList = list;
      if (count || count === 0) state.orderTypeDataCount = count;
    },
    /* 设置请求时间
    -------------------------------*/
    setConditionDate4Balance(state) {
      FundBillClassType.setDate(state.condition4BalanceType);
    },
    setConditionDate4Order(state) {
      FundBillClassType.setDate(state.condition4OrderType);
    },
    /* 清除重置条件信息
    -------------------------------*/
    clearConditionDate4Balance(state) {
      state.condition4BalanceType = new FundBillClassType('today');
    },
    clearConditionDate4Order(state) {
      state.condition4OrderType = new FundBillClassType();
    },
    /* 设置列表数据是否正在加载中
    -------------------------------*/
    setIsBalanceDataLoading(state, bool) {
      state.isBalanceDataLoading = bool;
    },
    setIsOrderDataLoading(state, bool) {
      state.isOrderDataLoading = bool;
    },
  },
  actions: {
    async getCustomerBill({ state, commit }, page = 1) { // 获取客户余额流水数据
      commit('setCondition4BalanceType', [['Page', ''], page]);
      commit('setBalanceTypeDataList', [[], undefined]);
      commit('setConditionDate4Balance');
      commit('setIsBalanceDataLoading', true);
      const _obj = ClassType.filter(state.condition4BalanceType, true);
      const res = await api.getCustomerBill(_obj);
      commit('setIsBalanceDataLoading', false);
      if (res.data.Status === 1000) {
        commit('setBalanceTypeDataList', [res.data.Data, res.data.DataNumber]);
      }
    },
    async getCustomerOrderBill({ state, commit }, page = 1) { // 获取客户订单流水数据
      commit('setCondition4OrderType', [['Page', ''], page]);
      commit('setOrderTypeDataList', [[], undefined]);
      commit('setConditionDate4Order');
      commit('setIsOrderDataLoading', true);
      const _obj = ClassType.filter(state.condition4OrderType, true);
      const res = await api.getCustomerOrderBill(_obj);
      commit('setIsOrderDataLoading', false);
      if (res.data.Status === 1000) {
        commit('setOrderTypeDataList', [res.data.Data, res.data.DataNumber]);
      }
    },
  },
};
