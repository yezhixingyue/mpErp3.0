import api from '../../api';
import ConditionClass from './List/ConditionClass';
import CommonClassType from '../CommonClassType';

export default {
  namespaced: true,
  state: {
    conditionForDataList: new ConditionClass(),
    DataList: [],
    DataNumber: 0,
    loading: false,
    curItemData: null,
    curItemOriginData: null,
  },
  getters: {
  },
  mutations: {
    /**
     * 列表相关
     */
    clearConditonForDataList(state) { // 清空筛选项
      state.conditionForDataList = new ConditionClass();
    },
    setConditonForDataList(state, [[key1, key2], val]) { // 设置条件
      if (key2) {
        state.conditionForDataList[key1][key2] = val;
      } else {
        state.conditionForDataList[key1] = val;
      }
    },
    setLoading(state, bool) {
      state.loading = bool;
    },
    setDataList(state, [list, total]) { // 设置列表数据
      state.DataList = list || [];
      if (typeof total === 'number') state.DataNumber = total;
    },
    setListItemChange(state, [itemData, ID]) {
      if (itemData.ID) { // 编辑
        const i = state.DataList.findIndex(it => it.ID === ID);
        if (i > -1) state.DataList.splice(i, 1, itemData);
      } else { // 新增
        state.DataList.unshift({ ...itemData, ID });
        state.DataNumber += 1;
      }
    },
    setListItemRemove(state, i) {
      state.DataList.splice(i, 1);
      state.DataNumber -= 1;
    },
    /**
     * 单条设置相关
     */
    setCurItemData(state, [originData, data]) { // 设置当前正在设置的数据
      state.curItemData = data;
      state.curItemOriginData = originData;
    },
    setAllPropertyList(state, arr) {
      if (state.curItemData) state.curItemData._allPropertyList = arr;
    },
    setCurItemDataChange(state, [key, val, key2]) { // 数据内容修改变动
      if (!state.curItemData) return;
      if (!key2) {
        state.curItemData[key] = val;
      } else {
        state.curItemData[key][key2] = val;
      }
    },
    setCurItemDataAddNewRightItem(state) { // 添加返现规则
      state.curItemData.addNewRightItem();
    },
    setCurItemDataRightItemRemove(state, i) { // 删除返现规则
      state.curItemData.ItemList.splice(i, 1);
    },
    handleRightProductItemSetup(state, [data, i, level2Index]) { // 设置返现规则中的产品
      state.curItemData.setProductRangeItemForRightItem(data, i, level2Index);
    },
    handleRightProductItemRemove(state, [i, level2Index]) { // 删除返现规则中的产品条目
      state.curItemData.removeProductRangeItemForRightItem(i, level2Index);
    },
    handleRightReturnValueItemSetup(state, [data, i, level2Index]) { // 设置返现规则中的返现条目
      state.curItemData.setFundItemForRightItem(data, i, level2Index);
    },
    handleRightReturnValueItemRemove(state, [i, level2Index]) { // // 删除返现规则中的返现条目
      state.curItemData.removeFundItemForRightItem(i, level2Index);
    },
    handleRightProductConditionSetup(state, [Constraint, i, level2Index]) { // 设置返现规则中的产品筛选条件
      state.curItemData.setConstraintForRightItem(Constraint, i, level2Index);
    },
    addItemToAllPropertyList(state, item) { // 缓存属性列表
      state.curItemData.addItemToAllPropertyList(item);
    },
  },
  actions: {
    async getConsumeReturnCashList({ state, commit }, Page = 1) { // 获取列表数据
      commit('setConditonForDataList', [['Page'], Page]);
      const _condition = CommonClassType.filter(state.conditionForDataList, true);
      commit('setDataList', [[]]);
      commit('setLoading', true);
      const resp = await api.getConsumeReturnCashList(_condition).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setDataList', [resp.data.Data, resp.data.DataNumber]);
      }
    },
    async submitCashBackSave({ commit }, [itemData, cb]) { // 保存
      const resp = await api.getConsumeReturnCashSave(itemData).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        // 在此处完成对列表数据的修改
        commit('setListItemChange', [itemData, resp.data.Data]);
        cb();
      }
    },
    async getAllPropertyList({ state, commit }) {
      const arr = await state.curItemData.getAllPropertyList();
      commit('setAllPropertyList', arr);
    },
  },
};
