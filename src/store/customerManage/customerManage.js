import { getFormatDateString } from '@/assets/js/utils/util';
import messageBox from '../../assets/js/utils/message';
import api from '../../api';
import ConditionClass4CustomerDataList from './Condition4DataList';
import CommonClassType from '../CommonClassType';

export default {
  namespaced: true,
  state: {
    /* 客户列表相关
    -------------------------------*/
    condition4DataList: new ConditionClass4CustomerDataList(),
    customerDataList: [],
    customerDataNumber: 0,
    loading: false,
  },
  getters: {
  },
  mutations: {
    /* 客户列表相关
    -------------------------------*/
    setCustomerDataList(state, { Data, DataNumber } = {}) { // 设置列表数据
      state.customerDataList = Data || [];
      if (DataNumber || DataNumber === 0) state.customerDataNumber = DataNumber;
    },
    setCustomerItemSave(state, [CustomerItem, isEdit]) { // 客户新增 或 保存
      if (!CustomerItem) return;
      if (isEdit) { // 编辑
        const i = state.customerDataList.findIndex(it => it.CustomerID === CustomerItem.CustomerID);
        if (i > -1) state.customerDataList.splice(i, 1, CustomerItem);
      } else { // 新增
        const temp = { ...CustomerItem, RegTime: getFormatDateString() };
        if (this.state.common?.Permission?.StaffName) temp.AuthenInfo.CheckUser.StaffName = this.state.common.Permission.StaffName;
        state.customerDataList.unshift(temp);
        state.customerDataNumber += 1;
      }
    },
    setCustomerItemRemove(state, CustomerID) {
      const i = state.customerDataList.findIndex(it => it.CustomerID === CustomerID);
      if (i > -1) {
        state.customerDataList.splice(i, 1);
        state.customerDataNumber -= 1;
      }
    },
    setCustomerItemStatusChange(state, [CustomerID, Status]) { // 修改客户状态 冻结|解冻
      const t = state.customerDataList.find(it => it.CustomerID === CustomerID);
      if (t) t.Status = Status;
    },
    setCustomerItemAmountChange(state, [CustomerID, increment]) { // 充值扣款操作
      const t = state.customerDataList.find(it => it.CustomerID === CustomerID);
      if (t) t.FundInfo.Amount = +t.FundInfo.Amount + +increment;
    },
    setCondition2DataList(state, [[key1, key2], value]) { // 设置列表筛选条件
      if (!key2) state.condition4DataList[key1] = value;
      else state.condition4DataList[key1][key2] = value;
    },
    clearCondition2DataList(state) { // 清除筛选条件
      state.condition4DataList = new ConditionClass4CustomerDataList();
    },
    setLoading(state, bool) { // 设置loading
      state.loading = bool || false;
    },
  },
  actions: {
    /* 客户列表相关
    -------------------------------*/
    async getCustomerDataList({ state, commit }, Page = 1) { // 获取客户列表数据
      commit('setCustomerDataList');
      commit('setCondition2DataList', [['Page'], Page]);
      commit('setLoading', true);
      const temp = CommonClassType.filter(state.condition4DataList, true);
      const resp = await api.getCustomerList(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        commit('setCustomerDataList', resp.data);
      }
      commit('setLoading', false);
    },
    async getCustomerRemove({ commit }, CustomerID) { // 客户删除
      const resp = await api.getCustomerRemove(CustomerID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setCustomerItemRemove', CustomerID);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
};
