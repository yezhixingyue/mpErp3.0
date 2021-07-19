import api from '@/api/index';
import messageBox from '@/assets/js/utils/message';
import CommonClassType from '@/store/CommonClassType';
import Product from '@/assets/js/TypeClass/ProductClass';
import Part from '@/assets/js/TypeClass/PartClass';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

const initConditon = {
  ProductClass: {
    First: '',
    Second: '',
    Third: '',
  },
  Page: 1,
  PageSize: 24,
  KeyWords: '',
  FieldType: 3,
};

export default {
  namespaced: true,
  state: {
    /** 请求列表数据的对象
     ---------------------------------------- */
    condition4ProductManageList: JSON.parse(JSON.stringify(initConditon)),
    ProductManageList: [],
    ProductManageListNumber: 0,
    isTableDataLoading: false,
    curEditData: null,
    ProductModuleKeyIDList: [ // 按照序号获取对产品对应数据 （2个接口 分别对应产品和模块）
      { Name: 'Craft', ID: 0 }, // 工艺
      { Name: 'Material', ID: 1 }, // 物料
      { Name: 'SizeGroup', ID: 2 }, // 尺寸组
      { Name: 'GeneralSize', ID: 3 }, // 常规尺寸
      { Name: 'Group', ID: 4 }, // 元素组
      { Name: 'Element', ID: 5 }, // 元素
      { Name: 'Part', ID: 6 }, // 部件
      { Name: 'Factory', ID: 7 }, // 工厂
      { Name: 'File', ID: 8 }, // 文件
      { Name: 'Order', ID: 9 }, // 显示顺序
      { Name: 'Formula', ID: 10 }, // 公式
      { Name: 'Interaction', ID: 11 }, // 交互
      { Name: 'FalseWords', ID: 12 }, // 通假字
      { Name: 'Stock', ID: 13 }, // 库存
      { Name: 'CraftCondition', ID: 14 }, // 工艺条件
      { Name: 'CraftDisplayGroup', ID: 15 }, // 工艺显示分组
    ],
    RiskWarningTypeList: [ // 风险提示形式列表
      { Name: '弹出对话框', ID: 2 },
      { Name: '页面提示', ID: 3 },
    ],
    RiskWarningRangeList: [ // 风险提示范围列表
      { Name: '代客下单', ID: 1 },
      { Name: '自助上传', ID: 2 },
      { Name: '微信报价', ID: 3 },
    ],
    ControlTypeList: [ // 产品交互类型列表 交互模块使用(同上)
      { Name: 'interaction', ID: 0, label: '界面交互' },
      { Name: 'subInteraction', ID: 1, label: '子交互' },
      { Name: 'compare', ID: 2, label: '对比验证' },
      { Name: 'subCompare', ID: 3, label: '子对比' },
      { Name: 'risk', ID: 4, label: '风险提示' },
    ],
    FileNameEnumList: [ // 产品交互类型列表 交互模块使用(同上)
      { Name: '单位不显示', ID: 0 },
      { Name: '所有维度都显示单位', ID: 1 },
      { Name: '仅在最后位置显示', ID: 2 },
    ],
    ProductFactoryList: [], // 产品工厂列表
    ProductFactoryPropertyList: [], // 工厂条件使用属性列表数据
    curEditFactoryData: null, // 当前正在编辑的产品工厂数据
    ProductFileList: [],
    ProductFilePropertyList: [],
    curEditFileData: null, // 当前正在编辑的产品文件数据
    /**
     * 产品公式与子公式相关
     */
    curEditFormulaData: null,
    curEditSubFormulaData: null,
    curSubFormulaAddProperty: null,
    /**
     * 交互
     */
    curInteractionData: null,
    ProductInteractionDataList: [],
    InteractionLeftPropertyList: [],
    InteractionRightPropertyList: [],
    CompareLeftPropertyList: [],
    CompareRightPropertyList: [],
    subTargetData: null, // 子交互 子对比 跳转页面前选择的属性数据
    /**
     * 库存
     */
    StockLeftPropertyList: [], // 条件弹窗属性列表数据
    StockRightPropertyList: [], // 条件弹窗属性列表数据
    ProductStockDataList: null, // 库存列表数据
    /**
     * 产品元素映射
     */
    ProductElementTypeList: [
      { Name: '数量', ID: 0 },
      { Name: '款数', ID: 1 },
    ],
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
     ---------------------------------------- */
    setCondition4ProductManageList(state, [[key1, key2], value]) {
      if (!key2) state.condition4ProductManageList[key1] = value;
      else state.condition4ProductManageList[key1][key2] = value;
    },
    /** 设置请求列表数据 及 条目数量
     ---------------------------------------- */
    setProductManageList(state, [list, count]) {
      state.ProductManageList = list;
      if (!count && count !== 0) return;
      state.ProductManageListNumber = count;
    },
    /** 设置列表数据是否正在加载中
     ---------------------------------------- */
    setisTableDataLoading(state, bool) {
      state.isTableDataLoading = bool;
    },
    setTableDataOrderStatusChange(state, [type, productID]) { // type: ValetOrderStatus | CustomOrderStatus 更改产品自助上传和代客下单状态
      if (state.ProductManageList.length === 0) return;
      const t = state.ProductManageList.find(it => it.ID === productID);
      if (t) {
        // console.log(t);
        if (type === 'ValetOrderStatus') t.AllowValetOrder = !t.AllowValetOrder;
        if (type === 'CustomOrderStatus') t.AllowCustomOrder = !t.AllowCustomOrder;
      }
    },
    /** 清除列表数据请求信息
     ---------------------------------------- */
    clearCondition4ProductManageList(state) {
      state.condition4ProductManageList = JSON.parse(JSON.stringify(initConditon));
    },
    setCurEditData(state, data) { // 设置当前正在编辑的产品数据 data为null时说明为新增
      state.curEditData = data;
    },
    setProductSave(state, [isEdit, data]) { // 产品编辑添加
      if (isEdit) {
        const i = state.ProductManageList.findIndex(it => it.ID === data.ID);
        if (i > -1) {
          const t = state.ProductManageList[0];
          const _temp = { ...t, ...data };
          state.ProductManageList.splice(i, 1, _temp);
        }
      } else {
        const _temp = new Product(data);
        state.ProductManageList.unshift(_temp);
        state.ProductManageListNumber += 1;
      }
    },
    setProductRemove(state, id) { // 处理产品删除
      state.ProductManageList = state.ProductManageList.filter(it => it.ID !== id);
      state.ProductManageListNumber -= 1;
    },
    setProductPartSave(state, [data, isEdit, ID]) { // 处理产品部件添加与编辑
      const { ProductID } = data;
      const t = state.ProductManageList.find(it => it.ID === ProductID);
      if (t) {
        if (!isEdit) {
          const temp = new Part({ ...data, ID });
          t.PartList.push(temp);
        } else {
          const i = t.PartList.findIndex(_it => _it.ID === data.ID);
          if (i > -1) {
            const _t = t.PartList[i];
            const _temp = { ..._t, ...data };
            t.PartList.splice(i, 1, _temp);
          }
        }
      }
    },
    setProductPartRemove(state, [id, ProductID]) { // 部件删除
      const t = state.ProductManageList.find(it => it.ID === ProductID);
      if (t) {
        const i = t.PartList.findIndex(it => it.ID === id);
        if (i > -1) t.PartList.splice(i, 1);
      }
    },
    setMaterialDisplayNameChange(state, [ProductID, PartID, name]) { // 修改产品或部件物料提示名称
      const t = state.ProductManageList.find(it => it.ID === ProductID);
      if (t) {
        if (PartID) {
          const p = t.PartList.find(it => it.ID === PartID);
          if (p) p.MaterialDisplayName = name;
        } else {
          t.MaterialDisplayName = name;
        }
      }
    },
    setProductFactoryList(state, list) { // 设置产品工厂列表数据
      state.ProductFactoryList = list;
    },
    setProductFactoryPropertyList(state, list) { // 工厂条件使用属性列表数据
      state.ProductFactoryPropertyList = list;
    },
    setProductFactoryPropertyRemove(state, index) { // 删除产品工厂
      state.ProductFactoryList.splice(index, 1);
    },
    setCurEditFactoryData(state, data) { // 设置当前正在编辑的产品工厂数据
      state.curEditFactoryData = data;
    },
    setProductFactorySave(state, [data, isEdit]) { // 产品工厂添加或编辑成功后处理函数
      if (!data) return;
      if (!isEdit) {
        state.ProductFactoryList.unshift(data);
      } else {
        const i = state.ProductFactoryList.findIndex(it => it.ID === data.ID);
        if (i > -1) state.ProductFactoryList.splice(i, 1, data);
      }
    },
    setProductFileList(state, list) { // 设置 产品文件 列表数据
      state.ProductFileList = list;
    },
    setProductFilePropertyList(state, list) { // 产品文件条件使用属性列表数据
      state.ProductFilePropertyList = list;
    },
    setProductFilePropertyRemove(state, index) { // 删除产品文件
      state.ProductFileList.splice(index, 1);
    },
    setCurEditFileData(state, data) { // 设置当前正在编辑的产品文件数据
      state.curEditFileData = data;
    },
    setProductFileSave(state, [data, isEdit]) { // 产品文件添加或编辑成功后处理函数
      if (!data) return;
      if (!isEdit) {
        state.ProductFileList.unshift(data);
      } else {
        const i = state.ProductFileList.findIndex(it => it.ID === data.ID);
        if (i > -1) state.ProductFileList.splice(i, 1, data);
      }
    },
    /**
     * 产品公式与子公式相关
     */
    setCurEditFormulaData(state, data) {
      state.curEditFormulaData = data;
    },
    setCurEditSubFormulaData(state, data) {
      state.curEditSubFormulaData = data;
    },
    setCurSubFormulaAddProperty(state, data) { // 添加子公式选中的属性
      state.curSubFormulaAddProperty = data;
    },
    /**
     * 交互
     */
    setCurInteractionData(state, data) {
      state.curInteractionData = data;
    },
    setProductInteractionDataList(state, list) {
      state.ProductInteractionDataList = list;
    },
    setProductInteractionDataListRemove(state, id) {
      state.ProductInteractionDataList = state.ProductInteractionDataList.filter(it => it.ID !== id);
    },
    setInteractionPropertyList(state, [leftList, rightList, compareLeft, compareRight]) {
      state.InteractionLeftPropertyList = Array.isArray(leftList) ? leftList : [];
      state.InteractionRightPropertyList = Array.isArray(rightList) ? rightList : [];
      state.CompareLeftPropertyList = Array.isArray(compareLeft) ? compareLeft : [];
      state.CompareRightPropertyList = Array.isArray(compareRight) ? compareRight : [];
    },
    setProductInteractionDataListChange(state, [item, ID]) { // 新增或编辑后对仓库上的列表数据进行修改
      if (!item) return;
      if (item.ID) {
        const i = state.ProductInteractionDataList.findIndex(it => it.ID === item.ID);
        if (i > -1) state.ProductInteractionDataList.splice(i, 1, item);
      } else {
        state.ProductInteractionDataList.unshift({ ...item, ID });
      }
    },
    setSubTargetData(state, data) {
      state.subTargetData = data;
    },
    /**
     * 库存
     */
    setProductStockPropertyList(state, [leftList, rightList]) {
      state.StockLeftPropertyList = Array.isArray(leftList) ? leftList : [];
      state.StockRightPropertyList = Array.isArray(rightList) ? rightList : [];
    },
    setProductStockDataList(state, list) {
      state.ProductStockDataList = list;
    },
    setProductStockSave(state, data) { // 库存规格保存
      if (!data.PartID) {
        state.ProductStockDataList.StockList.unshift(data);
      } else {
        const t = state.ProductStockDataList.PartList.find(it => it.ID === data.PartID);
        if (t) t.StockList.unshift(data);
      }
    },
    setProductStockSetWarning(state, data) { // 设置库存预警
      if (!data.PartID) {
        state.ProductStockDataList.MinNumber = data.MinNumber;
        state.ProductStockDataList.WarningMobile = data.Mobile;
      } else {
        const t = state.ProductStockDataList.PartList.find(it => it.ID === data.PartID);
        if (t) {
          t.MinNumber = data.MinNumber;
          t.WarningMobile = data.Mobile;
        }
      }
    },
    setProductStockUpdate(state, data) { // 更新库存数量
      let list;
      if (!data.PartID) {
        list = state.ProductStockDataList.StockList;
      } else {
        const t = state.ProductStockDataList.PartList.find(it => it.ID === data.PartID);
        if (t) list = t.StockList;
      }
      if (list) {
        const t = list.find(it => it.ID === data.id);
        if (t) t.Number = data.number;
      }
    },
    setProductStockRemove(state, data) { // 删除库存条目
      let list;
      if (!data.PartID) {
        list = state.ProductStockDataList.StockList;
      } else {
        const t = state.ProductStockDataList.PartList.find(it => it.ID === data.PartID);
        if (t) list = t.StockList;
      }
      if (list) {
        const i = list.findIndex(it => it.ID === data.id);
        if (i > -1) list.splice(i, 1);
      }
    },
    setProductBindElementType(state, data) { // 绑定产品元素
      const { ProductID, PartID, List } = data;
      const t = state.ProductManageList.find(it => it.ID === ProductID);
      if (t) {
        if (!PartID) t.TypeList = List;
        else {
          const part = t.PartList.find(_it => _it.ID === PartID);
          if (part) part.TypeList = List;
        }
      }
    },
  },
  actions: {
    async getManageProductList({ state, commit }, page = 1) { // 获取产品列表数据
      commit('setCondition4ProductManageList', [['Page', ''], page]);
      commit('setProductManageList', [[], undefined]);
      const _obj = CommonClassType.filter(state.condition4ProductManageList);
      commit('setisTableDataLoading', true);
      let key = true;
      const res = await api.getManageProductLists(_obj).catch(() => { key = false; });
      commit('setisTableDataLoading', false);
      if (key && res && res.status === 200 && res.data.Status === 1000) {
        commit('setProductManageList', [res.data.Data, res.data.DataNumber]);
      }
    },
    async getOrderStatusChange({ state, commit }, [type, productID]) { // 更改产品自助上传和代客下单状态
      if (state.ProductManageList.length === 0) return;
      const t = state.ProductManageList.find(it => it.ID === productID);
      if (t) {
        let changeRequstFunc = null;
        if (type === 'ValetOrderStatus') changeRequstFunc = api.getValetOrderStatusChange;
        if (type === 'CustomOrderStatus') changeRequstFunc = api.getCustomOrderStatusChange;
        if (!changeRequstFunc) return;
        const res = await changeRequstFunc(productID).catch(() => {});
        if (res && res.status === 200 && res.data.Status === 1000) commit('setTableDataOrderStatusChange', [type, productID]);
      }
    },
    async getProductBaseInfoSave({ commit }, [data, cb]) { // 产品添加 | 编辑
      const resp = await api.getProductBaseInfoSave(data).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const isEdit = !!data.ID;
        const msg = isEdit ? '编辑成功' : '添加成功';
        const callback = () => {
          commit('setProductSave', [isEdit, { ...data, ID: resp.data.Data }]);
          if (cb) cb();
        };
        messageBox.successSingle(msg, callback, callback);
      }
    },
    async getProductRemove({ commit }, id) { // 产品删除
      if (!id) return;
      const resp = await api.getProductRemove(id).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const callback = () => {
          commit('setProductRemove', id);
        };
        messageBox.successSingle('删除成功', callback, callback);
      }
    },
    async getProductPartSave({ commit }, [data, cb]) { // 产品部件保存
      if (!data) return;
      const resp = await api.getProductPartSave(data).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        // 保存成功
        const { ID } = data;
        const isEdit = !!(ID || ID === 0);
        const msg = isEdit ? '部件编辑成功' : '部件添加成功';
        const callback = () => {
          commit('setProductPartSave', [data, isEdit, resp.data.Data]);
          if (cb) cb();
        };
        messageBox.successSingle(msg, callback, callback);
      }
    },
    async getProductPartRemove({ commit }, [id, ProductID]) { // 部件删除
      if (!id) return;
      const resp = await api.getProductPartRemove(id).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const callback = () => {
          commit('setProductPartRemove', [id, ProductID]);
        };
        messageBox.successSingle('部件删除成功', callback, callback);
      }
    },
    async getMaterialDisplayNameChange({ commit }, [ProductID, PartID, name, cb]) {
      const id = PartID || ProductID;
      const resp = await api.getMaterialDisplayNameChange(id, name, !PartID).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        commit('setMaterialDisplayNameChange', [ProductID, PartID, name]);
        if (cb) cb();
      }
    },
    async getProductFactoryList({ commit }, data) { // 获取产品工厂列表数据
      commit('setProductFactoryList', []);
      const resp = await api.getProductModuleData(data).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        commit('setProductFactoryList', resp.data.Data.FactoryList);
        return true;
      }
      return false;
    },
    async getProductFactoryPropertyList({ commit }, ProductID) { // 获取设置产品工厂条件属性列表数据
      commit('setProductFactoryPropertyList', []);
      const propertyList = await PropertyClass.getPropertyList({ ProductID, UseModule: 12 });
      if (propertyList) {
        commit('setProductFactoryPropertyList', propertyList);
      }
    },
    async getProductFactoryPropertyRemove({ commit }, [id, i]) { // 删除产品工厂
      const resp = await api.getProductFactoryRemove(id).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => { commit('setProductFactoryPropertyRemove', i); };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async getProductFileList({ commit }, data) { // 获取产品文件列表数据
      commit('setProductFileList', []);
      const resp = await api.getProductModuleData(data).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        commit('setProductFileList', resp.data.Data.FileList);
        return true;
      }
      return false;
    },
    async getProductFilePropertyList({ commit }, ProductID) { // 获取设置产品文件关联属性列表数据
      commit('setProductFilePropertyList', []);
      const propertyList = await PropertyClass.getPropertyList({ ProductID, UseModule: 13 });
      if (propertyList) {
        commit('setProductFilePropertyList', propertyList);
      }
    },
    async getProductFilePropertyRemove({ commit }, [id, i]) { // 删除产品文件关联
      const resp = await api.getProductFileRemove(id).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => { commit('setProductFilePropertyRemove', i); };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async getProductInteractionDataList({ commit }, data) { // 获取产品交互列表数据
      commit('setProductInteractionDataList', []);
      const resp = await api.getProductModuleData(data).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        commit('setProductInteractionDataList', resp.data.Data.ControlList);
        return true;
      }
      return false;
    },
    async getProductControlRemove({ commit }, id) {
      const resp = await api.getProductControlRemove(id).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          commit('setProductInteractionDataListRemove', id);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async getInteractionPropertyList({ commit }, ProductID) { // 获取交互左侧弹窗属性列表数据
      commit('setInteractionPropertyList', []);
      const list = await Promise.all([
        PropertyClass.getPropertyList({ UseModule: 14, ProductID }),
        PropertyClass.getPropertyList({ UseModule: 18, ProductID }),
        PropertyClass.getPropertyList({ UseModule: 19, ProductID }), // 对比主属性
        PropertyClass.getPropertyList({ UseModule: 20, ProductID }), // 对比从属性
      ]);
      if (list) {
        commit('setInteractionPropertyList', list);
        return true;
      }
      return false;
    },
    async getProductStockPropertyList({ commit }, ProductID) { // 获取产品库存规则添加属性列表数据
      commit('setProductStockPropertyList', []);
      const list = await Promise.all([
        PropertyClass.getPropertyList({ UseModule: 11, ProductID }),
        PropertyClass.getPropertyList({ UseModule: 21, ProductID }),
      ]);
      if (list) {
        commit('setProductStockPropertyList', list);
        return true;
      }
      return false;
    },
    async getProductStockSave({ commit }, [data, callback]) { // 保存库存规格
      const resp = await api.getProductStockSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = { ...data, ID: resp.data.Data };
          commit('setProductStockSave', temp);
          if (callback) callback();
        };
        messageBox.successSingle('添加成功', cb, cb);
      }
    },
    async getProductStockSetWarning({ commit }, [data, callback]) { // 设置库存预警
      const resp = await api.getProductStockSetWarning(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setProductStockSetWarning', data);
          if (callback) callback();
        };
        messageBox.successSingle('设置库存预警成功', cb, cb);
      }
    },
    async getProductStockUpdate({ commit }, [data, callback]) { // 更新库存数量
      const { id, number } = data;
      const resp = await api.getProductStockUpdate(id, number).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setProductStockUpdate', data);
          if (callback) callback();
        };
        messageBox.successSingle('更新库存数量成功', cb, cb);
      }
    },
    async getProductStockRemove({ commit }, data) { // 删除库存条目
      const { id } = data;
      const resp = await api.getProductStockRemove(id).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setProductStockRemove', data);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async getProductBindElementType({ commit }, [data, callback]) { // 绑定产品元素
      const resp = await api.getProductBindElementType(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setProductBindElementType', data);
          if (callback) callback();
        };
        messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
};
