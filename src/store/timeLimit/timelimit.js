/**
 * 状态管理 -- 工期设置
 */
import api from '@/api/index';
import messageBox from '@/assets/js/utils/message';
import TimeLimitClass from './TimeLimitClass';
import SchemaItemClass from './SchemaItemClass';
import CraftPeriodClass from './CraftPeriodClass';


export default {
  namespaced: true,
  state: {
    /** 工期列表搜索条件
    ---------------------------------------------------- */
    searchCondition: {
      classID: 1,
    },
    /** 工期列表数据
    ---------------------------------------------------- */
    dataList: [],
    /** 工期增加对象数据
    ---------------------------------------------------- */
    TimeLimitData: null,
    /** 工期增加时 - [ 添加工期弹窗 ] - 数据
    ---------------------------------------------------- */
    SchemaItemData: null,
    /** 工期增加时 - [ 工艺工期弹窗数据 ]
    ---------------------------------------------------- */
    CraftPeriodItemData: null,
    /** 工期 产品 条件 数据
    ---------------------------------------------------- */
    ConditionList4ProducePeriodProduct: [],
    /** 工期 工艺 条件 数据
    ---------------------------------------------------- */
    ConditionList4ProducePeriodCraft: [],
    /** 设置页面打开类型： 编辑edit | 添加add
    ---------------------------------------------------- */
    setPageType: '',
    /** 列表页面 - 展开列表序号
    ---------------------------------------------------- */
    TimeLimitActiveNames: [],
  },
  getters: {
  },
  mutations: {
    /** 设置工期列表搜索条件
    ---------------------------------------------------- */
    setSearchCondition(state, [[key1, key2], value]) {
      if (!key2) state.searchCondition[key1] = value;
      else state.searchCondition[key1][key2] = value;
    },
    /** 设置工期列表数据
    ---------------------------------------------------- */
    setDataList(state, dataList) {
      state.dataList = dataList.map(it => {
        // let count = 0;
        // it.List.forEach(item => {
        //   count += item.RecordCount;
        // });
        const count = it.List.length;
        return { ...it, count };
      });
    },
    /** 初始化工期增加对象数据 - 新增方式（空白对象 - 编辑时或也可用 - 后面使用到时查看）
    ---------------------------------------------------- */
    // eslint-disable-next-line max-len
    setAddTimeLimitDataInit(state, { FirstLevelID, FirstLevelName, SecondLevelID, SecondLevelName, ID = '', ProductList = [], SchemaList = [], CraftPeriodList = [] }) {
      // eslint-disable-next-line max-len
      const _data = new TimeLimitClass({ FirstLevelID, FirstLevelName, SecondLevelID, SecondLevelName, ID, ProductList, SchemaList, CraftPeriodList });
      state.TimeLimitData = _data;
    },
    /** 设置工期增加对象数据
    ---------------------------------------------------- */
    setTimeLimitData(state, [key, value]) {
      state.TimeLimitData[key] = value;
    },
    /** 初始化设置工期增加时 - [ 添加工期弹窗 ] - 数据
    ---------------------------------------------------- */
    setSchemaItemDataInit(state, data) {
      state.SchemaItemData = new SchemaItemClass(data);
    },
    /** 设置 [ 添加工期弹窗 ] 数据
    ---------------------------------------------------- */
    changeSchemaItemData(state, [key, value]) {
      state.SchemaItemData[key] = value;
    },
    /** 设置工期 产品 条件 数据
    ---------------------------------------------------- */
    setConditionList4ProducePeriodProduct(state, dataList) {
      state.ConditionList4ProducePeriodProduct = dataList;
    },
    /** 工期 工艺 条件 数据
    ---------------------------------------------------- */
    setConditionList4ProducePeriodCraft(state, dataList) {
      state.ConditionList4ProducePeriodCraft = dataList;
    },
    /** 设置 [ 添加工期弹窗 ] 数据 中 [ 条件 ] 类型
    ---------------------------------------------------- */
    changeSchemaItemData4FilterType(state, num) {
      if (!state.SchemaItemData) return;
      state.SchemaItemData.Constraint.FilterType = num;
    },
    /** 添加 [ 添加工期弹窗 ] 数据 中 [ 条件 ] 子项目
    ---------------------------------------------------- */
    addSchemaItemData4Constraint(state, itemData) {
      if (!state.SchemaItemData) return;
      state.SchemaItemData.Constraint.ItemList.push(itemData);
    },
    /** 编辑 或 删除  [ 添加工期弹窗 ] 数据 中 [ 条件 ] 子项目
    ---------------------------------------------------- */
    editSchemaItemData4Constraint(state, [itemIndex, data]) {
      if (!state.SchemaItemData) return;
      if (data) {
        const _item = { ...state.SchemaItemData.Constraint.ItemList[itemIndex], ...data };
        state.SchemaItemData.Constraint.ItemList.splice(itemIndex, 1, _item);
      } else {
        state.SchemaItemData.Constraint.ItemList.splice(itemIndex, 1);
      }
    },
    /** 删除工期列表
    ---------------------------------------------------- */
    deleteTimeLimitSchemaItem(state, index) {
      state.TimeLimitData.SchemaList.splice(index, 1);
    },
    /** 初始化 工期增加时 - [ 工艺工期弹窗数据 ]
    ---------------------------------------------------- */
    setCraftPeriodItemDataInit(state, data) {
      state.CraftPeriodItemData = new CraftPeriodClass(data);
    },
    /** 设置 工期增加时 - [ 工艺工期弹窗数据 ]
    ---------------------------------------------------- */
    setCraftPeriodItemData(state, [key, value]) {
      state.CraftPeriodItemData[key] = value;
    },
    /** 编辑 或 删除  [ 工艺工期弹窗数据 ] 中 [ 条件 ] 子项目
    ---------------------------------------------------- */
    editCraftPeriodItemData4Constraint(state, [itemIndex, data]) {
      if (!state.CraftPeriodItemData) return;
      if (data) {
        const _item = { ...state.CraftPeriodItemData.Constraint.ItemList[itemIndex], ...data };
        state.CraftPeriodItemData.Constraint.ItemList.splice(itemIndex, 1, _item);
      } else {
        state.CraftPeriodItemData.Constraint.ItemList.splice(itemIndex, 1);
      }
    },
    /** 添加 [ 工艺工期弹窗数据 ] 中 [ 条件 ] 子项目
    ---------------------------------------------------- */
    addCraftPeriodItemData4Constraint(state, itemData) {
      if (!state.CraftPeriodItemData) return;
      state.CraftPeriodItemData.Constraint.ItemList.push(itemData);
    },
    /** 设置 [ 工艺工期弹窗数据 ] 中 [ 条件 ] 类型
    ---------------------------------------------------- */
    changeCraftPeriodItemData4FilterType(state, num) {
      if (!state.CraftPeriodItemData) return;
      state.CraftPeriodItemData.Constraint.FilterType = num;
    },
    /** 删除工艺工期列表
    ---------------------------------------------------- */
    deleteTimeLimitCraftPeriodItem(state, index) {
      state.TimeLimitData.CraftPeriodList.splice(index, 1);
    },
    /** 从列表记录中删除一条记录
    ---------------------------------------------------- */
    removeItemFromDataList(state, [ID, index]) {
      state.dataList[index].List = state.dataList[index].List.filter(it => it.ID !== ID);
      state.dataList[index].count = state.dataList[index].List.length;
    },
    /** 设置 - 设置页面打开类型： 编辑edit | 添加add
    ---------------------------------------------------- */
    setSetPageType(state, type) {
      state.setPageType = type;
    },
    /** 新增 或 编辑工期后 对列表数据的数据更改
    ---------------------------------------------------- */
    changeDataList(state, { ProductClass, ID, ProductString, RecordCount }) {
      const _FirstLevelID = ProductClass.FirstLevelID;
      const _SecondLevelID = ProductClass.SecondLevelID;
      const t = state.dataList.find(it => {
        const { FirstLevelID, SecondLevelID } = it.ProductClass;
        if (_FirstLevelID === FirstLevelID && _SecondLevelID === SecondLevelID) return true;
        return false;
      });
      if (t) {
        const _item = t.List.find(it => it.ID === ID);
        if (_item) {
          _item.RecordCount = RecordCount;
          _item.ProductString = ProductString;
        } else t.List.unshift({ ID, RecordCount: 1, ProductString });
        // let count = 0;
        // t.List.forEach(item => {
        //   count += item.RecordCount;
        // });
        // t.count = count;
        t.count = t.List.length;
      }
    },
    /** 设置列表页面 - 展开列表序号
    ---------------------------------------------------- */
    setTimeLimitActiveNames(state, data) {
      state.TimeLimitActiveNames = data;
    },
  },
  actions: {
    /** 获取工期列表数据
    ---------------------------------------------------- */
    async fetchTimeLimitList({ state, commit }) {
      const { classID } = state.searchCondition;
      const res = await api.getProducePeriodList(classID);
      if (res.data.Status === 1000) commit('setDataList', res.data.Data);
    },
    async fetchConditionList({ commit }, { Limits, type, positionID }) {
      // 获取条件信息 type: 19 用于产品  20 用于工艺 、 positionID产品二级分类ID 、 Limits 产品 | 工艺 ID 列表
      if (type === 19) commit('setConditionList4ProducePeriodProduct', []);
      if (type === 20) commit('setConditionList4ProducePeriodCraft', []);
      const res = await api.getConditionList4ProducePeriod({ Limits, type, positionID });
      if (res.data.Status !== 1000) return;
      if (type === 19) commit('setConditionList4ProducePeriodProduct', res.data.Data);
      if (type === 20) commit('setConditionList4ProducePeriodCraft', res.data.Data);
    },
    async fetchProducePeriodSave({ state }, subExpressIDList) {
      // console.log(state.TimeLimitData, 'fetchProducePeriodSave');
      let _msg = '';
      if (state.TimeLimitData.ProductList.length === 0) _msg = '请选择指定产品';
      else if (state.TimeLimitData.SchemaList.length === 0) _msg = '请添加工期';
      if (_msg) {
        messageBox.failSingleError('保存失败', _msg);
        return false;
      }
      const SchemaList = state.TimeLimitData.SchemaList.map(_item => {
        const ExpressList = _item.ExpressList.filter(exItem => subExpressIDList.includes(exItem.ID));
        return {
          ..._item,
          ExpressList,
        };
      });
      const obj = { ...state.TimeLimitData, SchemaList };
      const res = await api.getProducePeriodSave(obj);
      if (res.data.Status !== 1000) return false;
      return res.data.Data;
    },
  },
};
