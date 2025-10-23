/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import api from '@/api/index';
import CommonClassType from '@/store/CommonClassType';
// import { getStatusString } from '@/assets/js/util';
// import filterOrderRequest from '@/assets/js/utils/filterOrderRequest';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import ShowProductDetail from '@/assets/js/TypeClass/ShowProductDetail';
import messageBox from '../assets/js/utils/message';

/**
 * 该模块主要用于订单列表和发货包裹模块的状态管理
 */

export default {
  namespaced: true, // 开启命名空间
  state: {
    /* 销售区域相关
    -------------------------------*/
    areaList: [],
    largeTitle: '不限',
    midTitle: '不限',
    smTitle: '不限',
    /* 用户相关
    -------------------------------*/
    userTypeTitle: '不限',
    userRankTitle: '不限',
    /* 订单状态相关
    -------------------------------*/
    OrderStatusList: [
      // canStopProduction 终止生产
      // canCancelInMyFactory 取消订单非s2b平台
      { name: '不限', ID: '' },
      { name: '待分发', ID: 20, canCancel: true, canCancelInMyFactory: true },
      { name: '已分发', ID: 30, canCancel: true, canCancelInMyFactory: true },
      { name: '已审稿', ID: 40, canCancel: true, canCancelInMyFactory: true },
      { name: '内容已审核', ID: 42, canCancel: true, canCancelInMyFactory: true },
      { name: '已发至工厂', ID: 43, canCancel: true, canStopProduction: true, canProdProgress: true },
      { name: '拼版中', ID: 45, canStopProduction: true, canProdProgress: true },
      { name: '已拼版', ID: 50, canStopProduction: true, canProdProgress: true },
      { name: '生产中', ID: 55, canStopProduction: true, canProdProgress: true },
      { name: '已生产', ID: 60, canProdProgress: true },
      { name: '已入库', ID: 70, canProdProgress: true },
      { name: '已发货', ID: 80, canProdProgress: true },
      { name: '已完成', ID: 200, canProdProgress: true },
      { name: '终止生产', ID: 253 },
      { name: '已取消', ID: 254 },
      { name: '已过期', ID: 255 },
      { name: '问题件', ID: 35, canCancel: true, canCancelInMyFactory: true, isProblemShipment: true },
    ],
    orderStatueTitle: '不限',
    /* 订单进度信息
    -------------------------------*/
    orderProgress: [], // 网络获取到的数据
    lastOrderID4OrderProgressRequest: null, // 最后一次用来获取订单进度信息的订单
    expressTitle: '不限',
    deliverTitle: '不限',
    /* 获取数据网络请求所需信息对象
    -------------------------------*/
    objForOrderList: {
      SellArea: {
        RegionalID: '',
        CityID: '',
        CountyID: '',
      },
      ProductClass: {
        First: '',
        Second: '',
      },
      ProductID: '',
      CustomerType: {
        First: '',
        Second: '',
      },
      Page: 1,
      PayListPage: 1,
      PageSize: 20,
      Status: '',
      ExpressType: '',
      KeyWords: '',
      OrderType: '',
      Terminal: '',
      PlaceDate: {
        First: '',
        Second: '',
      },
      OrderTaker: '',
      DeliverStatus: '',
      DateType: 'today',
      FieldType: 2,
      OnlyShowOwnQuestionOrder: false,
      IsPause: false,
    },
    /* 订单列表数据（网络请求到的）
    -------------------------------*/
    orderListData: [],
    orderTotalCount: 0,
    orderTotalAmount: 0,
    /* 订单列表数据加载状态
    -------------------------------*/
    orderDataLoading: false,
    /* 运单列表数据加载状态
    -------------------------------*/
    // packListDataLoading: false,
    /* 时间选择相关
    -------------------------------*/
    selectedTimeArr: [0, 1, 0, 0, 0, 0],
    /* 订单列表弹窗dialog相关
    -------------------------------*/
    orderListDialogShow: false,
    orderListDialogShowText: '',
    /* 订单列表删除相关
    -------------------------------*/
    orderID2Del: '',
    // isDelPopShow: false,
    /* 订单详情
    -------------------------------*/
    orderDetailData: null,
    /* 当前售后客户详情与售后记录详情
    -------------------------------*/
    curCustomerInfo2Service: null,
    curServiceOrderHistory: [],
    /* 当前在查看订单的ID  用于tab切换时获取网络请求数据 curOrderStatus
    -------------------------------*/
    curOrderID: '',
    curOrderStatus: '',
    curOrderProductName: '',
    /* 当前在查看订单的运单ID  用于tab切换时获取网络请求数据
    -------------------------------*/
    curExpressID: '',
    /* 当前在查看订单的运单号  用于配送进度展示
    -------------------------------*/
    ExpressNo: '',
    /* 是否可以加载更多 及  表格加载项是否显示状态
    -------------------------------*/
    orderListCanLoadMore: false,
    isTableLoading: false,
    /* 售后弹窗展示状态
    -------------------------------*/
    isShowServiceDia: false,
    /* 弹窗 -- 包裹列表表格数据
    -------------------------------*/
    dialogPackageData: {},
    /* 弹窗 -- 包裹配送进度数据
    -------------------------------*/
    expressProgressData: null,
    lastExpressID4ExpressProgressRequest: null, // 最后一次用来获取物流进度信息的订单
    orderProgressDateSetTime: null,
    orderDetailDateSetTime: null,
    packageListDateByOrderSetTime: null,
    packageListDateByexpressSetTime: null,
    expressProgressDateSetTime: null,
    requestDuration: 30000, // 可请求间隔 30秒
    /* 订单和运单列表页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    searchWatchKey: 0,
  },
  getters: {
    /* 订单列表删除相关
    -------------------------------*/
    orderDelContent(state) {
      return `订单编号： ${state.orderID2Del}`;
    },
    /* 当前订单产品工艺、属性、尺寸等信息提取出来的字符串，用于售后单提交和详情页面的产品卡片展示
    -------------------------------*/
    curProductInfoStringify(state) {
      if (!state.orderDetailData) return '';
      return ShowProductDetail.getDisplayStringFromPartDataByDetailData(state.orderDetailData);
    },
  },
  mutations: {
    /* 销售区域相关
    -------------------------------*/
    setSellAreaRegional(state, [ID, name]) {
      state.objForOrderList.SellArea.RegionalID = ID;
      state.objForOrderList.SellArea.CityID = '';
      state.objForOrderList.SellArea.CountyID = '';
      state.largeTitle = name;
      state.midTitle = '不限';
      state.smTitle = '不限';
    },
    setSellAreaCity(state, [ID, name]) {
      state.objForOrderList.SellArea.CityID = ID;
      state.objForOrderList.SellArea.CountyID = '';
      state.midTitle = name;
      state.smTitle = '不限';
    },
    setSellAreaCounty(state, [ID, name]) {
      state.objForOrderList.SellArea.CountyID = ID;
      state.smTitle = name;
    },
    /* 用户相关
    -------------------------------*/
    setUserType(state, [ID, name]) {
      state.objForOrderList.CustomerType.First = ID;
      state.userTypeTitle = name;
    },
    setUserRank(state, [ID, name]) {
      state.userRankTitle = name;
      state.objForOrderList.CustomerType.Second = ID;
    },
    /* 订单状态相关
    -------------------------------*/
    setOrderStatus(state, [ID, name]) {
      if (state.orderStatueTitle === name) return;
      state.orderStatueTitle = name;
      state.objForOrderList.Status = ID;
    },
    /* 设置订单进度
    -------------------------------*/
    setOrderProgress(state, data) {
      state.orderProgress = data.reverse();
    },
    serLastOrderID4OrderProgressRequest(state, ID) {
      state.lastOrderID4OrderProgressRequest = ID;
    },
    setExpressType(state, [ID, name]) {
      state.expressTitle = name;
      state.objForOrderList.ExpressType = ID;
    },
    /* 物流状态相关
    -------------------------------*/
    setDeliverStatus(state, [ID, name]) {
      state.deliverTitle = name;
      state.objForOrderList.DeliverStatus = ID;
    },
    /* 时间选择相关
    -------------------------------*/
    setSelectTime(state, [type, num, obj]) {
      if (type !== 'timeSelect') {
        const timeObj = this.getters[`timeSelectModule/${type}`];
        state.objForOrderList.PlaceDate = timeObj;
      } else {
        state.objForOrderList.PlaceDate = obj;
      }
      state.selectedTimeArr = [0, 0, 0, 0, 0, 0];
      state.selectedTimeArr[num] = 1;
    },
    /* 关键字搜索相关
    -------------------------------*/
    setPlaceWord(state, type) {
      state.objForOrderList.KeyWords = type;
    },
    /** 设置请求列表数据的对象信息 --- 主要为订单状态
    ---------------------------------------- */
    setOrderManageRequestObj(state, [[key1, key2], value]) {
      if (!key2) state.objForOrderList[key1] = value;
      else state.objForOrderList[key1][key2] = value;
      if (key1 === 'OrderType') state.objForOrderList.Terminal = '';
      if (key1 === 'Status') state.objForOrderList.OnlyShowOwnQuestionOrder = false;
    },
    /* 设置获取列表数据加载翻页 页码
    -------------------------------*/
    setLoadPage(state, num) {
      state.objForOrderList.Page = num;
    },
    /* 设置是否可以加载更多列表数据 及 设置表格加载中显示状态--订单列表
    -------------------------------*/
    setOrderListCanLoadMore(state, bool = false) {
      state.orderListCanLoadMore = bool;
    },
    setIsTableLoading(state, bool) {
      state.isTableLoading = bool;
    },
    /* 清除筛选项相关  type默认为clear  如果不为clear时不清除keywords
    -------------------------------*/
    clearConfigObj(state, type = 'clear') {
      const _keywordsText = state.objForOrderList.KeyWords;
      state.objForOrderList = {
        SellArea: {
          RegionalID: '',
          CityID: '',
          CountyID: '',
        },
        ProductClass: {
          First: '',
          Second: '',
        },
        ProductID: '',
        CustomerType: {
          First: '',
          Second: '',
        },
        Status: '',
        KeyWords: '',
        ExpressType: '',
        Page: 1,
        PageSize: 20,
        OrderType: '',
        Terminal: '',
        PlaceDate: {
          First: '',
          Second: '',
        },
        OrderTaker: '',
        DeliverStatus: '',
        DateType: 'today',
        FieldType: 2,
        OnlyShowOwnQuestionOrder: false,
        IsPause: false,
      };
      if (type === 'onKeyWordSubmit') state.objForOrderList.KeyWords = _keywordsText;
      state.largeTitle = '不限';
      state.midTitle = '不限';
      state.smTitle = '不限';
      state.largeProTitle = '不限';
      state.midProTitle = '不限';
      state.smProTitle = '不限';
      state.subProductList = [{ ProductID: 0, ProductName: '不限' }];
      state.userTypeTitle = '不限';
      state.userRankTitle = '不限';
      state.orderStatueTitle = '不限';
      state.expressTitle = '不限';
      state.selectedTimeArr = [0, 1, 0, 0, 0, 0];
      state.deliverTitle = '不限';
    },
    /* 订单列表相关
    -------------------------------*/
    setOrderListDialogShowText(state, value) {
      if (value && typeof (value) === 'string') state.orderListDialogShowText = value;
    },
    setOrderListDialogShow(state, value) {
      state.orderListDialogShow = true;
      state.orderListDialogShowText = value;
    },
    setOrderListDialogHide(state) {
      state.orderListDialogShow = false;
      state.orderListDialogShowText = '';
    },
    /* 接单员列表相关
    -------------------------------*/
    setOrderTaker(state, id) {
      state.objForOrderList.OrderTaker = id;
    },
    /* 订单列表删除相关
    -------------------------------*/
    setOrderID2Del(state, data) {
      state.orderID2Del = data;
    },
    /* 设置网络请求到的数据列表信息及数据总数量
    -------------------------------*/
    // 订单列表部分
    setOrderListData(state, data) {
      if (!data) return;
      state.orderListData = data;
    },
    addOrderListData(state, data) {
      if (!data) return;
      const list = [...state.orderListData, ...data];
      state.orderListData = list;
    },
    setOrderTotalCount(state, num) {
      state.orderTotalCount = num;
    },
    setOrderTotalAmount(state, amount) {
      state.orderTotalAmount = amount;
    },
    changePauseOrderListData(state, data) {
      const _detailData = localStorage.getItem('staffDetailData');
      const userInfo = JSON.parse(_detailData);
      const temp = { ...data };
      const _date = new Date();
      const year = _date.getFullYear(); // 年
      const month = _date.getMonth(); // 月 ------------- 用于显示时 应 + 1 处理
      const day = _date.getDate(); // 当前日
      const h = _date.getHours(); // 当前时
      const m = _date.getMinutes(); // 当前分
      const s = _date.getSeconds(); // 当前秒
      const andZero = (num) => {
        if (num < 10) {
          return `0${num}`;
        }
        return num;
      };
      temp.PauseTime = `${year}-${andZero(month)}-${andZero(day)}T${andZero(h)}:${andZero(m)}:${andZero(s)}.997`;
      temp.PausePerson = userInfo.StaffName;
      temp.PauseRemark = data.Remark;
      const index = state.orderListData.findIndex(it => it.OrderID === data.OrderID);
      state.orderListData[index].OrderPause = temp;
    },
    changeStatus4OrderListData(state, [index, status]) {
      state.orderListData[index].Status = status;
    },
    changeIsExpressChangeable4OrderListData(state, [index, bool]) { // 修改运费结算状态
      state.orderListData[index].IsExpressChangeable = bool;
    },
    changeAllowAfterSaleOrderListData(state, [index, status]) {
      state.orderListData[index].AllowAfterSale = status;
    },
    /* 设置订单列表数据加载状态
    -------------------------------*/
    setOrderDataLoading(state, boolean) {
      state.orderDataLoading = boolean;
    },
    /* 设置订单详情
    -------------------------------*/
    setOrderDetailData(state, data) {
      if (data) {
        state.orderDetailData = data;
      }
    },
    /* 设置当前售后客户详情与售后记录详情
    -------------------------------*/
    setCurCustomerInfo2Service(state, data) {
      state.curCustomerInfo2Service = data;
    },
    setCurServiceOrderHistory(state, data) {
      state.curServiceOrderHistory = data;
    },
    /* 设置当前订单ID
    -------------------------------*/
    setCurOrderID(state, orderID) {
      state.curOrderID = orderID;
    },
    /* 设置当前订单状态
    -------------------------------*/
    setCurOrderStatus(state, Status) {
      state.curOrderStatus = Status;
    },
    /* 设置当前订单状态 curOrderProductName
    -------------------------------*/
    setCurOrderProductName(state, name) {
      state.curOrderProductName = name;
    },
    /* 设置当前运单ID
    -------------------------------*/
    setCurExpressID(state, orderID) {
      state.curExpressID = orderID;
    },
    /* 弹窗 -- 设置包裹对应的包裹号
    -------------------------------*/
    setCurExpressNumber(state, ExpressNo) {
      state.ExpressNo = ExpressNo;
    },
    /* 设置售后弹窗展示状态
    -------------------------------*/
    setIsShowServiceDiaTrue(state) {
      state.isShowServiceDia = true;
    },
    setIsShowServiceDiaFail(state) {
      state.isShowServiceDia = false;
    },
    /* 弹窗 -- 设置包裹列表表格数据
    -------------------------------*/
    setDialogPackageData(state, data) {
      state.dialogPackageData = data;
    },
    /* 弹窗 -- 设置包裹配送进度数据
    -------------------------------*/
    setExpressProgressData(state, data) {
      state.expressProgressData = data;
      state.lastExpressID4ExpressProgressRequest = state.curExpressID;
    },
    /* 设置状态时的时间戳 -- 用于判断是否获取新数据
    -------------------------------*/
    setOrderProgressDateSetTime(state, date) {
      state.orderProgressDateSetTime = date;
    },
    setPackageListDateByOrderSetTime(state, date) {
      state.packageListDateByOrderSetTime = date;
    },
    setPackageListDateByexpressSetTime(state, date) {
      state.packageListDateByexpressSetTime = date;
    },
    setExpressProgressDateSetTime(state, date) {
      state.expressProgressDateSetTime = date;
    },
    setOrderDetailDateSetTime(state, date) {
      state.orderDetailDateSetTime = date;
    },
    /* 订单和运单列表页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    setSearchWatchKey(state) {
      state.searchWatchKey += 1;
    },
    afterOrderReCheckFile(state, OrderID) {
      state.orderDetailData.Status = 30;
      const _t = state.orderListData.find(it => it.OrderID === OrderID);
      _t.Status = 30;
      state.orderProgress = [];
      state.lastOrderID4OrderProgressRequest = null;
    },
    setDate(state) {
      CommonClassType.setDate(state.objForOrderList, 'PlaceDate');
    },
  },
  actions: {
    async getOrderPause({ commit }, prop) { // 暂停
      const res = await api.getOrderPause(prop.submitData); // 网络请求
      if (!res) return;
      if (res.data.Status === 1000) {
        commit('changePauseOrderListData', prop.submitData);
        if (prop.back) prop.back();
      }
    },
    async getOrderTableData({ state, commit }, prop = { page: 1, type: 'get' }) { // 获取订单管理列表数据
      let method;
      if (prop.type === 'get') {
        // 根据type来判断是第一次加载数据还是加载更多数据
        method = 'setOrderListData';
        commit('setOrderListData', []);
        commit('setLoadPage', prop.page);
      } else if (prop.type === 'add') {
        method = 'addOrderListData';
        commit('setLoadPage', state.objForOrderList.Page + 1); // 加载更多数据时，设置请求页面 + 1
        commit('setIsTableLoading', true); // 同时，设置显示出表格上的loading图标
      }
      commit('setOrderListCanLoadMore', false); // 请求数据前，设置此时是否可加载更多数据的状态为不可加载更多
      commit('setDate');
      const config = CommonClassType.filter(state.objForOrderList, true); // 获取经过处理过的请求头配置对象
      commit('setOrderDataLoading', true);
      commit('setSearchWatchKey');
      const res = await api.getOrderList(config); // 网络请求
      commit('setOrderDataLoading', false);
      if (!res) return;
      if (res.data.Status === 1000) {
        commit('setOrderTotalCount', res.data.DataNumber); // 设置列表数据总条数
        commit(method, res.data.Data); // 根据方式不同对应设置或添加数据
        commit('setIsTableLoading', false); // 获取数据完成后，修改表格正在加载中状态为关闭状态
        if (res.data.Message && prop.page === 1) commit('setOrderTotalAmount', res.data.Message);
        if (state.orderListData.length < state.orderTotalCount) commit('setOrderListCanLoadMore', true);
        // 判断 如果获取到的数据长度 小于 全部数据的长度，说明后面还有数据没加载完， 此时设置是否可加载更多数据的状态为可以加载更多
      }
    },
    /* 订单列表删除相关
    -------------------------------*/
    async delTargetOrder({ state, commit }, index) {
      const obj = {
        OrderID: state.orderID2Del,
      };
      const result = await api.cancelStaffOrder(obj);
      if (result.data.Status === 1000) {
        messageBox.successSingle('取消成功', () => {
          commit('changeStatus4OrderListData', [index, 254]);
          commit('changeIsExpressChangeable4OrderListData', [index, false]);
        }, () => {
          commit('changeStatus4OrderListData', [index, 254]);
          commit('changeIsExpressChangeable4OrderListData', [index, false]);
        });
      }
    },
    async getOrderDetail({ state, commit }) { // 查询订单详情
      const res = await api.getOrderDetail(state.curOrderID);
      if (res.data.Status !== 1000) return;
      commit('setOrderDetailData', res.data.Data);
      commit('setOrderDetailDateSetTime', new Date().getTime());
    },
    // async getServiceOrderHistory({ state, commit }) { // 查询售后单历史记录
    //   const res = await api.getServiceOrderHistory(state.curOrderID);
    //   if (res.data.Status === 1000) {
    //     commit('setCurCustomerInfo2Service', res.data.Data.Customer);
    //     commit('setCurServiceOrderHistory', res.data.Data.List);
    //   } else {
    //     throw new Error(res.data.Message);
    //   }
    // },
    async selectOrderProgress({ state, commit }) { // 查询订单进度
      const res = await api.selectOrderProgress(state.curOrderID);
      if (!res) return;
      if (res.data.Status !== 1000) {
        throw new Error(res.data.Message);
      }
      commit('setOrderProgress', res.data.Data);
      commit('serLastOrderID4OrderProgressRequest', state.curOrderID);
      commit('setOrderProgressDateSetTime', new Date().getTime());
    },
    async getPackageListByExressID({ state, commit }) { // 通过运单号获取包裹列表
      const res = await api.getPackageListByExressID(state.curExpressID);
      if (res.data.Status === 1000) {
        commit('setDialogPackageData', { BackPackageInfos: res.data.Data, PackageBills: [], ExpressBillType: 0 });
        commit('setPackageListDateByexpressSetTime', new Date().getTime());
      } else {
        throw new Error(res.data.Message);
      }
    },
    async getPackageListByOrderID({ state, commit }) { // 通过订单号获取包裹列表
      const res = await api.getPackagesByOrderID(state.curOrderID);
      if (res.data.Status === 1000) {
        commit('setDialogPackageData', res.data.Data);
        commit('setPackageListDateByOrderSetTime', new Date().getTime());
      }
    },
    async getExpressProgress({ state, commit }) { // 获取运单配送进度
      const res = await api.getExpressProgress(state.curExpressID);
      if (res.data.Status === 1000) {
        commit('setExpressProgressData', res.data.Data);
        commit('setExpressProgressDateSetTime', new Date().getTime());
      } else {
        throw new Error(res.data.Message);
      }
    },
    /* 导出Excel表格数据
    -------------------------------*/
    async getOrderListData2Excel({ state, commit }, type = 'normal') { // excel文件下载
      commit('setDate');
      const config = CommonClassType.filter(state.objForOrderList, true); // 获取经过处理过的请求头配置对象
      delete config.Page;
      delete config.PageSize;

      const res = await api.getOrderListData2Excel(config, type);
      if (res.status !== 200) {
        messageBox.failSingleError('出错啦 ！', `[ 下载失败：${res.statusText} ]`);
        return;
      }

      const { data } = res;
      const blobData = new Blob([data], { type: 'application/vnd.ms-excel' });

      const _str = type === 'normal' ? '订单列表' : '财务订单列表';
      let fileName = `${_str}.xls`;

      if (!config.PlaceDate) {
        fileName = `${_str}(全部).xls`;
      } else {
        const { First, Second } = config.PlaceDate;
        if (First && Second) {
          const f = First.split('T')[0];
          let _second = '';
          if (new Date(Second) > new Date()) {
            const PlaceDate = this.getters['timeSelectModule/TodayDate'];
            _second = PlaceDate.Second;
          } else {
            _second = Second;
          }
          const t2 = _second ? ConvertTimeFormat(new Date(new Date(_second.replace('Z', '')).getTime())) : '';
          if (f) fileName = `${_str}(${f}至${t2}).xls`;
        } else {
          fileName = `${_str}(全部).xls`;
        }
      }

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobData, fileName);
      } else {
        const url = window.URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;

        link.setAttribute('download', `${fileName}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        link.onload = () => {
          window.URL.revokeObjectURL(url);
        };
      }
    },
    async setOrderReCheckFile({ state, commit }, dialogData) {
      if (!state.orderDetailData) return false;
      const { OrderID } = state.orderDetailData;
      if (!OrderID) return false;

      const _obj = typeof dialogData === 'object' ? { ...dialogData, OrderID } : { OrderID };

      const res = await api.setOrderReCheckFile(_obj).catch(() => null);

      if (res && res.data.Status === 1000) {
        // 成功
        messageBox.successSingle('已提交至审稿部门', () => commit('afterOrderReCheckFile', OrderID), () => commit('afterOrderReCheckFile', OrderID), true);
        return true;
      }

      return false;
    },
  },
};
