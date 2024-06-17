import CommonClassType from '@/store/CommonClassType';
import api from '../../api';
import Condition4ReviewList from './condition4ReviewProductList';
import messageBox from '../../assets/js/utils/message';
import ReviewAllocationListConditionClass from './TypeClass/ReviewAllocation/ReviewAllocationListConditionClass';
import { PrintSideTypeEnums, PrintColorTypeEnums } from './reviewEnums';

export default {
  namespaced: true,
  state: {
    loading: false,
    /* 审稿设置相关
    ---------------------------------- */
    condition4ReviewProductList: new Condition4ReviewList(),
    reviewProductList: [],
    reviewProductListNumber: 0,
    curPanelData: null, // 各个条件设置面板页面共用的类型信息，包含当前产品和部件索引及当前类型信息

    OutputFileList: [], // 输出文件列表数据

    reviewSetupPanelList: [],

    curEditPanelItem: null, // 正在编辑的条件面板项目数据
    ConditionPropList: [],

    /* 分配策略相关
    ---------------------------------- */
    condition4ReviewAllocationList: new ReviewAllocationListConditionClass(),
    reviewAllocationList: [],
    reviewAllocationListNumber: 0,
    curAllocationEditItem: null,
    allocationConditionPropList: [],

    /* 人员分组相关
    ---------------------------------- */
    reviewGroupList: [],
    reviewGroupListNumber: 0,
  },
  getters: {
    curReviewProduct(state) { // 当前正在设置的产品
      if (!state.curPanelData) return null;
      const { itemIndex } = state.curPanelData;
      if (typeof itemIndex === 'number') {
        return state.reviewProductList[itemIndex];
      }
      return null;
    },
    curReviewProductPart(state, getters) { // 当前正在设置产品的部件 如果为null 且 产品有值 则设置的为产品本身
      if (getters.curReviewProduct && Array.isArray(getters.curReviewProduct.PartList) && getters.curReviewProduct.PartList.length > 0 && state.curPanelData) {
        const _partList = getters.curReviewProduct.PartList.filter(it => it.IsSelected);
        const { itemPartIndex } = state.curPanelData;
        if (_partList.length > 0 && itemPartIndex < _partList.length) {
          return _partList[itemPartIndex];
        }
      }
      return null;
    },
  },
  mutations: {
    setLoading(state, bool) {
      state.loading = bool || false;
    },
    /* 审稿设置相关
    ---------------------------------- */
    setCondition4ReviewProductList(state, [[key1, key2], value]) { // 设置筛选条件
      if (key1 && key2) state.condition4ReviewProductList[key1][key2] = value;
      else if (key1) state.condition4ReviewProductList[key1] = value;
    },
    setReviewProductList(state, [list, count]) {
      state.reviewProductList = list || [];
      if (!count && count !== 0) return;
      state.reviewProductListNumber = count;
    },
    setCurPanelData(state, data) {
      state.curPanelData = data;
    },

    setOutputFileList(state, list) {
      const _list = list;
      _list.sort((a, b) => new Date(a.CreateTime.split('.')[0]).getTime() - new Date(b.CreateTime.split('.')[0]).getTime());
      _list.sort((a, b) => a.Index - b.Index);
      state.OutputFileList = _list;
    },
    setOutputFileItemChange(state, { item, index, isDelete }) {
      if (typeof index !== 'number' || Number.isNaN(index)) throw new Error('传值不正确');
      if (isDelete) {
        state.OutputFileList.splice(index, 1);
        return;
      }
      if (index === -1) {
        state.OutputFileList.push(item);
      } else if (index > -1) {
        state.OutputFileList.splice(index, 1, item);
      }
      state.OutputFileList.sort((a, b) => new Date(a.CreateTime.split('.')[0]).getTime() - new Date(b.CreateTime.split('.')[0]).getTime());
      state.OutputFileList.sort((a, b) => a.Index - b.Index);
    },

    setOrderNameMustInputChange(state, data) { // 设置审稿时必须填写订单名称
      if (!data || typeof data !== 'object') return;
      const product = state.reviewProductList.find(it => it.ID === data.ProductID);
      if (product) product.OrderNameMustInput = data.OrderNameMustInput;
    },
    setCheckFilePartSave(state, data) { // 设置可审稿的产品部件
      if (!data) return;
      const { PartIDList } = data;
      const changeState = (part) => {
        const IsSelected = PartIDList.includes(part.ID);
        const _part = part;
        _part.IsSelected = IsSelected;
        if (IsSelected) {
          if (!_part.SetupCountAttribute) {
            _part.SetupCountAttribute = {
              FilePages: 0,
              OutputFile: 0,
              Process: 0,
              SizeNumber: 0,
            };
          }
          if (!_part.PrintSideInfo) {
            _part.PrintSideInfo = {
              DoubleSide: null,
              SideType: PrintSideTypeEnums.doubleSide.ID,
              SingleSide: null,
            };
          }
          if (!_part.DefaultPrintColor) {
            _part.DefaultPrintColor = [PrintColorTypeEnums.C.ID, PrintColorTypeEnums.M.ID, PrintColorTypeEnums.Y.ID, PrintColorTypeEnums.K.ID];
          }
        }
      };
      if (state.reviewProductList?.[state.curPanelData.itemIndex]) {
        changeState(state.reviewProductList[state.curPanelData.itemIndex]);
        state.reviewProductList[state.curPanelData.itemIndex].PartList.forEach(part => changeState(part));
      }
    },
    setCheckFileOtherInfo(state, data) { // 修改其它设置部分通用方法
      if (!data || typeof data !== 'object') return;
      const { itemIndex } = state.curPanelData;
      const product = state.reviewProductList[itemIndex];
      if (product) {
        if (data.PartID) {
          const partIndex = product.PartList?.findIndex(it => it.ID === data.PartID);
          if (partIndex > -1) {
            const temp = { ...product.PartList[partIndex], ...data };
            delete temp.ProductID;
            delete temp.PartID;
            product.PartList.splice(partIndex, 1, temp);
          }
        } else {
          const temp = { ...product, ...data };
          delete temp.ProductID;
          delete temp.PartID;
          state.reviewProductList.splice(itemIndex, 1, temp);
        }
      }
    },

    setReviewSetupPanelList(state, list) {
      state.reviewSetupPanelList = list || [];
    },
    setReviewSetupPanelChange(state, { item, isEdit, isDelete }) { // 保存审稿设置成功后的处理函数
      if (!isDelete) {
        if (isEdit) { // 编辑
          const i = state.reviewSetupPanelList.findIndex(it => it.ID === item.ID);
          if (i > -1) {
            state.reviewSetupPanelList.splice(i, 1, item);
          }
        } else { // 新增
          state.reviewSetupPanelList.unshift(item);
        }
      } else {
        // 删除
        const i = state.reviewSetupPanelList.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          state.reviewSetupPanelList.splice(i, 1);
        }
      }
      // 全部处理完成后 对列表数据中数值进行修改
      if (state.curPanelData) {
        const { itemIndex, itemPartIndex, panelType } = state.curPanelData;
        const { KeyOfCount } = panelType;
        let target = state.reviewProductList[itemIndex];
        if (target) {
          if (itemPartIndex > -1) {
            const _partList = target.PartList.filter(it => it.IsSelected);
            target = _partList[itemPartIndex];
          }
          if (target && target.SetupCountAttribute) {
            target.SetupCountAttribute[KeyOfCount] = state.reviewSetupPanelList.length;
          }
        }
      }
    },
    setCurEditPanelItem(state, data) {
      state.curEditPanelItem = data;
    },
    setConditionPropList(state, list) {
      state.ConditionPropList = list || [];
    },
    /* 分配策略相关
    ---------------------------------- */
    setCondition4ReviewAllocationList(state, [[key1, key2], value]) { // 设置筛选条件
      if (key1 && key2) state.condition4ReviewAllocationList[key1][key2] = value;
      else if (key1) state.condition4ReviewAllocationList[key1] = value;
    },
    setReviewAllocationList(state, [list, count]) {
      state.reviewAllocationList = list || [];
      if (!count && count !== 0) return;
      state.reviewAllocationListNumber = count;
    },
    clearCondition4ReviewAllocationList(state) {
      state.condition4ReviewAllocationList = new ReviewAllocationListConditionClass();
    },
    setCurAllocationEditItem(state, item) {
      state.curAllocationEditItem = item;
    },
    setAllocationConditionPropList(state, list) {
      state.allocationConditionPropList = list || [];
    },
    setAllocationSetupPanelChange(state, { item, isEdit, isDelete }) { // 分配策略设置成功后的处理函数
      if (!isDelete) {
        if (isEdit) { // 编辑
          const i = state.reviewAllocationList.findIndex(it => it.ID === item.ID);
          if (i > -1) {
            state.reviewAllocationList.splice(i, 1, item);
          }
        } else { // 新增
          state.reviewAllocationList.unshift(item);
          state.reviewAllocationListNumber += 1;
        }
      } else {
        // 删除
        const i = state.reviewAllocationList.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          state.reviewAllocationList.splice(i, 1);
          state.reviewAllocationListNumber -= 1;
        }
      }
    },
    /* 人员分组相关
    ---------------------------------- */
    setReviewGroupList(state, [list, count]) {
      state.reviewGroupList = list || [];
      if (!count && count !== 0) return;
      state.reviewGroupListNumber = count;
    },
    setReviewGroupItemChange(state, { item, isDelete, index }) {
      if (isDelete) {
        state.reviewGroupList.splice(index, 1);
        return;
      }
      if (index > -1) {
        state.reviewGroupList.splice(index, 1, item);
      } else {
        state.reviewGroupList.unshift(item);
      }
    },
    changeReviewGroupItemNumber(state, { id, number, OnlineChangeNumber, StopDistributionChangeNumber }) {
      const t = state.reviewGroupList.find(it => it.ID === id);
      if (t) {
        t.TotalNumber += number;
        if (OnlineChangeNumber) {
          t.OnlineNumber += OnlineChangeNumber;
          if (t.OnlineNumber < 0) t.OnlineNumber = 0;
        }
        if (StopDistributionChangeNumber) {
          t.StopDistributionNumber += StopDistributionChangeNumber;
        }
      }
    },
  },
  actions: {
    /* 审稿设置相关
    ---------------------------------- */
    async getReviewProductList({ state, commit }, page = 1) { // 获取产品列表数据
      commit('setCondition4ReviewProductList', [['Page', ''], page]);
      commit('setReviewProductList', [[], undefined]);
      const _obj = CommonClassType.filter(state.condition4ReviewProductList);
      commit('setLoading', true);
      const resp = await api.getCheckFileProductList(_obj).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setReviewProductList', [resp.data.Data, resp.data.DataNumber]);
      }
    },
    async getOutputFileList({ commit }) { // 获取输出文件列表
      commit('setLoading', true);
      const resp = await api.getOutputFileList().catch(() => null);
      commit('setLoading', false);
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setOutputFileList', resp.data.Data || []);
      }
    },
    async getReviewSetupPanelList({ commit }, { type, productID, partID }) { // 获取审稿设置列表
      commit('setReviewSetupPanelList', []);
      commit('setLoading', true);
      const resp = await api.getCheckFileSetupList(type, productID, partID).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.data.Status === 1000) {
        commit('setReviewSetupPanelList', resp.data.Data);
      }
    },
    async getCheckFileSetupSave({ commit }, { data, callback }) { // 保存审稿设置
      if (!data) return;
      const resp = await api.getCheckFileSetupSave(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = {
            isEdit: !!data.ID,
            isDelete: false,
            item: { ...data, ID: data.ID || resp.data.Data },
          };
          commit('setReviewSetupPanelChange', temp);
          if (callback) callback();
        };
        messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async getCheckFileSetupRemove({ commit }, { item, callback }) { // 删除审稿设置
      if (!item) return;
      const resp = await api.getCheckFileSetupRemove(item.ID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = {
            isEdit: false,
            isDelete: true,
            item,
          };
          commit('setReviewSetupPanelChange', temp);
          if (callback) callback();
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    /* 分配策略相关
    ---------------------------------- */
    async getReviewAllocationList({ state, commit }, page = 1) { // 获取产品列表数据
      commit('setCondition4ReviewAllocationList', [['Page', ''], page]);
      commit('setReviewAllocationList', [[], undefined]);
      const _obj = CommonClassType.filter(state.condition4ReviewAllocationList);
      commit('setLoading', true);
      const resp = await api.getDistributionStrategyList(_obj).catch(() => null);
      commit('setLoading', false);
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setReviewAllocationList', [resp.data.Data, resp.data.DataNumber]);
      }
    },
    async getDistributionStrategySave({ commit }, { data, callback }) { // 保存审稿设置
      if (!data) return;
      const resp = await api.getDistributionStrategySave(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = {
            isEdit: !!data.ID,
            isDelete: false,
            item: { ...data, ID: data.ID || resp.data.Data },
          };
          commit('setAllocationSetupPanelChange', temp);
          if (callback) callback();
        };
        messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async getDistributionStrategyRemove({ commit }, { item, callback }) { // 删除审稿设置
      if (!item) return;
      const resp = await api.getDistributionStrategyRemove(item.ID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = {
            isEdit: false,
            isDelete: true,
            item,
          };
          commit('setAllocationSetupPanelChange', temp);
          if (callback) callback();
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    /* 人员分组相关
    ---------------------------------- */
    async getReviewGroupList({ commit }) { // 获取人员分组列表数据
      commit('setReviewGroupList', [[], undefined]);
      commit('setLoading', true);
      const resp = await api.getMemberGroupList().catch(() => null);
      commit('setLoading', false);
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setReviewGroupList', [resp.data.Data, resp.data.DataNumber]);
      }
    },
    async getMemberGroupRemove({ commit }, [item, index]) {
      if (!item) return;
      const { ID } = item;
      const resp = await api.getMemberGroupRemove(ID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setReviewGroupItemChange', { item, index, isDelete: true });
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
};

/*
  需要记录到审稿仓库中的数据有：
  一、 审稿设置：
        1. 条件筛选数据
        2. 默认流程数据
        3. 管理输出文件数据
        4. 列表数据
        5. 流程设置、输出文件、尺寸数量、文件页数及条件属性列表数据等（ 具体看情况 ）

  二、 分配策略：
        1. 列表数据
        2. 设置条件属性数据
        3. 默认分配组数据 （分组选择数据是否需要看情况）

  三、 人员分组：
        1. 组列表数据

*/
