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
    setCustomerItemCustomerFreezeInfoChange(state, [CustomerID, CustomerFreezeInfo]) { // 修改客户状态 冻结|解冻
      const t = state.customerDataList.find(it => it.CustomerID === CustomerID);
      if (t) t.CustomerFreezeInfo = CustomerFreezeInfo;
    },
    setCustomerItemAmountChange(state, [CustomerID, increment]) { // 充值扣款操作
      const t = state.customerDataList.find(it => it.CustomerID === CustomerID);
      if (t) t.FundInfo.Amount = +t.FundInfo.Amount + +increment;
    },
    setCustomerItemPriceChange(state, [CustomerID, data]) { // 设置价格
      if (!data) return;
      const t = state.customerDataList.find(it => it.CustomerID === CustomerID);
      if (t) {
        const { PolicyList, FundInfo } = data;
        if (Array.isArray(PolicyList)) {
          t.PolicyList = JSON.parse(JSON.stringify(PolicyList));
        }
        if (FundInfo) {
          const { CashBackType, MinAmount, BackPercent } = FundInfo;
          if (CashBackType || CashBackType === 0) t.FundInfo.CashBackType = +CashBackType;
          if (MinAmount || MinAmount === 0) t.FundInfo.MinAmount = +MinAmount;
          if (BackPercent || BackPercent === 0) t.FundInfo.BackPercent = +BackPercent;
        }
      }
    },
    setCustomerShopSetup(state, { CustomerID, ShopItemData }) {
      const t = state.customerDataList.find(it => it.CustomerID === CustomerID);
      if (t) {
        const { Name, ShopId } = ShopItemData;
        t.ShopIDString = ShopId;
        t.ShopName = Name;
      }
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
    setDate(state) {
      CommonClassType.setDate(state.condition4DataList, 'RegDate');
    },
  },
  actions: {
    /* 客户列表相关
    -------------------------------*/
    async getCustomerDataList({ state, commit }, Page = 1) { // 获取客户列表数据
      commit('setCustomerDataList');
      commit('setCondition2DataList', [['Page'], Page]);
      commit('setLoading', true);
      // 设置时间
      commit('setDate');
      // 因为使用了 RegDate 作为中转所以要重新赋值
      commit('setCondition2DataList', [['RegTime', 'key'], state.condition4DataList.RegDate.First]);
      commit('setCondition2DataList', [['RegTime', 'value'], state.condition4DataList.RegDate.Second]);
      // commit('setCondition2DataList', [['RegDate', ''], {}]);
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
