/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-cycle */
import api from '@/api/index';
import { Message } from 'element-ui';
import messageBox from '../assets/js/utils/message';
import { asyncNonCurrentFunc } from '../assets/js/utils/util';

export default {
  namespaced: true,
  state: {
    /* 获取表格数据的请求对象
    -------------------------------*/
    searchCondition4UnPayList: {
      KeyWords: '', // 关键字搜索
      Status: 10,
      FieldType: 4,
      OrderType: '',
      Page: 1,
      PageSize: 30,
      OrderTaker: '',
    },
    /* 表格数据
    -------------------------------*/
    initTableData: null,
    /* 表格数据条目数
    -------------------------------*/
    count: 0,
    /* 当前订单ID
    -------------------------------*/
    curOrderID: '',
    /* 控制弹窗1- 详情弹窗显示状态
    -------------------------------*/
    isShowDia: false,
    /* 控制弹窗2- 预下单弹窗显示状态
    -------------------------------*/
    isShowPreDialog: false,
    /* 控制弹窗3- 支付二维码弹窗显示状态
    -------------------------------*/
    isShow2PayDialog: false,
    /* 订单详情数据
    -------------------------------*/
    orderDetailData: null,
    /* 当前支付弹窗信息 -- 预下单
    -------------------------------*/
    curPayListData: null,
    /* 当前所选择需要支付的订单列表(使用复选框选择及使用下方按钮提交)
    -------------------------------*/
    curSelectedList: [],
    /* 当前所选择需要支付的单个订单（不使用复选框，直接在列表中提交）
    -------------------------------*/
    curSelectedOrder: [],
    /* 当前所选择需要支付的单个订单（当前需要支付的订单列表，根据情况从上方中二选一）
    -------------------------------*/
    curToPayList: [],
    /* 支付二维码信息
    -------------------------------*/
    curPayInfo2Code: null,
    // /* 一个值，当其变化时，说明在请求支付码时余额足够已自动支付成功
    // -------------------------------*/
    // clock2PaySuccess: 0,
    /* input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    searchWatchKey: 0,
  },
  getters: {
    unPayTableData(state) {
      if (!state.initTableData || state.initTableData.length < 1) return null;
      const _obj = {};
      const list = state.initTableData;
      list.forEach((item) => {
        if (!_obj[item.CustomerNo]) {
          _obj[item.CustomerNo] = {
            CustomerName: item.CustomerName,
            CustomerNo: item.CustomerNo,
            subList: [item],
          };
        } else {
          _obj[item.CustomerNo].subList.push(item);
        }
      });
      return _obj;
    },
  },
  mutations: {
    /* 设置表格数据的请求对象
    -------------------------------*/
    setSearchCondition4UnPayList(state, [[key1, key2], value]) {
      if (!key2) state.searchCondition4UnPayList[key1] = value;
      else state.searchCondition4UnPayList[key1][key2] = value;
    },
    /* 清除表格数据请求对象搜索关键词
    -------------------------------*/
    clearSearchCondition4UnPayList(state) {
      state.searchCondition4UnPayList.KeyWords = '';
      state.searchCondition4UnPayList.Page = 1;
      state.searchCondition4UnPayList.OrderType = '';
      state.searchCondition4UnPayList.OrderTaker = '';
    },
    /* 设置表格数据
    -------------------------------*/
    setTableData(state, data) {
      const { Data, DataNumber } = data;
      state.initTableData = Data;
      if (DataNumber || DataNumber === 0) state.count = DataNumber;
    },
    setCurOrderID(state, id) {
      state.curOrderID = id;
    },
    /* 设置单个订单被删除后的状态
    -------------------------------*/
    setSingleOrderDataStatus(state) {
      const id = state.curOrderID;
      state.initTableData = state.initTableData.map((item) => {
        const _obj = { ...item };
        if (_obj.OrderID === id) {
          _obj.Status = 254;
        }
        return _obj;
      });
      state.curSelectedList = state.curSelectedList.map((item) => {
        const _obj = { ...item };
        if (_obj.OrderID === id) {
          _obj.Status = 254;
        }
        return _obj;
      });
      state.curSelectedList = state.curSelectedList.filter((item) => item.Status === 10);
    },
    /* 设置多个订单被删除后的状态
    -------------------------------*/
    setMultipleOrderDataStatus(state, hasWrongList) {
      const _notNeedChangelist = hasWrongList ? hasWrongList.map(it => it.OrderID) : [];
      state.curSelectedList.forEach((subOrder) => {
        state.initTableData = state.initTableData.map((item) => {
          const _obj = { ...item };
          if (_obj.OrderID === subOrder.OrderID && !_notNeedChangelist.includes(subOrder.OrderID)) {
            _obj.Status = 254;
          }
          return _obj;
        });
      });
      state.curSelectedList = [];
    },
    /* 设置订单付款成功后的状态
    -------------------------------*/
    setPaySuccessOrderDataStatus(state) {
      state.curToPayList.forEach((subOrder) => {
        state.initTableData = state.initTableData.map((item) => {
          const _obj = { ...item };
          if (_obj.OrderID === subOrder.OrderID) _obj.Status = 200;
          return _obj;
        });
      });
      state.curSelectedList = [];
      state.curSelectedOrder = [];
      state.curToPayList = [];
    },
    /* 设置订单列表中删除除未付款的其它状态的订单
    -------------------------------*/
    clearInitTableData(state) {
      if (state.initTableData.length === 0) return;
      const list = state.initTableData.filter((item) => item.Status === 10);
      const clearLen = state.initTableData.length - list.length;
      if (clearLen > 0) {
        state.initTableData = list;
        Message.success('已清除！');
      } else if (list.length === state.initTableData.length) {
        Message.error({
          message: '当前没有要清除的订单',
          showClose: true,
        });
      }
    },
    /* 设置控制弹窗1显示 - 详情
    -------------------------------*/
    setIsShowDia(state, key) {
      state.isShowDia = key;
    },
    /* 设置订单详情
    -------------------------------*/
    setOrderDetailData(state, data) {
      if (data) {
        state.orderDetailData = data;
      }
    },
    /* 当前支付弹窗信息 -- 预下单
    -------------------------------*/
    setCurPayListData(state, data) {
      state.curPayListData = data;
    },
    /* 设置控制弹窗2- 预下单弹窗显示状态
    -------------------------------*/
    setIsShowPreDialog(state, key) {
      state.isShowPreDialog = key;
    },
    /* 控制弹窗3- 支付二维码弹窗显示状态
    -------------------------------*/
    setIsShow2PayDialog(state, bool) {
      state.isShow2PayDialog = bool;
    },
    /* 设置当前所选择需要支付的订单列表
    -------------------------------*/
    addCurSelectedList(state, item) { // 添加一个单项
      state.curSelectedList.push(item);
    },
    setCurSelectedList(state, itemList) { // 整体赋值
      state.curSelectedList = [...itemList];
    },
    /* 设置当前所选择需要支付的单个订单
    -------------------------------*/
    setSingleSelectedOrder(state, data) {
      state.curSelectedOrder = [data];
    },
    /* 设置当前所需要支付的订单
    -------------------------------*/
    setCurToPayList(state, list) {
      state.curToPayList = list;
    },
    /* 设置支付二维码信息
    -------------------------------*/
    setCurPayInfo2Code(state, data) {
      state.curPayInfo2Code = data;
    },
    // /* 一个值，当其变化时，说明在请求支付码时余额足够已自动支付成功
    // -------------------------------*/
    // setClock2PaySuccess(state) {
    //   state.clock2PaySuccess += 1;
    // },
    /* 页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    setSearchWatchKey(state) {
      state.searchWatchKey += 1;
    },
  },
  actions: {
    /* ajax请求表格数据
    -------------------------------*/
    async getTableData({ state, commit }, page = 1) {
      commit('setTableData', { Data: [], DataNumber: '' });
      commit('setSearchCondition4UnPayList', [['Page', ''], page]);

      const _obj = JSON.parse(JSON.stringify(state.searchCondition4UnPayList));
      if (!_obj.KeyWords && _obj.KeyWords !== 0) {
        delete _obj.KeyWords;
      }
      commit('setSearchWatchKey');
      const res = await api.getUnpayList(_obj);

      if (res.data.Status !== 1000) return;

      commit('setTableData', res.data);
    },
    /* 删除单个订单
    -------------------------------*/
    async delTargetOrder({ state, commit }) {
      const obj = {
        OrderID: state.curOrderID,
      };
      const result = await api.cancelStaffOrder(obj);
      if (result.data.Status === 1000) {
        messageBox.successSingle('取消成功', () => { commit('setSingleOrderDataStatus'); }, () => { commit('setSingleOrderDataStatus'); });
      } else if (result.data.Status === 9062) {
        messageBox.failSingleError('该订单取消失败 ！', '(您无权限取消他人创建的订单)');
      }
    },
    /* 批量删除订单
    -------------------------------*/
    async cancelOrderList({ state, commit }) {
      if (state.curSelectedList.length === 0) Message.error('未选择订单');
      // -----------下    并发方式
      // const proList = state.curSelectedList.map(async (item) => await api.cancelStaffOrder({
      //   OrderID: item.OrderID,
      // }));
      // const res = await Promise.all(proList);
      // -----------上

      const _list = state.curSelectedList.map(it => ({ OrderID: it.OrderID, closeTip: true }));

      const res = await asyncNonCurrentFunc(api.cancelStaffOrder, _list);

      const _res = res.map((it, i) => ({ ...it, OrderID: _list[i].OrderID })); // 非并发方式处理批量取消，获取总结果

      const hasWrongList = _res.filter(it => it.data.Status !== 1000);

      if (hasWrongList.length === 0) { // 如果没有取消失败的项则提示成功
        Message.success('取消成功！');
        commit('setMultipleOrderDataStatus');
        return;
      }

      const _errTextList = hasWrongList.map(it => ({
        OrderID: it.OrderID,
        Status: it.data.Status,
        Message: it.data.Message,
      }));
      commit('setMultipleOrderDataStatus', _errTextList); // 有失败项，把失败项除外的订单进行状态改变

      const _obj = {};
      _errTextList.forEach(it => { // 提取重复错误
        if (!_obj[it.Message]) _obj[it.Message] = [];
        _obj[it.Message].push(it.OrderID);
      });

      const _strArr = Object.keys(_obj).map(key => { // 汇总错误信息
        const OrderIDList2Text = _obj[key].join('、');
        return `订单${OrderIDList2Text}取消失败,失败原因：[ ${key} ]`;
      });
      messageBox.failSingleError('部分订单取消失败 ！', _strArr.join(';')); // 弹窗提示出错订单
    },
    async getOrderDetail({ state, commit }) { // 查询订单详情
      const res = await api.getOrderDetail(state.curOrderID);
      if (res.data.Message === 1000) return;
      commit('setOrderDetailData', res.data.Data);
    //  console.log(state.orderDetailData);
    },
    async getPrePayData({ state, commit }, { type }) { // 预下单
      let tempList;
      if (type === 'single') tempList = state.curSelectedOrder;
      else if (type === 'all') tempList = state.curSelectedList;
      commit('setCurToPayList', tempList);
      const obj2Request = { List: [{ ID: 0 }] };
      obj2Request.List = state.curToPayList.map((item) => ({ ID: item.OrderID }));
      const res = await api.getPrePayData(obj2Request);
      if (res.data.Status === 1000) {
        commit('setCurPayListData', res.data.Data);
      } else {
        throw new Error(res.data.Message);
      }
    },
    async createPaymentOrder({ state, commit, dispatch }, isPayInFull) { // 提交订单
      const obj2Request = {
        PayInFull: isPayInFull,
        IsOrder: true,
        OrderType: 1,
        IsCreate: true,
        List: [{ ID: 0 }],
      };
      obj2Request.List = state.curToPayList.map((item) => ({ ID: item.OrderID }));
      const res = await api.createPaymentOrder(obj2Request);
      if (res.data.Status === 1000) {
        commit('setCurPayInfo2Code', res.data.Data);
        if (!res.data.Data) {
          // commit('setClock2PaySuccess');
          messageBox.successSingle(
            '下单成功!',
            () => {
              commit('setPaySuccessOrderDataStatus');
              commit('setIsShow2PayDialog', false);
              commit('setIsShowPreDialog', false);
            },
            () => {
              commit('setPaySuccessOrderDataStatus');
              commit('setIsShow2PayDialog', false);
              commit('setIsShowPreDialog', false);
            },
          );
        }
      } else {
        throw new Error(res.data.Message);
      }
    },
    // 根据付款单号轮询查询当前二维码对应订单付款状态
    async getPayResult({ state }, cb) {
      if (!state.curPayInfo2Code || !state.curPayInfo2Code.PayCode) return;
      const res = await api.getPayResult(state.curPayInfo2Code.PayCode);
      if (res.data.Status === 1000) cb(res.data.Data);
    },
  },
};
