/**
 * 状态管理 -- 印豆设置
 */
// import api from '@/api/index';
// import messageBox from '@/assets/js/utils/message';
import PrintBeanListClass from './PrintBeanListClass';

export default {
  namespaced: true,
  state: {
    PrintBeanListClassData: new PrintBeanListClass(),
  },
  getters: {
  },
  mutations: {
    setList(state, [list, num]) { // 设置列表数据
      state.PrintBeanListClassData.setList([list, num]);
    },
    setCondition(state, [[key1, key2], value]) {
      state.PrintBeanListClassData.setCondition([[key1, key2], value]);
    },
    clearCondition(state) {
      state.PrintBeanListClassData.clearCondition();
    },
    setLoading(state, bool) {
      state.PrintBeanListClassData.setLoading(bool);
    },
    setItemChange(state, data) { // { item, isEdit, isRemove, index }
      state.PrintBeanListClassData.setItemChange(data);
    },
  },
  actions: {
    getPrintBeanList({ state, commit }, Page = 1) {
      commit('setCondition', [['Page'], Page]);
      commit('setList', [[]]);
      const setLoading = (bool) => {
        commit('setLoading', bool);
      };
      const setList = (data) => {
        commit('setList', data);
      };
      state.PrintBeanListClassData.getList(setLoading, setList);
    },
  },
};
