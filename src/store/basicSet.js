import api from '../api';
import messageBox from '../assets/js/utils/message';

export default {
  namespaced: true,
  state: {
    /* 界面元素列表数据（可能通用，使用前先比较ID值是否相同）
    -------------------------------*/
    ElementDataList: [],
    /* 界面元素组列表数据（同上）
    -------------------------------*/
    ElementGroupDataList: [],
    /* 印刷幅面分类列表数据
    -------------------------------*/
    BreadthCLassList: [],
    /* 印刷幅面列表数据
    -------------------------------*/
    BreadthList: [],
    AllBreadthList: [],
    /* 物料尺寸列表数据
    -------------------------------*/
    MaterialSizeList: [],
    MaterialSizeListDataNumber: 0,
    MaterialSizePage: 1,
    /* 物料类型
    -------------------------------*/
    MaterialTypeList: [],
    NowEditFormulaData: null, // 正在编辑或添加(为null)的物料公式数据
    /* 工艺列表数据相关
    -------------------------------*/
    CraftDataList: [],
    CraftDataNumber: 0,
    Condition4CraftList: {
      Page: 1,
      PageSize: 30,
      KeyWords: '',
      FieldType: 3,
      Category: {
        First: '',
        Second: '',
      },
    },
    craftFetchData: false,
    MakeupRuleList: [], // 拼版规则列表数据

    /* 物流费用列表数据相关
    -------------------------------*/
    logisticList: [],
    ThirdPlatExpressList: [],
    loading: false,
    logisticItemFormulaList: [], // 工期组成列表数据 及 总工期列表数据
    logisticItemConditionPropertyList: [], // 工期组成条件属性列表数据 及 总工期条件属性列表数据
    curEditFormulaData: null,
  },
  getters: {
    BreadthTreeList(state) {
      if (!state.AllBreadthList || state.AllBreadthList.length === 0 || !state.BreadthCLassList || state.BreadthCLassList.length === 0) return [];
      const ClassList = JSON.parse(JSON.stringify(state.BreadthCLassList));
      ClassList.forEach(classItem => {
        const _item = classItem;
        _item.list = state.AllBreadthList.filter(it => it.Class && it.Class.ID === classItem.ID);
      });
      return ClassList.filter(it => it.list.length > 0);
    },
  },
  mutations: {
    /* 设置界面元素列表数据
    -------------------------------*/
    setElementDataList(state, list) {
      if (!list) return;
      state.ElementDataList = list;
    },
    /* 添加|编辑 界面元素
    -------------------------------*/
    setElementItemSave(state, { saveType, editData, ID }) {
      const itemData = editData;
      if (saveType === '添加') {
        itemData.ID = ID;
        state.ElementDataList.unshift(itemData);
      } else if (saveType === '编辑') {
        const i = state.ElementDataList.findIndex(it => it.ID === itemData.ID);
        if (i >= 0) state.ElementDataList.splice(i, 1, itemData);
      }
    },
    /* 删除 界面元素
    -------------------------------*/
    setElementDataRemove(state, id) {
      state.ElementDataList = state.ElementDataList.filter(it => it.ID !== id);
    },
    /* 设置界面元素组列表数据
    -------------------------------*/
    setElementGroupDataList(state, list) {
      if (!list) return;
      state.ElementGroupDataList = list;
    },
    /* 添加|编辑 界面元素组
    -------------------------------*/
    setElementGroupItemSave(state, { saveType, editData, ID }) {
      const itemData = editData;
      const changeElementGroupProp = () => { // 修改元素列表中使用到的元素group属性，对其进行赋值
        const _groupIncludesElementIDs = itemData.ElementList.map(sub => sub.ID);
        state.ElementDataList.forEach(it => {
          const _it = it;
          if (_groupIncludesElementIDs.includes(it.ID)) {
            if (_it && (!_it.Group || _it.Group.ID !== ID)) {
              _it.Group = {
                ID,
                Name: itemData.Name,
              };
            }
          } else if (_it.Group && _it.Group.ID === ID) {
            _it.Group = null;
          }
        });
      };
      if (saveType === '添加') {
        itemData.ID = ID;
        state.ElementGroupDataList.unshift(itemData);
        changeElementGroupProp();
      } else if (saveType === '编辑') {
        const i = state.ElementGroupDataList.findIndex(it => it.ID === itemData.ID);
        if (i >= 0) {
          state.ElementGroupDataList.splice(i, 1, itemData);
          changeElementGroupProp();
        }
      }
    },
    /* 删除 界面元素组
    -------------------------------*/
    setElementGroupRemove(state, id) {
      const t = state.ElementGroupDataList.find(it => it.ID === id);
      t.ElementList.forEach(it => {
        const _t = state.ElementDataList.find(ele => ele.ID === it.ID);
        if (_t) _t.Group = null;
      });
      state.ElementGroupDataList = state.ElementGroupDataList.filter(it => it.ID !== id);
    },
    setElementGroupElementListBySort(state, { ID, ElementList }) {
      const t = state.ElementGroupDataList.find(it => it.ID === ID);
      if (t) {
        t.ElementList = t.ElementList.map(it => {
          const _t = ElementList.find(sub => sub.ID === it.ID);
          if (_t) {
            return {
              ...it,
              Index: _t.Index,
            };
          }
          return { ...it };
        });
      }
    },
    /* 设置印刷幅面分类列表数据
    -------------------------------*/
    setBreadthCLassList(state, list) {
      if (!list) return;
      state.BreadthCLassList = list;
    },
    setBreadthClassSave(state, { isEdit, data, ID }) {
      if (isEdit) {
        const i = state.BreadthCLassList.findIndex(it => it.ID === data.ID);
        if (i >= 0) {
          state.BreadthCLassList.splice(i, 1, data);
        }
      } else {
        const _data = data;
        _data.ID = ID;
        state.BreadthCLassList.unshift(_data);
      }
    },
    /* 印刷幅面分类列表删除
    -------------------------------*/
    setBreadthClassRemove(state, id) {
      state.BreadthCLassList = state.BreadthCLassList.filter(it => it.ID !== id);
    },
    setBreadthList(state, list) { // 设置印刷幅面列表数据
      state.BreadthList = list;
    },
    setAllBreadthList(state, list) { // 设置总印刷幅面列表数据
      state.AllBreadthList = list;
    },
    setBreadthSaveSuccess(state, { isEdit, data, ID, curClassID }) {
      const _classID = data.Class.ID;
      const _temp = isEdit ? data : { ...data, ID };
      if (!isEdit && (_classID === curClassID || !curClassID)) {
        state.BreadthList.unshift(_temp);
        state.AllBreadthList.unshift(_temp);
      } else if (isEdit) {
        const i = state.BreadthList.findIndex(it => it.ID === _temp.ID);
        const i2 = state.AllBreadthList.findIndex(it => it.ID === _temp.ID);
        if (i >= 0) state.BreadthList.splice(i, 1, _temp);
        if (i2 >= 0) state.AllBreadthList.splice(i, 1, _temp);
      }
    },
    setBreadthRemove(state, id) {
      state.BreadthList = state.BreadthList.filter(it => it.ID !== id);
      state.AllBreadthList = state.AllBreadthList.filter(it => it.ID !== id);
    },
    /* 物料尺寸
    -------------------------------*/
    setMaterialSizeList(state, { Data, DataNumber }) { // 设置印刷幅面列表数据
      state.MaterialSizeList = Data;
      if (DataNumber || DataNumber === 0) state.MaterialSizeListDataNumber = DataNumber;
    },
    setMaterialSizeSaveSuccess(state, { isEdit, data, ID }) {
      if (isEdit) {
        const i = state.MaterialSizeList.findIndex(it => it.ID === data.ID);
        if (i >= 0) {
          state.MaterialSizeList.splice(i, 1, data);
        }
      } else {
        const _data = data;
        _data.ID = ID;
        state.MaterialSizeList.unshift(_data);
        state.MaterialSizeListDataNumber += 1;
      }
    },
    setMaterialSizeRemove(state, id) {
      state.MaterialSizeList = state.MaterialSizeList.filter(it => it.ID !== id);
      state.MaterialSizeListDataNumber -= 1;
    },
    setMaterialSizePage(state, page) {
      state.MaterialSizePage = page;
    },
    /* 物料类型
    -------------------------------*/
    setMaterialTypeSave(state, { isEdit, data, ID }) { // 添加|编辑
      const itemData = data;
      if (!isEdit) { // 添加
        itemData.ID = ID;
        state.MaterialTypeList.unshift(itemData);
      } else { // 编辑
        const i = state.MaterialTypeList.findIndex(it => it.ID === itemData.ID);
        if (i >= 0) state.MaterialTypeList.splice(i, 1, itemData);
      }
    },
    setMaterialTypeList(state, list) {
      state.MaterialTypeList = list;
    },
    setMaterialTypeRemove(state, id) {
      state.MaterialTypeList = state.MaterialTypeList.filter(it => it.ID !== id);
    },
    setMaterialTypeElementChange(state, [isEdit, data, ID]) {
      const targetMaterialType = state.MaterialTypeList.find(it => it.ID === ID);
      if (targetMaterialType) {
        if (!isEdit) {
          targetMaterialType.ElementList.push(data);
        } else {
          const i = targetMaterialType.ElementList.findIndex(it => it.ID === data.ID);
          if (i > -1) targetMaterialType.ElementList.splice(i, 1, data);
        }
      }
    },
    setMaterialTypeUnionShowListChange(state, { ID, UnionShowList }) {
      const t = state.MaterialTypeList.find(it => it.ID === ID);
      if (t) {
        t.UnionShowList = UnionShowList;
      }
    },
    setMaterialTypeElementRemove(state, [ElementID, ID]) {
      const t = state.MaterialTypeList.find(it => it.ID === ID);
      if (t) {
        t.ElementList = t.ElementList.filter(it => it.ID !== ElementID);
      }
    },
    /* 公式相关
    -------------------------------*/
    setNowEditFormulaData(state, data) { // 正在编辑或添加的物料公式（不仅限于物料）数据
      state.NowEditFormulaData = data;
    },
    /* 工艺列表数据相关
    -------------------------------*/
    setCraftDataList(state, { Data, DataNumber }) {
      state.CraftDataList = Data;
      if (DataNumber || DataNumber === 0) state.CraftDataNumber = DataNumber;
    },
    setCondition4CraftList(state, [[key1, key2], value]) {
      if (key1 && key2) state.Condition4CraftList[key1][key2] = value;
      else if (key1) state.Condition4CraftList[key1] = value;
      if (key1 === 'Category' && key2 === 'First') state.Condition4CraftList[key1].Second = '';
    },
    clearCondition4CraftList(state) {
      state.Condition4CraftList = {
        Page: 1,
        PageSize: 30,
        KeyWords: '',
        FieldType: 3,
        Category: {
          First: '',
          Second: '',
        },
      };
    },
    setCraftDataListItemSave(state, [isEdit, itemData]) {
      if (isEdit) {
        const i = state.CraftDataList.findIndex(it => it.ID === itemData.ID);
        if (i > -1) state.CraftDataList.splice(i, 1, itemData);
      } else {
        state.CraftDataList.unshift(itemData);
        state.CraftDataNumber += 1;
      }
    },
    setCraftRemove(state, id) {
      state.CraftDataList = state.CraftDataList.filter(it => it.ID !== id);
      state.CraftDataNumber -= 1;
    },
    setCraftElementChange(state, [isEdit, data, ID]) {
      const t = state.CraftDataList.find(it => it.ID === ID);
      if (t) {
        if (!isEdit) {
          t.ElementList.unshift(data);
        } else {
          const i = t.ElementList.findIndex(it => it.ID === data.ID);
          if (i > -1) t.ElementList.splice(i, 1, data);
        }
      }
    },
    setCraftElementRemove(state, [ElementID, ID]) {
      const t = state.CraftDataList.find(it => it.ID === ID);
      if (t) {
        t.ElementList = t.ElementList.filter(it => it.ID !== ElementID);
      }
    },
    setCraftFetchData(state, bool) {
      state.craftFetchData = bool; // 根据该值判断是否需要重新获取数据
    },
    /* 拼版规则 ↓
    -------------------------------*/
    setMakeupRuleList(state, list) {
      state.MakeupRuleList = list;
    },

    /* 物流费用列表数据相关
    -------------------------------*/
    setLogisticList(state, list) {
      state.logisticList = list || [];
    },
    setLogisticItemChange(state, { item, ID, isRemove }) { // 编辑|新增
      if (!item.ID && item.ID !== 0) { // 新增
        state.logisticList.unshift({ ...item, ID });
      } else { // 编辑|删除
        const i = state.logisticList.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          const temp = { ...state.logisticList[i], ...item };
          if (!isRemove) state.logisticList.splice(i, 1, temp);
          else state.logisticList.splice(i, 1);
        }
      }
    },
    setLogisticsSetOrder(state, ids) {
      const list = ids.map(id => state.logisticList.find(it => it.ID === id)).filter(it => it);
      state.logisticList = list;
    },
    setThirdPlatExpressList(state, list) {
      state.ThirdPlatExpressList = list || [];
    },
    setLoading(state, bool) {
      state.loading = bool;
    },
    setLogisticItemFormulaList(state, [FormulaList, FormulaPropertyList]) {
      state.logisticItemFormulaList = FormulaList || [];
      state.logisticItemConditionPropertyList = FormulaPropertyList || [];
    },
    setCurEditFormulaData(state, data) { // 设置当前正在编辑的公式数据 配送方式设置价格
      state.curEditFormulaData = data;
    },
    setLogisticsItemFormulaListItemRemove(state, { ID, LogisticsID }) { // 工期组成公式删除
      state.logisticItemFormulaList = state.logisticItemFormulaList.filter(it => it.ID !== ID);
      const t = state.logisticList.find(it => it.ID === LogisticsID);
      if (t) t.RecordCount -= 1;
    },
    setLogisticsItemFormulaListItemChange(state, { isEdit, data, ID, LogisticsID }) { // 工期组成中公式的编辑与添加处理
      if (isEdit) {
        const i = state.logisticItemFormulaList.findIndex(it => it.ID === ID);
        if (i > -1) {
          state.logisticItemFormulaList.splice(i, 1, data);
        }
      } else {
        state.logisticItemFormulaList.unshift({ ...data, ID });
        const t = state.logisticList.find(it => it.ID === LogisticsID);
        if (t) t.RecordCount += 1;
      }
    },
  },
  actions: {
    async getElementList({ state, commit }) { // 获取元素列表（暂固定为公共模板列表）
      if (state.ElementDataList && state.ElementDataList.length > 0) return true;
      const resp = await api.getElementList().catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setElementDataList', resp.data.Data);
        return true;
      }
      return false;
    },
    async getElementRemove({ commit }, id) { // 元素删除
      const resp = await api.getElementRemove(id).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => {
          commit('setElementDataRemove', id);
        };
        messageBox.successSingle('删除成功', callback, callback);
      }
    },
    async getElementGroupList({ state, commit }) { // 获取元素组列表（暂固定为公共模板列表）
      if (state.ElementGroupDataList && state.ElementGroupDataList.length > 0) return true;
      const resp = await api.getElementGroupList().catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setElementGroupDataList', resp.data.Data);
        return true;
      }
      return false;
    },
    async getElementGroupRemove({ commit }, [id, Module]) { // 元素组删除
      const resp = await api.getElementGroupRemove(id, Module).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => {
          commit('setElementGroupRemove', id);
        };
        messageBox.successSingle('删除成功', callback, callback);
      }
    },
    async getBreadthClassList({ state, commit }) { // 获取印刷幅面分类列表
      if (state.BreadthCLassList && state.BreadthCLassList.length > 0) return true;
      const resp = await api.getBreadthClassList().catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setBreadthCLassList', resp.data.Data);
        return true;
      }
      return false;
    },
    async getBreadthClassRemove({ commit }, id) { // 元素删除
      const resp = await api.getBreadthClassRemove(id).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => {
          commit('setBreadthClassRemove', id);
        };
        messageBox.successSingle('删除成功', callback, callback);
      }
    },
    /* 印刷幅面 ↓
    -------------------------------*/
    async getBreadthList({ commit }, id) {
      const resp = await api.getBreadthList(id).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setBreadthList', resp.data.Data);
        return true;
      }
      return false;
    },
    async getAllBreadthList({ commit }) {
      const resp = await api.getBreadthList().catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setAllBreadthList', resp.data.Data);
        return true;
      }
      return false;
    },
    async getBreadthSave(context, data) {
      const resp = await api.getBreadthSave(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        return resp.data.Data || true;
      }
      return false;
    },
    async getBreadthRemove({ commit }, id) { // 印刷幅面删除
      const resp = await api.getBreadthRemove(id).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => {
          commit('setBreadthRemove', id);
        };
        messageBox.successSingle('删除成功', callback, callback);
      }
    },
    /* 物料尺寸 ↓
    -------------------------------*/
    async getMaterialSizeList({ commit }, page = 1) {
      commit('setMaterialSizePage', page);
      commit('setMaterialSizeList', { Data: [] });
      const resp = await api.getMaterialSizeList(page).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setMaterialSizeList', resp.data);
        return true;
      }
      return false;
    },
    async getMaterialSizeSave(context, data) {
      const resp = await api.getMaterialSizeSave(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        return resp.data.Data || true;
      }
      return false;
    },
    async getMaterialSizeRemove({ commit }, id) { // 印刷幅面删除
      const resp = await api.getMaterialSizeRemove(id).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => {
          commit('setMaterialSizeRemove', id);
        };
        messageBox.successSingle('删除成功', callback, callback);
      }
    },
    /* 物料尺寸 ↓
    -------------------------------*/
    async getMaterialTypeList({ commit }) {
      const resp = await api.getMaterialTypeList().catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setMaterialTypeList', resp.data.Data);
        return true;
      }
      return false;
    },
    async getMaterialTypeRemove({ commit }, id) { // 物料类型删除
      const resp = await api.getMaterialTypeRemove(id).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => {
          commit('setMaterialTypeRemove', id);
        };
        messageBox.successSingle('删除成功', callback, callback);
      }
    },
    async getCraftDataList({ state, commit }, page = 1) {
      commit('setCondition4CraftList', [['Page', ''], page]);
      commit('setCraftDataList', { Data: [] });
      const resp = await api.getCraftListData(state.Condition4CraftList).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setCraftDataList', resp.data);
        return true;
      }
      return false;
    },
    async getCraftRemove({ commit }, id) {
      const resp = await api.getCraftRemove(id).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => {
          commit('setCraftRemove', id);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    /* 拼版规则 ↓
    -------------------------------*/
    async getMakeupRuleList({ state, commit }) { // 列表数据
      if (state.MakeupRuleList.length > 0) return;
      const resp = await api.getMakeupRuleList().catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setMakeupRuleList', resp.data.Data);
      }
    },
    /* 物流费用列表数据相关
    -------------------------------*/
    async getLogisticList({ commit }) {
      commit('setLogisticList', []);
      commit('setLoading', true);
      const resp = await api.getLogisticsList().catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setLogisticList', resp.data.Data);
      }
    },
    async getLogisticItemSave({ commit }, { item, callback }) { // 编辑与新增
      const resp = await api.getLogisticsSave(item).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const title = item.ID ? '编辑成功' : '添加成功';
        const cb = () => {
          commit('setLogisticItemChange', { item, ID: resp.data.Data });
          if (callback && typeof callback === 'function') callback();
        };
        messageBox.successSingle(title, cb, cb);
      }
    },
    async getLogisticItemRemove({ commit }, { item, callback }) { // 删除
      const resp = await api.getLogisticsRemove(item.ID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setLogisticItemChange', { item, isRemove: true });
          if (callback && typeof callback === 'function') callback();
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async getLogisticsSetOrder({ commit }, { ids, callback }) {
      if (!ids) return;
      const resp = await api.getLogisticsSetOrder(ids).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setLogisticsSetOrder', ids);
          if (callback && typeof callback === 'function') callback();
        };
        messageBox.successSingle('排序成功', cb, cb);
      }
    },
    async getLogisticsBindStation({ commit }, { item, callback }) { // 编辑与新增
      const resp = await api.getLogisticsBindStation(item).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setLogisticItemChange', { item, ID: resp.data.Data });
          if (callback && typeof callback === 'function') callback();
        };
        messageBox.successSingle('配送网点关联成功', cb, cb);
      }
    },
    async getThirdPlatExpressList({ state, commit }) { // 获取第三方配送方式列表
      if (state.ThirdPlatExpressList.length > 0) return;
      const _ThirdPlatExpressList = sessionStorage.getItem('ThirdPlatExpressList');
      if (_ThirdPlatExpressList) {
        commit('setThirdPlatExpressList', JSON.parse(_ThirdPlatExpressList));
        return;
      }
      const resp = await api.getThirdPlatExpressList().catch(() => null);
      if (resp?.data.Status === 1000) {
        commit('setThirdPlatExpressList', resp.data.Data);
        sessionStorage.setItem('ThirdPlatExpressList', JSON.stringify(resp.data.Data));
      }
    },
    async getLogisticsBindExpress({ commit }, { item, callback }) { // 编辑与新增
      const resp = await api.getLogisticsBindExpress(item).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setLogisticItemChange', { item, ID: resp.data.Data });
          if (callback && typeof callback === 'function') callback();
        };
        messageBox.successSingle('快递打单关联成功', cb, cb);
      }
    },
    async getLogisticsItemFormulaList({ state, commit }, { LogisticsID }) { // 获取配送方式价格公式
      commit('setLoading', true);
      const fetchDataList = async ({ func, params, list }) => {
        if (list && list.length > 0) return list;
        const resp = await func(params).catch(() => {});
        if (resp && resp.status === 200 && resp.data.Status === 1000) {
          return resp.data.Data;
        }
        return [];
      };
      const [FormulaList, FormulaPropertyList] = await Promise.all([
        fetchDataList({ func: api.getFormulaList, params: { UseModule: 100, LogisticsID } }),
        fetchDataList({ func: api.getFormulaPropertyList, params: { UseModule: 48 }, list: state.logisticItemConditionPropertyList }),
      ]);
      commit('setLoading', false);
      commit('setLogisticItemFormulaList', [FormulaList, FormulaPropertyList]);
    },
    async getLogisticItemFormulaRemove({ commit }, { ID, LogisticsID }) { // 价格条目删除
      if (!ID) return;
      const resp = await api.getFormulaRemove(ID).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => {
          commit('setLogisticsItemFormulaListItemRemove', { ID, LogisticsID });
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
};
