import api from '@/api/index';
import messageBox from '@/assets/js/utils/message';
import CommonClassType from '@/store/CommonClassType';
import Product from '@/assets/js/TypeClass/ProductClass';
import Part from '@/assets/js/TypeClass/PartClass';

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
      { Name: 'Stock', ID: 13 }, // 库存
      { Name: 'CraftCondition', ID: 14 }, // 工艺条件
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
        state.ProductManageList.push(_temp);
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
          commit('setProductSave', [isEdit, data]);
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
  },
};
