/**
 * 状态管理 -- 统计分析
 */
import api from '@/api/index';
import messageBox from '@/assets/js/utils/message';
import SaveFormClassType from './SaveFormClassType';

export default {
  namespaced: true,
  state: {
    /** --------------------------------------------------------------------- 统计表相关 ↓ */
    /*  统计表保存信息 (新增|编辑)
    --------------------------------- */
    condition4SaveForm: null,
    /*  统计表列表数据获取条件信息
    --------------------------------- */
    considtion4DataList: {
      Type: '',
      Page: 1,
      PageSize: 20,
    },
    /*  统计表列表数据 及 数据条目数
    --------------------------------- */
    statisticFormDataList: null,
    statisticFormDataNumber: 0,
    /*  表格数据是否在加载中
    --------------------------------- */
    isTableDataLoading: false,
    /*  当前表格数据中产品筛选和区域筛选的文字显示信息
    --------------------------------- */
    curSelectedProductShowText: '',
    curSelectedAreaShowText: '',
    /** --------------------------------------------------------------------- 汇总面板相关 ↓ */
    /*  编辑添加汇总面板时，选择统计图表弹窗打开状态
    --------------------------------- */
    selectFormDialogShow: false,
    /*  统计配置汇总面板列表数据获取条件信息
    --------------------------------- */
    considtion4SummaryList: {
      Page: 1,
      PageSize: 20,
    },
    /*  统计配置面板列表数据 及 数据条目数
    --------------------------------- */
    statisticSummaryDataList: null,
    statisticSummaryDataNumber: 0,
    /*  当前正在编辑的统计配置面板信息
    --------------------------------- */
    curEditPanelItemData: null,
  },
  getters: {
  },
  mutations: {
    /** --------------------------------------------------------------------- 统计表相关 ↓ */
    /** 设置统计表条件信息
    --------------------------------- */
    setConditionForSaveForm(state, [[key1, key2, key3], value]) {
      if (!key2) state.condition4SaveForm[key1] = value;
      else if (!key3) state.condition4SaveForm[key1][key2] = value;
      else state.condition4SaveForm[key1][key2][key3] = value;
    },
    /** 初始化统计表条件信息 （可添加可编辑， 编辑模式需传递原有数据进来）
    --------------------------------- */
    setCondition4SaveFormInit(state, initData = null) { // initData: null | data
      state.condition4SaveForm = new SaveFormClassType(initData);
    },
    /* 设置统计表列表数据获取条件信息
    --------------------------------- */
    setConsidtion4DataList(state, [[key1, key2, key3], value]) {
      if (!key2) state.considtion4DataList[key1] = value;
      else if (!key3) state.considtion4DataList[key1][key2] = value;
      else state.considtion4DataList[key1][key2][key3] = value;
    },
    /*  统计表列表数据 及 数据条目数
    --------------------------------- */
    setStatisticDateList(state, [list, num]) {
      state.statisticFormDataList = list;
      if (num || num === 0) state.statisticFormDataNumber = num;
    },
    /*  删除统计表
    --------------------------------- */
    setStatisticFormItemRemove(state, id) {
      state.statisticFormDataList = state.statisticFormDataList.filter(it => it.ID !== id);
      state.statisticFormDataNumber -= 1;
    },
    /*  初始化统计表
    --------------------------------- */
    setStatisticFormItemInited(state, id) {
      const t = state.statisticFormDataList.find(it => it.ID === id);
      if (t) t.HaveInitial = true;
    },
    /*  设置表格数据是否在加载中
    --------------------------------- */
    setIsTableDataLoading(state, bool) {
      state.isTableDataLoading = bool;
    },
    /*  设置当前表格数据中产品筛选和区域筛选的文字显示信息
    --------------------------------- */
    setCurSelectedProductShowText(state, text) {
      state.curSelectedProductShowText = text;
    },
    setCurSelectedAreaShowText(state, text) {
      state.curSelectedAreaShowText = text;
    },
    /** --------------------------------------------------------------------- 汇总面板相关 ↓ */
    /*  设置编辑添加汇总面板时，选择统计图表弹窗打开状态
    --------------------------------- */
    setSelectFormDialogShow(state, bool) {
      state.selectFormDialogShow = bool;
    },
    /* 设置统计配置汇总面板列表数据获取条件信息
    --------------------------------- */
    setConsidtion4SummaryList(state, [[key1, key2, key3], value]) {
      if (!key2) state.considtion4SummaryList[key1] = value;
      else if (!key3) state.considtion4SummaryList[key1][key2] = value;
      else state.considtion4SummaryList[key1][key2][key3] = value;
    },
    /*  统计表列表数据 及 数据条目数
    --------------------------------- */
    setStatisticSummaryDateList(state, [list, num]) {
      state.statisticSummaryDataList = list;
      if (num || num === 0) state.statisticSummaryDataNumber = num;
    },
    /*  设置当前正在编辑的统计配置面板信息
    --------------------------------- */
    setCurEditPanelItemData(state, data) {
      state.curEditPanelItemData = data;
    },
    /*  删除单条统计汇总面板
    --------------------------------- */
    setStatisticSummaryItemRemove(state, id) {
      state.statisticSummaryDataList = state.statisticSummaryDataList.filter(it => it.ID !== id);
      state.statisticSummaryDataNumber -= 1;
    },
  },
  actions: {
    /** --------------------------------------------------------------------- 统计表相关 ↓ */
    /** 统计表保存
    --------------------------------- */
    async getStatisticFormSave({ state }, callback) {
      const temp = SaveFormClassType.transform(state.condition4SaveForm);
      if (typeof temp === 'string') {
        messageBox.failSingleError('保存失败', `[ ${temp} ]`);
        return;
      }
      const resp = await api.getStatisticConfigSave(temp);
      if (resp && resp.data.Status === 1000) {
        const _title = temp.ID ? '编辑成功' : '添加成功';
        messageBox.successSingle(_title, callback, callback);
      }
    },
    /** 获取统计表列表信息
    --------------------------------- */
    async getStatisticFormDataList({ state, commit }, page = 1) {
      commit('setConsidtion4DataList', [['Page'], page]);
      commit('setStatisticDateList', [[], '']);
      commit('setIsTableDataLoading', true);
      let key = true;
      const res = await api.getStatisticFormDataList(state.considtion4DataList).catch(() => { key = false; });
      commit('setIsTableDataLoading', false);
      if (key && res && res.data.Status === 1000) {
        commit('setStatisticDateList', [res.data.Data, res.data.DataNumber]);
        return true;
      }
      return false;
    },
    /** 获取统计表信息详情
    --------------------------------- */
    async getStatisticsConfigDetail({ state, commit }, id) {
      if (!id) return false;
      if (state.condition4SaveForm && state.condition4SaveForm.ID === id) return true;
      let key = true;
      const res = await api.getStatisticsConfigDetail(id).catch(() => { key = false; });
      if (key && res && res.data.Status === 1000) {
        commit('setCondition4SaveFormInit', res.data.Data);
        return true;
      }
      return false;
    },
    /** 删除统计表
    --------------------------------- */
    async getStatisticConfigRemove({ commit }, id) {
      if (!id) return false;
      let key = true;
      const res = await api.getStatisticConfigRemove(id).catch(() => { key = false; });
      if (key && res && res.data.Status === 1000) {
        const successFunc = () => {
          commit('setStatisticFormItemRemove', id);
        };
        messageBox.successSingle('删除成功!', successFunc, successFunc);
        return true;
      }
      return false;
    },
    /** 初始化统计表
    --------------------------------- */
    async getStatisticInitialData({ commit }, id) {
      if (!id) return false;
      let key = true;
      const res = await api.getStatisticInitialData(id).catch(() => { key = false; });
      if (key && res && res.data.Status === 1000) {
        const successFunc = () => {
          commit('setStatisticFormItemInited', id);
        };
        messageBox.successSingle('初始化成功!', successFunc, successFunc);
        return true;
      }
      return false;
    },
    /** --------------------------------------------------------------------- 汇总面板相关 ↓ */
    /** 获取统计汇总面板列表信息
    --------------------------------- */
    async getStatisticSummaryDataList({ state, commit }, page = 1) {
      commit('setConsidtion4SummaryList', [['Page'], page]);
      commit('setStatisticSummaryDateList', [[], '']);
      commit('setIsTableDataLoading', true);
      let key = true;
      const res = await api.getStatisticsSummaryList(state.considtion4SummaryList).catch(() => { key = false; });
      commit('setIsTableDataLoading', false);
      if (key && res && res.data.Status === 1000) {
        commit('setStatisticSummaryDateList', [res.data.Data, res.data.DataNumber]);
        return true;
      }
      return false;
    },
    /** 获取统计面板
    --------------------------------- */
    async getStatisticSummaryRemove({ commit }, id) {
      if (!id) return false;
      let key = true;
      const res = await api.getStatisticSummaryRemove(id).catch(() => { key = false; });
      if (key && res && res.data.Status === 1000) {
        const successFunc = () => {
          commit('setStatisticSummaryItemRemove', id);
        };
        messageBox.successSingle('删除成功!', successFunc, successFunc);
        return true;
      }
      return false;
    },
  },
};
