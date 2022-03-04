// import CommonClassType from '@/store/CommonClassType';
import messageBox from '@/assets/js/utils/message';
import { getFormatDateString } from '@/assets/js/utils/util';
import api from '../../api';
import ProductionPeriodConditionClass from './ConditionClass/ProductionPeriodConditionClass';
import PayTimeConditionClass from './ConditionClass/PayTimeConditionClass';
import DeliveryTimeConditionClass from './ConditionClass/DeliveryTimeConditionClass';
import DispatchTimeConditionClass from './ConditionClass/DispatchTimeConditionClass';
import SpecialDayConditionClass from './ConditionClass/SpecialDayConditionClass';
import ProduceSpecialDayConditionClass from './ConditionClass/ProduceSpecialDayConditionClass';
import CommonClassType from '../CommonClassType';
import { SpecialTypeEnums } from './ItemClass/SpecialDayItemClass';

export default {
  namespaced: true,
  state: {
    /** 通用状态
    ---------------------------------------- */
    loading: false, // 通用loading状态

    /** 付款时间管理相关
    ---------------------------------------- */
    Condition4PayTimeList: new PayTimeConditionClass(),
    PayTimeDataList: [], // 列表数据
    PayTimeDataNumber: 0, // 列表数据条目数 分页使用

    /** 生产工期相关
    ---------------------------------------- */
    condition4RootDataList: new ProductionPeriodConditionClass(), // 获取列表数据的条件
    curSetupProductIndex: -1, // 当前正在设置的工期产品索引值
    RootDataList: [], // 产品生产工期列表数据
    curEditFormulaData: null, // 工期组成 ----------- 与总工期共用
    PeriodItemFormulaList: [], // 工期组成列表数据 及 总工期列表数据
    PeriodItemConditionPropertyList: [], // 工期组成条件属性列表数据 及 总工期条件属性列表数据

    /** 发货班次管理相关
    ---------------------------------------- */
    Condition4DeliveryTimeList: new DeliveryTimeConditionClass(),
    DeliveryTimeDataList: [], // 列表数据
    DeliveryTimeDataNumber: 0, // 列表数据条目数 分页使用

    /** 派件时间管理相关
    ---------------------------------------- */
    Condition4DispatchTimeList: new DispatchTimeConditionClass(),
    DispatchTimeDataList: [], // 列表数据
    DispatchTimeDataNumber: 0, // 列表数据条目数 分页使用

    /** 生产特殊情况管理相关
    ---------------------------------------- */
    Condition4ProduceSpecialDayList: new ProduceSpecialDayConditionClass(),
    ProduceSpecialDayDataList: [], // 列表数据
    ProduceSpecialDayDataNumber: 0, // 列表数据条目数 分页使用

    /** 运输特殊情况管理相关
    ---------------------------------------- */
    Condition4SpecialDayList: new SpecialDayConditionClass(),
    SpecialDayDataList: [], // 列表数据
    SpecialDayDataNumber: 0, // 列表数据条目数 分页使用

  },
  getters: {
    curSetupProduct(state) { // 生产工期 当前正在选中的生产工期产品
      if (state.curSetupProductIndex === -1 || state.RootDataList.length === 0 || !state.RootDataList[state.curSetupProductIndex]) return null;
      return state.RootDataList[state.curSetupProductIndex];
    },
  },
  mutations: {
    /** 付款时间管理相关
    ---------------------------------------- */
    clearCondition4PayTimeList(state) {
      state.Condition4PayTimeList = new PayTimeConditionClass();
    },
    setCondition4PayTimeList(state, [[key1, key2], value]) {
      if (!key2) state.Condition4PayTimeList[key1] = value;
      else state.Condition4PayTimeList[key1][key2] = value;
    },
    setPayTimeItemSave(state, [data, ItemID]) { // 付款时间编辑与添加
      if (!data.ItemID) { // 添加
        state.PayTimeDataList.unshift({ ...data, ItemID });
        state.PayTimeDataNumber += 1;
      } else { // 编辑
        const i = state.PayTimeDataList.findIndex(it => it.ItemID === ItemID);
        if (i > -1) {
          state.PayTimeDataList.splice(i, 1, data);
        }
      }
    },
    setPayTimeDataList(state, { Data, DataNumber }) { // 设置列表数据
      state.PayTimeDataList = Data || [];
      state.PayTimeDataNumber = DataNumber || 0;
    },
    setPayTimeItemRemove(state, ItemID) { // 删除付款时间项目
      const i = state.PayTimeDataList.findIndex(it => it.ItemID === ItemID);
      if (i > -1) {
        state.PayTimeDataList.splice(i, 1);
        state.PayTimeDataNumber -= 1;
      }
    },
    /** 设置生成工期请求根列表数据的对象信息
    ---------------------------------------- */
    setCondition4RootList(state, [[key1, key2], value]) {
      if (!key2) state.condition4RootDataList[key1] = value;
      else state.condition4RootDataList[key1][key2] = value;
    },
    setRootDataList(state, list) {
      state.RootDataList = list || [];
    },
    setCurSetupProductIndex(state, productIndex) {
      state.curSetupProductIndex = productIndex;
      state.curEditFormulaData = null;
      state.PeriodItemFormulaList = [];
      state.PeriodItemConditionPropertyList = [];
    },
    clearCondition4RootDataList(state) {
      state.condition4RootDataList = new ProductionPeriodConditionClass();
    },
    /** 工期组成方案发生变动
    ---------------------------------------- */
    setCompositionSolutionSave(state, item) { // 仅变动Name值
      const targetProduct = state.RootDataList[state.curSetupProductIndex];
      if (targetProduct) {
        if (!targetProduct.PeriodItemList) targetProduct.PeriodItemList = [];
        const t = targetProduct.PeriodItemList.find(it => it.ID === item.ID);
        if (t) {
          const _t = t;
          _t.Name = item.Name; // 仅变动Name值
        } else {
          targetProduct.PeriodItemList.push(item);
        }
      }
    },
    setCompositionSolutionRemove(state, ID) {
      const targetProduct = state.RootDataList[state.curSetupProductIndex];
      if (targetProduct && targetProduct.PeriodItemList) {
        targetProduct.PeriodItemList = targetProduct.PeriodItemList.filter(it => it.ID !== ID);
        state.PeriodItemFormulaList = [];
      }
    },
    /** 工期组成与总工期 共用方法
    ---------------------------------------- */
    setLoading(state, bool) { // 设置loading
      state.loading = bool;
    },
    setCurEditFormulaData(state, data) { // 设置当前正在编辑的公式数据 工期组成 与 总工期共用
      state.curEditFormulaData = data;
    },
    setPeriodItemFormulaList(state, [FormulaList, FormulaPropertyList]) {
      state.PeriodItemFormulaList = FormulaList || [];
      state.PeriodItemConditionPropertyList = FormulaPropertyList || [];
    },
    setPeriodItemFormulaListItemChange(state, { isEdit, data, ID, isTotal }) { // 工期组成中公式的编辑与添加处理
      if (isEdit) {
        const i = state.PeriodItemFormulaList.findIndex(it => it.ID === ID);
        if (i > -1) {
          state.PeriodItemFormulaList.splice(i, 1, data);
        }
      } else {
        state.PeriodItemFormulaList.unshift({ ...data, ID });
      }
      // 对root列表数据进行修改
      if (isTotal) state.RootDataList[state.curSetupProductIndex].TotalPeriodList = state.PeriodItemFormulaList;
      // 数据格式不同 工期组成数据未使用到 暂不进行同步修改
      // const key = isTotal ? 'TotalPeriodList' : 'PeriodItemList';
      // state.RootDataList[state.curSetupProductIndex][key] = state.PeriodItemFormulaList;
    },
    setPeriodItemFormulaListItemRemove(state, { ID, isTotal }) { // 工期组成公式删除
      state.PeriodItemFormulaList = state.PeriodItemFormulaList.filter(it => it.ID !== ID);
      if (isTotal) state.RootDataList[state.curSetupProductIndex].TotalPeriodList = state.PeriodItemFormulaList;
      // const key = isTotal ? 'TotalPeriodList' : 'PeriodItemList'; // 注释原因同上
      // state.RootDataList[state.curSetupProductIndex][key] = state.PeriodItemFormulaList;
    },

    /** 发货班次管理相关
    ---------------------------------------- */
    clearCondition4DeliveryTimeList(state) {
      state.Condition4DeliveryTimeList = new DeliveryTimeConditionClass();
    },
    setCondition4DeliveryTimeList(state, [[key1, key2], value]) {
      if (!key2) state.Condition4DeliveryTimeList[key1] = value;
      else state.Condition4DeliveryTimeList[key1][key2] = value;
    },
    setDeliveryTimeItemSave(state, [data, ItemID]) { // 发货班次编辑与添加
      if (!data.ItemID) { // 添加
        state.DeliveryTimeDataList.unshift({ ...data, ItemID });
        state.DeliveryTimeDataNumber += 1;
      } else { // 编辑
        const i = state.DeliveryTimeDataList.findIndex(it => it.ItemID === ItemID);
        if (i > -1) {
          state.DeliveryTimeDataList.splice(i, 1, data);
        }
      }
    },
    setDeliveryTimeDataList(state, { Data, DataNumber }) { // 设置列表数据
      state.DeliveryTimeDataList = Data || [];
      state.DeliveryTimeDataNumber = DataNumber || 0;
    },
    setDeliveryTimeItemRemove(state, ItemID) { // 删除发货班次项目
      const i = state.DeliveryTimeDataList.findIndex(it => it.ItemID === ItemID);
      if (i > -1) {
        state.DeliveryTimeDataList.splice(i, 1);
        state.DeliveryTimeDataNumber -= 1;
      }
    },

    /** 派件时间管理相关
    ---------------------------------------- */
    clearCondition4DispatchTimeList(state) {
      state.Condition4DispatchTimeList = new DispatchTimeConditionClass();
    },
    setCondition4DispatchTimeList(state, [[key1, key2], value]) {
      if (!key2) state.Condition4DispatchTimeList[key1] = value;
      else state.Condition4DispatchTimeList[key1][key2] = value;
    },
    setDispatchTimeItemSave(state, [data, ItemID]) { // 派件时间编辑与添加
      if (!data.ItemID) { // 添加
        state.DispatchTimeDataList.unshift({ ...data, ItemID });
        state.DispatchTimeDataNumber += 1;
      } else { // 编辑
        const i = state.DispatchTimeDataList.findIndex(it => it.ItemID === ItemID);
        if (i > -1) {
          state.DispatchTimeDataList.splice(i, 1, data);
        }
      }
    },
    setDispatchTimeDataList(state, { Data, DataNumber }) { // 设置列表数据
      state.DispatchTimeDataList = Data || [];
      state.DispatchTimeDataNumber = DataNumber || 0;
    },
    setDispatchTimeItemRemove(state, ItemID) { // 删除派件时间项目
      const i = state.DispatchTimeDataList.findIndex(it => it.ItemID === ItemID);
      if (i > -1) {
        state.DispatchTimeDataList.splice(i, 1);
        state.DispatchTimeDataNumber -= 1;
      }
    },

    /** 生产特殊情况管理相关
    ---------------------------------------- */
    clearCondition4ProduceSpecialDayList(state) { // 清除列表条件
      state.Condition4ProduceSpecialDayList = new ProduceSpecialDayConditionClass();
    },
    setCondition4ProduceSpecialDayList(state, [[key1, key2], value]) {
      if (!key2) state.Condition4ProduceSpecialDayList[key1] = value;
      else state.Condition4ProduceSpecialDayList[key1][key2] = value;
    },
    setProduceSpecialDayItemSave(state, [data, ItemID]) { // 生产特殊情况编辑与添加
      const temp = { ...data };
      if (this.state.common?.Permission?.StaffName) temp.OperatorUserName = this.state.common.Permission.StaffName;
      // 生成ProductString
      const defaultProps = { FirstLevelID: 'ClassID', SecondLevelID: 'TypeID', ProductID: 'ProductID' };
      const ProductString = CommonClassType.generateProductString(temp.ProductList, this.getters['common/allProductClassify'], defaultProps);
      if (!data.ItemID) { // 添加
        temp.AddTime = getFormatDateString();
        state.ProduceSpecialDayDataList.unshift({ ...temp, ItemID, ProductString });
        state.ProduceSpecialDayDataNumber += 1;
      } else { // 编辑
        const i = state.ProduceSpecialDayDataList.findIndex(it => it.ItemID === ItemID);
        if (i > -1) {
          const { AddTime } = state.ProduceSpecialDayDataList[i];
          state.ProduceSpecialDayDataList.splice(i, 1, { ...temp, AddTime, ProductString });
        }
      }
    },
    setProduceSpecialDayDataList(state, { Data, DataNumber }) { // 设置列表数据
      state.ProduceSpecialDayDataList = Data || [];
      state.ProduceSpecialDayDataNumber = DataNumber || 0;
    },
    setProduceSpecialDayItemRemove(state, ItemID) { // 删除生产特殊情况项目
      const i = state.ProduceSpecialDayDataList.findIndex(it => it.ItemID === ItemID);
      if (i > -1) {
        state.ProduceSpecialDayDataList.splice(i, 1);
        state.ProduceSpecialDayDataNumber -= 1;
      }
    },

    /** 运输特殊情况管理相关
    ---------------------------------------- */
    clearCondition4SpecialDayList(state) {
      state.Condition4SpecialDayList = new SpecialDayConditionClass();
    },
    setCondition4SpecialDayList(state, [[key1, key2], value]) {
      if (!key2) state.Condition4SpecialDayList[key1] = value;
      else state.Condition4SpecialDayList[key1][key2] = value;
    },
    setSpecialDayItemSave(state, [data, ItemID]) { // 运输特殊情况编辑与添加
      const temp = { ...data };
      if (this.state.common?.Permission?.StaffName) temp.OperatorUserName = this.state.common.Permission.StaffName;
      if (!data.ItemID) { // 添加
        temp.AddTime = getFormatDateString();
        if (!temp.StartTime) temp.StartTime = temp.AddTime;
        state.SpecialDayDataList.unshift({ ...temp, ItemID });
        state.SpecialDayDataNumber += 1;
      } else { // 编辑
        const i = state.SpecialDayDataList.findIndex(it => it.ItemID === ItemID);
        if (i > -1) {
          const { StartTime, AddTime, SpecialType } = state.SpecialDayDataList[i];
          let _StartTime = temp.StartTime || StartTime;
          if (SpecialType === SpecialTypeEnums.delay.value && temp.SpecialType === SpecialTypeEnums.stop.value) {
            _StartTime = getFormatDateString();
          }
          state.SpecialDayDataList.splice(i, 1, { ...temp, AddTime, StartTime: _StartTime });
        }
      }
    },
    setSpecialDayDataList(state, { Data, DataNumber }) { // 设置列表数据
      state.SpecialDayDataList = Data || [];
      state.SpecialDayDataNumber = DataNumber || 0;
    },
    setSpecialDayItemRemove(state, ItemID) { // 删除运输特殊情况项目
      const i = state.SpecialDayDataList.findIndex(it => it.ItemID === ItemID);
      if (i > -1) {
        state.SpecialDayDataList.splice(i, 1);
        state.SpecialDayDataNumber -= 1;
      }
    },
  },
  actions: {
    /** 付款时间相关
    ---------------------------------------- */
    async getPayTimeItemSave({ commit }, [data, cbFunc]) { // 保存付款时间
      const resp = await api.getPayTimeSave(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const title = data.ItemID ? '编辑成功' : '添加成功';
        const cb = () => {
          commit('setPayTimeItemSave', [data, resp.data.Data]);
          if (cbFunc) cbFunc();
        };
        messageBox.successSingle(title, cb, cb);
      }
    },
    async getPayTimeDataList({ state, commit }, page = 1) {
      commit('setPayTimeDataList', { Data: [], DataNumber: state.PayTimeDataNumber });
      commit('setCondition4PayTimeList', [['Page', ''], page]);
      const temp = CommonClassType.filter(state.Condition4PayTimeList);
      commit('setLoading', true);
      const resp = await api.getPayTimeList(temp).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setPayTimeDataList', resp.data);
      }
    },
    async getPayTimeItemRemove({ commit }, { ItemID }) {
      const resp = await api.getPayTimeRemove(ItemID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setPayTimeItemRemove', ItemID);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    /** 生产工期相关
    ---------------------------------------- */
    async getRootDataList({ state, commit }) { // 生产工期列表
      const { typeID } = state.condition4RootDataList;
      if (!typeID && typeID !== 0) return;
      commit('setLoading', true);
      const resp = await api.getWorkPeriodProducePeriodList(typeID).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setRootDataList', resp.data.Data);
      } else {
        commit('setRootDataList', []);
      }
    },
    async getPeriodItemFormulaList({ state, commit }, data) { // 获取工期方案列表公式 ---------- 与总工期列表共用
      const { params4FormulaList, params4FormulaConditionPropertyList, isNewItemCreate } = data;
      commit('setLoading', true);
      const fetchDataList = async ({ func, params, list, isReturnEmptyArr }) => {
        if (isReturnEmptyArr) return [];
        if (list && list.length > 0) return list;
        const resp = await func(params).catch(() => {});
        if (resp && resp.status === 200 && resp.data.Status === 1000) {
          return resp.data.Data;
        }
        return [];
      };
      const [FormulaList, FormulaPropertyList] = await Promise.all([
        fetchDataList({ func: api.getFormulaList, params: params4FormulaList, isReturnEmptyArr: isNewItemCreate }),
        fetchDataList({ func: api.getFormulaPropertyList, params: params4FormulaConditionPropertyList, list: state.PeriodItemConditionPropertyList }),
      ]);
      commit('setLoading', false);
      commit('setPeriodItemFormulaList', [FormulaList, FormulaPropertyList]);
    },
    async getPeriodItemFormulaRemove({ commit }, { ID, isTotal }) { // 工期条目删除 ----------- 工期组成与总工期共用
      if (!ID) return;
      const resp = await api.getFormulaRemove(ID).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => {
          commit('setPeriodItemFormulaListItemRemove', { ID, isTotal });
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    /** 发货班次相关
    ---------------------------------------- */
    async getDeliveryTimeItemSave({ commit }, [data, cbFunc]) { // 保存发货班次
      const resp = await api.getShiftTimeSave(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const title = data.ItemID ? '编辑成功' : '添加成功';
        const cb = () => {
          commit('setDeliveryTimeItemSave', [data, resp.data.Data]);
          if (cbFunc) cbFunc();
        };
        messageBox.successSingle(title, cb, cb);
      }
    },
    async getDeliveryTimeDataList({ state, commit }, page = 1) {
      commit('setDeliveryTimeDataList', { Data: [], DataNumber: state.DeliveryTimeDataNumber });
      commit('setCondition4DeliveryTimeList', [['Page', ''], page]);
      const temp = CommonClassType.filter(state.Condition4DeliveryTimeList);
      commit('setLoading', true);
      const resp = await api.getShiftTimeList(temp).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setDeliveryTimeDataList', resp.data);
      }
    },
    async getDeliveryTimeItemRemove({ commit }, { ItemID }) {
      const resp = await api.getShiftTimeRemove(ItemID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setDeliveryTimeItemRemove', ItemID);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    /** 派件时间相关
    ---------------------------------------- */
    async getDispatchTimeItemSave({ commit }, [data, cbFunc]) { // 保存派件时间
      const resp = await api.getDispatchTimeSave(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const title = data.ItemID ? '编辑成功' : '添加成功';
        const cb = () => {
          commit('setDispatchTimeItemSave', [data, resp.data.Data]);
          if (cbFunc) cbFunc();
        };
        messageBox.successSingle(title, cb, cb);
      }
    },
    async getDispatchTimeDataList({ state, commit }, page = 1) {
      commit('setDispatchTimeDataList', { Data: [], DataNumber: state.DispatchTimeDataNumber });
      commit('setCondition4DispatchTimeList', [['Page', ''], page]);
      const temp = CommonClassType.filter(state.Condition4DispatchTimeList);
      commit('setLoading', true);
      const resp = await api.getDispatchTimeList(temp).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setDispatchTimeDataList', resp.data);
      }
    },
    async getDispatchTimeItemRemove({ commit }, { ItemID }) {
      const resp = await api.getDispatchTimeRemove(ItemID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setDispatchTimeItemRemove', ItemID);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    /** 生产特殊情况相关
    ---------------------------------------- */
    async getProduceSpecialDayItemSave({ commit }, [data, cbFunc]) { // 保存运输特殊情况
      const resp = await api.getProduceSpecialDaySave(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const title = data.ItemID ? '编辑成功' : '添加成功';
        const cb = () => {
          commit('setProduceSpecialDayItemSave', [data, resp.data.Data]);
          if (cbFunc) cbFunc();
        };
        messageBox.successSingle(title, cb, cb);
      }
    },
    async getProduceSpecialDayDataList({ state, commit }, page = 1) {
      commit('setProduceSpecialDayDataList', { Data: [], DataNumber: state.SpecialDayDataNumber });
      commit('setCondition4ProduceSpecialDayList', [['Page', ''], page]);
      const temp = CommonClassType.filter(state.Condition4ProduceSpecialDayList);
      commit('setLoading', true);
      const resp = await api.getProduceSpecialDayList(temp).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setProduceSpecialDayDataList', resp.data);
      }
    },
    async getProduceSpecialDayItemRemove({ commit }, { ItemID }) {
      const resp = await api.getProduceSpecialDayRemove(ItemID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setProduceSpecialDayItemRemove', ItemID);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    /** 运输特殊情况相关
    ---------------------------------------- */
    async getSpecialDayItemSave({ commit }, [data, cbFunc]) { // 保存运输特殊情况
      const resp = await api.getSpecialDaySave(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const title = data.ItemID ? '编辑成功' : '添加成功';
        const cb = () => {
          commit('setSpecialDayItemSave', [data, resp.data.Data]);
          if (cbFunc) cbFunc();
        };
        messageBox.successSingle(title, cb, cb);
      }
    },
    async getSpecialDayDataList({ state, commit }, page = 1) {
      commit('setSpecialDayDataList', { Data: [], DataNumber: state.SpecialDayDataNumber });
      commit('setCondition4SpecialDayList', [['Page', ''], page]);
      const temp = CommonClassType.filter(state.Condition4SpecialDayList);
      commit('setLoading', true);
      const resp = await api.getSpecialDayList(temp).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setSpecialDayDataList', resp.data);
      }
    },
    async getSpecialDayItemRemove({ commit }, { ItemID }) {
      const resp = await api.getSpecialDayRemove(ItemID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setSpecialDayItemRemove', ItemID);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
};
