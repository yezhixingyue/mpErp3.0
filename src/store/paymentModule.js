/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import api from '@/api/index';
import messageBox from '../assets/js/utils/message';
/**
 * 该模块主要用于付款列表模块状态管理
 */

export default {
  namespaced: true,
  state: {
    /* 付款列表网络请求传递信息对象集合
    -------------------------------*/
    set2PaymentList: {
      Status: '',
      Operator: '',
      // payment: '',
      OrderType: '',
      CreateDate: {
        First: '',
        Second: '',
      },
      CustomerType: {
        First: '',
        Second: '',
      },
      KeyWords: '',
      Page: 1,
      PageSize: 30,
    },
    /* 接单员列表相关
    -------------------------------*/
    // staffList: [],
    /* 下单方式相关
    -------------------------------*/
    orderCreateTypeList: [
      { name: '不限', ID: '' },
      { name: '自助上传', ID: 2 },
      { name: '代客下单', ID: 1 },
    ],
    /* 时间选择相关
    -------------------------------*/
    selectedTimeArr: [0, 1, 0, 0, 0, 0],
    /* 订单状态相关
    -------------------------------*/
    selectedItemArr: [1, 0, 0, 0],
    /* 想要被删除的付款单ID
    -------------------------------*/
    ID2Del: '',
    /* 控制列表中 -付款弹窗- 的显示与隐藏
    -------------------------------*/
    isShow2PayDialog: false,
    /* 控制列表中 -详情弹窗- 的显示与隐藏
    -------------------------------*/
    isShow2DetailDialog: false,
    /* 打开弹窗时的当前payCode
    -------------------------------*/
    curPayCode: '',
    /* 网络获取到的付款单列表数据
    -------------------------------*/
    tableData: [],
    totalCount: 0,
    /* 加载更多付款单列表数据时显示左下方的loading加载图标
    -------------------------------*/
    showTableLoading: false,
    /* 支付相关信息(弹窗中使用)  DepositAmount, BalanceAmount, PayOnDelivery, FullPayout
    -------------------------------*/
    PayOnlineAmount: 0,
    BalanceAmount: 0,
    PayOnDelivery: 0,
    FullPayout: 0,
    payImgSrc: '', // 支付码src
    curCustomerName: '',
    /* 付款单详情信息( 需要两个数据组合使用 )
    -------------------------------*/
    PayDetailOrderList: {},
    PayDetailData: {},
    /* 付款单列表数据加载状态
    -------------------------------*/
    paymentDataLoading: false,
    /* 是否还能加载更多的列表数据
    -------------------------------*/
    canLoadingMore: false,
    /* 待付款订单页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    searchWatchKey: 0,
  },
  getters: {

  },
  mutations: {
    /* 设置订单状态
    -------------------------------*/
    setPaymentStatus(state, [i, id]) {
      state.selectedItemArr = [0, 0, 0, 0];
      state.selectedItemArr[i] = 1;
      state.set2PaymentList.Status = id;
    },
    /* 设置接单员信息
    -------------------------------*/
    setStaffInfo(state, value) {
      state.set2PaymentList.Operator = value;
    },
    // setstaffList(state, list) {
    //   const tempArr = [{ StaffID: '', StaffName: '不限' }];
    //   const arr = [...tempArr, ...list];
    //   state.staffList = arr;
    // },
    /* 设置付款单列表数据加载状态
    -------------------------------*/
    setPaymentDataLoading(state, boolean) {
      state.paymentDataLoading = boolean;
    },
    /* 设置支付方式
    -------------------------------*/
    // setPaymentType(state, value) {
    //   state.set2PaymentList.payment = value;
    // },
    /* 设置下单方式
    -------------------------------*/
    setOrderCreateType(state, value) {
      state.set2PaymentList.OrderType = value;
    },
    /* 时间选择相关
    -------------------------------*/
    setSelectTime(state, [type, num, obj]) {
      if (type !== 'timeSelect') {
        const timeObj = this.getters[`timeSelectModule/${type}`];
        state.set2PaymentList.CreateDate = timeObj;
      } else {
        state.set2PaymentList.CreateDate = obj;
      }
      state.selectedTimeArr = [0, 0, 0, 0, 0, 0];
      state.selectedTimeArr[num] = 1;
    //  console.log(state.set2PaymentList);
    },
    /* 关键字搜索相关
    -------------------------------*/
    setPlaceWord(state, type) {
    //  console.log(state.set2PaymentList.KeyWords, type);
      state.set2PaymentList.KeyWords = type;
    },
    /* 清除筛选项相关
    -------------------------------*/
    clearConfigObj(state, type = 'clear') {
      const _keywordsText = state.set2PaymentList.KeyWords;
      state.set2PaymentList = {
        Status: '',
        Operator: '',
        // payment: '',
        OrderType: '',
        CreateDate: {
          First: '',
          Second: '',
        },
        CustomerType: {
          First: '',
          Second: '',
        },
        KeyWords: '',
        Page: 1,
        PageSize: 30,
      };
      if (type === 'onKeyWordSubmit') state.set2PaymentList.KeyWords = _keywordsText;
      state.selectedTimeArr = [0, 1, 0, 0, 0, 0];
      state.selectedItemArr = [1, 0, 0, 0];
    },
    /* 设置想要被删除的付款单ID
    -------------------------------*/
    setID2Del(state, value) {
      state.ID2Del = value;
    },
    /* 控制列表中付款弹窗的显示与隐藏
    -------------------------------*/
    setIsShow2PayDialog(state, bool) {
      state.isShow2PayDialog = bool;
    },
    /* 控制列表中 -详情弹窗- 的显示与隐藏
    -------------------------------*/
    setIsShow2DetailDialog(state, bool) {
      state.isShow2DetailDialog = bool;
    },
    /* 设置付款单数据列表
    -------------------------------*/
    setTableData(state, data) {
      state.tableData = data;
    },
    setTotalCount(state, count) {
      state.totalCount = count;
    },
    addTableData(state, data) {
      state.tableData = [...state.tableData, ...data];
    },
    /* 设置付款单数据列表
    -------------------------------*/
    setShowTableLoading(state, bool) {
      state.showTableLoading = bool;
    },
    /* 设置支付金额 (支付弹窗中使用)
    -------------------------------*/
    setPayAmount(state, {
      PayOnlineAmount, BalanceAmount, PayOnDelivery, FullPayout, Name,
    }) {
      state.PayOnlineAmount = PayOnlineAmount;
      state.BalanceAmount = BalanceAmount;
      state.PayOnDelivery = PayOnDelivery;
      state.FullPayout = FullPayout;
      state.curCustomerName = Name;
    },
    setPayImgSrc(state, src) {
      state.payImgSrc = src;
    },
    /* 设置付款单详情信息( 两个数据组合使用 )
    -------------------------------*/
    setPayDetailOrderList(state, list) {
      state.PayDetailOrderList = list;
    },
    setPayDetailData(state, data) {
      state.PayDetailData = data;
    },
    /* 设置获取列表数据加载翻页 页码
    -------------------------------*/
    setLoadPage(state, num) {
      state.set2PaymentList.Page = num;
    },
    /* 设置是否还能加载更多的列表数据
    -------------------------------*/
    setCanLoadingMore(state, bool) {
      state.canLoadingMore = bool;
    },
    /* 设置打开弹窗时的当前payCode
    -------------------------------*/
    setCurPayCode(state, payCode) {
      state.curPayCode = payCode;
    },
    /* 待付款列表页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    setSearchWatchKey(state) {
      state.searchWatchKey += 1;
    },
    /** 设置请求列表数据的对象信息 --- 主要为订单状态
    ---------------------------------------- */
    setDataListRequestObj(state, [[key1, key2], value]) {
      if (!key2) state.set2PaymentList[key1] = value;
      else state.set2PaymentList[key1][key2] = value;
      // console.log(key1);
      // if (key1 === 'OrderType') state.set2PaymentList.Terminal = '';
    },
  },
  actions: {
    // 获取接单员列表
    // async getStaffList({ commit }) {
    //   const data = await api.getStaffList({ FieldType: 1 }).then((res) => res.data.Data);
    //   commit('setstaffList', data);
    // },
    // 获取付款单列表 type值： get  add  代表是第一次获取数据 或 加载更多数据
    async getPaymentListTableData({ state, commit }, prop = { page: 1, type: 'get' }) {
      let method = 'setTableData';
      if (prop.type === 'add') {
        commit('setLoadPage', state.set2PaymentList.Page + 1);
        commit('setShowTableLoading', true);
        method = 'addTableData';
      } else {
        commit('setLoadPage', prop.page);
        commit('setTableData', []);
      }
      commit('setCanLoadingMore', false);
      commit('setSearchWatchKey');
      commit('setPaymentDataLoading', true);
      const res = await api.getPaymentOrderList(state.set2PaymentList);
      commit('setPaymentDataLoading', false);
      if (!res) return;
      const list = res.data.Data.map((item) => {
        const OrderCreateTime = item.CreateTime ? item.CreateTime.split('.')[0].slice(0, -3).replace('T', ' ') : '';
        const OrderFinishTime = item.FinishTime ? item.FinishTime.split('.')[0].slice(0, -3).replace('T', ' ') : '';
        return {
          ...item,
          ...{ OrderCreateTime, OrderFinishTime },
        };
      });
      const count = res.data.DataNumber;
      commit(method, list);
      commit('setShowTableLoading', false);
      commit('setTotalCount', count);
      if (count > state.tableData.length) commit('setCanLoadingMore', true);
    },
    // 付款单取消
    async cancelPaymentOrder({ state, dispatch }, payCode) {
      const res = await api.cancelCustomerPay(payCode);
      if (!res) return;
      if (res.data.Status === 1000) {
        messageBox.successSingle('已取消', () => dispatch('getPaymentListTableData', { page: state.set2PaymentList.Page, type: 'get' }), () => dispatch('getPaymentListTableData', { page: state.set2PaymentList.Page, type: 'get' }));
      } else if (res.data.Status === 9062) {
        messageBox.failSingleError('该付款单取消失败 ！', '(您无权限取消他人创建的付款单)');
      }
    },
    // 付款单转待下单
    async transferToPrepareOrder({ state, dispatch }, payCode) {
      const res = await api.transferToPrepareOrder(payCode);
      //  console.log(res);
      if (!res) return;
      if (res.data.Status === 1000) {
        messageBox.successSingle('加入成功', () => dispatch('getPaymentListTableData', { page: state.set2PaymentList.Page, type: 'get' }), () => dispatch('getPaymentListTableData', { page: state.set2PaymentList.Page, type: 'get' }));
      } else if (res.data.Status === 9062) {
        messageBox.failSingleError('该付款单转移失败 ！', '(您无权限转移他人创建的付款单)');
      }
    },
    // 查询付款单详细信息   -------- 此方法可能用不到 后面确定使用不到的时候进行删除
    // eslint-disable-next-line no-unused-vars
    // async getPaymentOrderDetail({ dispatch }, payCode) {
    //   const res = await api.getPaymentOrderDetail(payCode);
    //   if (!res) return;
    //   //  console.log(res);
    // },
    // 根据付款单号获取订单列表
    async getPaymentOrderDetailByPayCode({ commit }, payCode) {
      const res = await api.getPaymentOrderDetailByPayCode(payCode);
      if (!res) return;
      commit('setPayDetailOrderList', res.data.Data);
    },
    // 根据付款单号轮询查询当前二维码对应订单付款状态
    async PollingPayStatus({ state }, cb) {
      const res = await api.PollingPayStatus(state.curPayCode);
      if (res.data.Status === 1000) {
        // if (res.data.Data === '')
        cb(res.data.Data);
      }
    },
  },
};
