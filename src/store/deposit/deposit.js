/**
 * 状态管理 -- 定金设置
 */
import api from '@/api/index';
import messageBox from '@/assets/js/utils/message';
import ObjForListDataClassType from './objForListDataClassType';

export default {
  namespaced: true,
  state: {
    /* 列表数据请求对象
    ---------------------------------------- */
    objForListData: {
      Product: {
        classID: '',
        typeID: '',
      },
    },
    /* 增加定金设置请求对象
    ---------------------------------------- */
    objForDepositAdd: new ObjForListDataClassType(),
    /* 定金列表数据
    ---------------------------------------- */
    listData: [],
    /** 表格数据是否处于加载状态
    ---------------------------------------- */
    tableDataLoading: false,
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
    ---------------------------------------- */
    setObjForListData(state, [[key1, key2], value]) {
      if (!key2) state.objForListData[key1] = value;
      else state.objForListData[key1][key2] = value;
    },
    /* 设置增加定金设置请求对象
    ---------------------------------------- */
    setObjForDepositAdd(state, [[key1, key2], value]) {
      if (!key2) state.objForDepositAdd[key1] = value;
      else state.objForDepositAdd[key1][key2] = value;
    },
    /* 清除增加定金设置请求对象
    ---------------------------------------- */
    clearObjForDepositAdd(state) {
      state.objForDepositAdd = ObjForListDataClassType.clear();
    },
    clearObjForListData(state) {
      state.objForListData = {
        Product: {
          classID: '',
          typeID: '',
        },
      };
    },
    /* 设置定金列表数据
    ---------------------------------------- */
    setListData(state, data) {
      state.listData = data;
    },
    /* 控制表格文件是否在加载中
    ---------------------------------------- */
    setTableDataLoading(state, bool) {
      state.tableDataLoading = bool;
    },
    backfillObjForDepositAdd(state, date) {
      state.objForDepositAdd = ObjForListDataClassType.backfill(date);
    },
    /* 删除定金设置列表数据
    ---------------------------------------- */
    removeDepositListData(state, index) {
      state.listData.splice(index, 1);
    },
  },
  actions: {
    async SaveDeposit({ state }, callback) {
      if (!ObjForListDataClassType.check(state.objForDepositAdd)) return;
      const _obj = ObjForListDataClassType.filter(state.objForDepositAdd);
      const res = await api.SaveDeposit(_obj);
      if (res.data.Status === 1000) {
        callback();
      }
    },
    async getDepositList({ state, commit }) {
      const _obj = state.objForListData;
      commit('setListData', []);
      commit('setTableDataLoading', true);
      const res = await api.getDepositList(_obj);
      commit('setTableDataLoading', false);
      if (res.data.Status === 1000) commit('setListData', res.data.Data);
    },
    async removeDepositSetting({ commit }, [ID, index]) {
      const res = await api.removeDepositSetting(ID);
      if (res.data.Status === 1000) {
        messageBox.successSingle('删除成功!', () => { commit('removeDepositListData', index); }, () => { commit('removeDepositListData', index); });
      }
    },
  },
};
