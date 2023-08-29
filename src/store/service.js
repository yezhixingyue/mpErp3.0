/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import api from '@/api/index';
import CommonClassType from '@/store/CommonClassType';
import messageBox from '../assets/js/utils/message';
// import UploadFileByBreakPoint from '../assets/js/upload/UploadFileByBreakPoint';
// import { extname } from '../assets/js/utils/util';

// import { MessageBox } from 'element-ui';

/**
 * vuex 售后服务模块状态管理
 */

export default {
  namespaced: true,
  state: {
    /* 售后单提交等界面中 问题照片列表， 最大为4张
    -------------------------------*/
    serviceImgList: [], // src数据列表
    serviceImgList2Upload: [], // 信息列表
    /* 售后单提交界面 问题照片列表轮播图弹窗显示状态
    -------------------------------*/
    showImgSwiper: false,
    /* 售后单提交界面 补印上传的文件地址及信息
    -------------------------------*/
    fileName: '',
    replenish: {
      KindCount: 0, Amount: 0, src: '', KindCountErr: '', AmountErr: '',
    }, // 补印
    /* 售后单提交页面 -- 存放补印文件
    -------------------------------*/
    replenishFile: null,
    /* 售后单提交页面 -- 补印文件唯一标识
    -------------------------------*/
    replenishFileUniqueName: null,
    /* 售后单提交界面 选择退款时的提交信息
    -------------------------------*/
    refund: { refund: '', err: '' }, // 订单减款
    refundFreight: { refundFreight: '', err: '' }, // 运费减款
    /* 售后单提交界面 记录当前所选择的解决方案类型 值类型：[refund replenish]
    -------------------------------*/
    serviceTypeList: [{ ID: 2, Name: '减款' }, { ID: 7, Name: '补印' }, { ID: 8, Name: '赠送优惠券' }],
    FileCaseList: [{ ID: 0, Name: '无文件' }, { ID: 1, Name: '非必传' }, { ID: 2, Name: '必传' }],
    SolutionType: 'refund', // 减款
    /* 售后单提交界面 损失金额
    -------------------------------*/
    lossesFund: { lossesFund: '', err: '' },
    /* 售后单提交页面 -- 订单包裹列表数据
    -------------------------------*/
    OrderPackageListTableData: null,
    /* 售后单列表数据请求提交对象
    -------------------------------*/
    obj4RequestServiceList: {
      Type: '', // 售后类型
      Product: {
        ClassID: '',
        TypeID: '',
        ProductID: '',
      },
      CreateTime: { // 时间区间
        First: '',
        Second: '',
      },
      KeyWords: '', // 关键字搜索
      Page: 1,
      PageSize: 30,
      CustomerType: {
        First: '',
        Second: '',
      },
      Operator: '',
      DateType: 'today',
      // new
      OperaterID: '',
      SolutionType: '',
      Score: '',
      Result: '',
      OperateTime: {
        First: '',
        Second: '',
      },
      ID: '',
      FieldType: '1',
      Order: {
        First: '',
        Second: '',
      },
    },
    /* 售后单列表数据请求提交对象-最终上传版
    -------------------------------*/
    requestObj: {},
    /* 产品类别相关
    -------------------------------*/
    subProductList: [{ ProductID: '', ProductName: '不限' }],
    largeProTitle: '不限',
    midProTitle: '不限',
    smProTitle: '不限',
    /* 售后提交单 -- 提交问题时对应的包裹信息
    -------------------------------*/
    submitPackageList: [],
    /* 售后提交单 -- 提交问题集合
    -------------------------------*/
    submitQuestionList: [{
      level1ID: '', ID: '', Remark: '', IDErr: '', RemarkErr: '', Department: '', DepartmentErr: '',
    }],
    CouponList: [],
    /* 售后提交单 -- 文件上传进度条百分比
    -------------------------------*/
    percentage: null,
    /* 售后单列表页面 -- 售后问题提交列表
    -------------------------------*/
    QuestionTypeList: [],
    /* 售后单列表页面 -- 售后单校验报错信息
    -------------------------------*/
    serviceErrInfo: '',
    /* 售后单提交 -- 查看详情弹窗控制状态
    -------------------------------*/
    isShowServiceDetail: false,
    /* 售后单查看详情页面 -- 回填问题照片列表
    -------------------------------*/
    backImgList: [],
    /* 售后单列表页面 -- 是否处于加载更多状态 及 是否可加载更多
    -------------------------------*/
    isShowLoadingMore: false,
    canLoadingMore: false,
    /* 售后单列表页面 -- 列表数据总条数 totalCount
    -------------------------------*/
    totalCount: 0,
    /* 售后单列表页面 -- 列表数据 totalCount
    -------------------------------*/
    tableData: [],
    /* 售后单列表页面 -- 售后单详情 -- 数据
    -------------------------------*/
    curServiceOrdrData: null,
    /* 设置售后单列表数据加载状态
    -------------------------------*/
    serviceDataLoading: false,
    /* 售后单页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    searchWatchKey: 0,
    /* 打开售后表 --- 获取订单合包信息 计算订单数量及相关运费
    -------------------------------*/
    PayPackageData: null,
  },
  getters: {
    /* 产品类别相关
    -------------------------------*/
    QuestionTypeLevelList(state) {
      if (!Array.isArray(state.QuestionTypeList) || state.QuestionTypeList.length === 0) return [];
      return CommonClassType.getTwoLevelsClassifyDataFromList(state.QuestionTypeList, true);
    },
  },
  mutations: {
    setCondition(state, [[key1, key2], value]) {
      if (key2) state.obj4RequestServiceList[key1][key2] = value;
      else state.obj4RequestServiceList[key1] = value;
    },
    /* 控制售后单提交界面 问题照片列表轮播图弹窗显示状态
    -------------------------------*/
    setShowImgSwiperTrue(state) {
      state.showImgSwiper = true;
    },
    setShowImgSwiperFail(state) {
      state.showImgSwiper = false;
    },
    /* 控制售后单提交界面 删除问题照片列表中的照片
    -------------------------------*/
    delServiceImgByIndex(state, i) {
      const arr1 = state.serviceImgList;
      const arr2 = state.serviceImgList2Upload;
      // console.log('delServiceImgByIndex', arr1.length === arr2.length);
      if (arr1.length === arr2.length) {
        arr1.splice(i, 1);
        arr2.splice(i, 1);
      } else { // 存在已回填的售后申请图片 （该图片已上传）
        const _difference = arr1.length - arr2.length;
        // console.log('i:', i, '_difference:', _difference, 'i >= _difference:', i >= _difference);
        arr1.splice(i, 1);
        if (i >= _difference) { // 删除的是新添加的 否则为之前回填上传的 不用再从arr2中删除
          const _i = i - _difference;
          arr2.splice(_i, 1);
        }
      }
    },
    /* 向图片列表中添加项
    -------------------------------*/
    setServiceImgList(state, [strBase64, inputFile]) {
      state.serviceImgList.push(strBase64);
      state.serviceImgList2Upload.push(inputFile);
    },
    /* 向图片列表中添加项 --- 回填售后申请图片
    -------------------------------*/
    reWriteUrlList4ServiceImgList(state, urlList) {
      // console.log('reWriteUrlList4ServiceImgList');
      state.serviceImgList = [...urlList, ...state.serviceImgList];
      // console.log(state.serviceImgList, urlList);
    },
    /* 设置打开售后表 --- 获取订单合包信息 计算订单数量及相关运费
    -------------------------------*/
    setPayPackageData(state, data) {
      state.PayPackageData = data;
    },
    setCouponList(state, list) {
      state.CouponList = list;
    },
    /* 关闭售后单页面时，清除页面中的信息
    -------------------------------*/
    clearServiceFormInfo(state) {
      state.serviceImgList = [];
      state.serviceImgList2Upload = [];
      state.fileName = '';
      state.PayPackageData = null;
      state.submitQuestionList = [{
        level1ID: '', ID: '', Remark: '', IDErr: '', RemarkErr: '', Department: '', DepartmentErr: '',
      }];
      state.replenish = {
        KindCount: 0, Amount: 0, src: '', KindCountErr: '', AmountErr: '',
      };
      state.lossesFund = { lossesFund: '', err: '' };
      state.refund = { refund: '', err: '' };
      state.refundFreight = { refundFreight: 0, err: '' };
      state.SolutionType = 'refund';
      state.submitPackageList = [];
      state.serviceErrInfo = '';
      state.replenishFile = null;
      state.CouponList = [];
    },
    /* 设置请求售后列表数据对象
    -------------------------------*/
    setServiceType(state, value) { // 设置售后类型
      state.obj4RequestServiceList.Type = value;
    },
    setCreateTimeFirst(state, value) { // 设置时间区间First
      state.obj4RequestServiceList.CreateTime.First = value;
    },
    setCreateTimeSecond(state, value) { // 设置时间区间Second
      state.obj4RequestServiceList.CreateTime.Second = value;
    },
    /* 售后单列表页面 -- 设置加载更多状态 及 是否可加载更多状态 totalCount
    -------------------------------*/
    setIsShowLoadingMore(state, bool) {
      state.isShowLoadingMore = bool;
    },
    setCanLoadingMore(state, bool) {
      state.canLoadingMore = bool;
    },
    /* 售后单列表页面 -- 设置列表数据总条数 totalCount
    -------------------------------*/
    setTotalCount(state, count) {
      state.totalCount = count;
    },
    /* 设置售后单列表数据加载状态
    -------------------------------*/
    setServiceDataLoading(state, boolean) {
      state.serviceDataLoading = boolean;
    },
    /* 清除筛选条件
    -------------------------------*/
    clearConfigObj(state) {
      state.obj4RequestServiceList = {
        Type: '', // 售后类型
        Product: {
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        CreateTime: { // 时间区间
          First: '',
          Second: '',
        },
        KeyWords: '', // 关键字搜索
        Page: 1,
        PageSize: 30,
        CustomerType: {
          First: '',
          Second: '',
        },
        Operator: '',
        DateType: 'today',
        // new
        OperaterID: '',
        SolutionType: '',
        Score: '',
        Result: '',
        OperateTime: {
          First: '',
          Second: '',
        },
        ID: '',
        FieldType: '',
        Order: {
          First: '',
          Second: '',
        },
      };
    },
    /* 售后提交单 -- 设置提交问题对象 submitQuestionList
    -------------------------------*/
    setSubmitQuestionList(state, [key, value, i]) {
      state.submitQuestionList[i][key] = value;
    },
    addQuestionList(state) {
      state.submitQuestionList.push({
        level1ID: '', ID: '', Remark: '', IDErr: '', RemarkErr: '', Department: '', DepartmentErr: '',
      });
    },
    delQuestionList(state, i) {
      if (state.submitQuestionList.length <= 1) return;
      const arr = [...state.submitQuestionList];
      arr.splice(i, 1);
      state.submitQuestionList = [...arr];
    },
    /* 售后提交单 -- 设置提交问题表格选中信息 submitPackageList
    -------------------------------*/
    setSubmitPackageList(state, list) {
      state.submitPackageList = list;
    },
    /* 售后单提交界面 设置补印上传的文件地址及信息 replenishFileUniqueName
    -------------------------------*/
    setFileName(state, value) {
      state.fileName = value;
    },
    /* 售后单提交页面 -- 设置补印文件
    -------------------------------*/
    setReplenishFile(state, file) {
      state.replenishFile = file;
    },
    /* 售后单提交界面 设置补印上传的文件地址及信息 replenishFileUniqueName
    -------------------------------*/
    setReplenishFileUniqueName(state, value) {
      state.replenishFileUniqueName = value;
    },
    /* 售后单提交界面 设置补印上传的文件地址及信息
    -------------------------------*/
    setReplenish(state, [key, value]) {
      state.replenish[key] = value;
    },
    /* 售后单提交界面 选择退款时的提交信息
    -------------------------------*/
    setRefund(state, value) {
      state.refund.refund = value;
    },
    setRefundFreight(state, val) {
      state.refundFreight.refundFreight = val;
    },
    /* 售后单提交界面 设置当前所选择的解决方案类型
    -------------------------------*/
    setSolutionType(state, value) {
      state.SolutionType = value;
    },
    /* 售后单提交界面 设置损失金额
    -------------------------------*/
    setLossesFund(state, value) {
      state.lossesFund.lossesFund = value;
    },
    /* 售后提交单 -- 文件上传进度条百分比
    -------------------------------*/
    setPercentage(state, value) {
      if (`${value}` !== 'NaN') state.percentage = value;
    },
    /* 售后单提交 -- 设置获取到的售后问题提交列表
    -------------------------------*/
    setQuestionTypeList(state, list) {
      state.QuestionTypeList = list;
    },
    /* 售后单提交 -- 设置获取到的订单包裹列表数据
    -------------------------------*/
    setOrderPackageListTableData(state, data) {
      state.OrderPackageListTableData = data;
    },
    /* 售后单提交 -- 设置售后单校验报错信息
    -------------------------------*/
    setServiceErrInfo(state, text) {
      state.serviceErrInfo = text;
    },
    /* 售后单提交 -- 清除售后单校验报错信息
    -------------------------------*/
    clearAllServiceErrInfo(state) {
      state.serviceErrInfo = '';
      for (let i = 0; i < state.submitQuestionList.length; i += 1) {
        state.submitQuestionList[i].IDErr = '';
        state.submitQuestionList[i].RemarkErr = '';
        state.submitQuestionList[i].DepartmentErr = '';
      }
      state.lossesFund.err = '';
      state.refund.err = '';
      state.refundFreight.err = '';
      state.replenish.KindCountErr = '';
      state.replenish.AmountErr = '';
    },
    /* 售后单提交 -- 设置售后单每个选项的校验报错信息
    -------------------------------*/
    setOptionsErrInfo(state, [type, i]) {
      switch (type) {
        case 'IDErr':
          state.submitQuestionList[i].IDErr = true;
          break;
        case 'RemarkErr':
          state.submitQuestionList[i].RemarkErr = true;
          break;
        case 'DepartmentErr':
          state.submitQuestionList[i].DepartmentErr = true;
          break;
        case 'lossesFund':
          state.lossesFund.err = true;
          break;
        case 'refund':
          state.refund.err = true;
          break;
        case 'refundFreight':
          state.refundFreight.err = true;
          break;
        case 'KindCountErr':
          state.replenish.KindCountErr = true;
          break;
        case 'AmountErr':
          state.replenish.AmountErr = true;
          break;
        default:
          break;
      }
    },
    /* 售后单提交 -- 处理报错问题
    -------------------------------*/
    handleSubmitError(state) {
      messageBox.failSingleError('补充信息', state.serviceErrInfo);
    },
    /* 售后单列表页面 -- 设置详情弹窗开启状态
    -------------------------------*/
    setIsShowServiceDetailClose(state) {
      state.isShowServiceDetail = false;
    },
    setIsShowServiceDetailOpen(state) {
      state.isShowServiceDetail = true;
    },
    /* 售后单列表页面 -- 设置获取列表数据页面
    -------------------------------*/
    setLoadPage(state, num) {
      state.obj4RequestServiceList.Page = num;
    },
    /* 售后单列表页面 -- 设置列表数据
    -------------------------------*/
    setTableData(state, dataList) {
      state.tableData = dataList;
    },
    addTableData(state, dataList) {
      state.tableData = [...state.tableData, ...dataList];
    },
    /* 售后单列表页面 -- 售后单详情 -- 设置详情数据
    -------------------------------*/
    setCurServiceOrdrData(state, data) {
      state.curServiceOrdrData = data;
    },
    /* 售后单查看详情页面 -- 设置回填问题照片列表
    -------------------------------*/
    setBackImgList(state, list) {
      state.backImgList = list;
    },
    /* 设置售后单列表数据请求提交对象-最终上传版 requestObj
    -------------------------------*/
    setRequestObj(state, { PicList, curOrderID, AppyCode }) {
      const _obj = {}; // 该对象用于最终上传的请求对象信息
      _obj.PicList = PicList;
      _obj.Solution = {};
      if (AppyCode) {
        _obj.AppyCode = AppyCode;
      }
      if (state.SolutionType === 'replenish') { // 补印
        const { KindCount, Amount } = state.replenish;
        _obj.Solution.Type = 7; // 减款为2  补印为7
        _obj.Solution.UniqueName = state.replenishFileUniqueName ? state.replenishFileUniqueName : '';
        _obj.Solution.KindCount = +KindCount || '';
        _obj.Solution.Number = +Amount || '';
      }
      if (state.SolutionType === 'refund') { // 减款
        _obj.Solution.Type = 2; // 减款为2  补印为7
        _obj.Solution.Refund = +state.refund.refund || '';
        _obj.Solution.RefundFreight = +state.refundFreight.refundFreight || '';
      }
      if (state.SolutionType === 'giveCoupons') { // 赠送优惠券
        _obj.Solution.Type = 8; // 减款为2  补印为7
        _obj.Solution.CouponList = state.CouponList;
      }
      let arr = [...state.submitQuestionList];
      arr = arr.filter((it) => it.ID && it.Remark).map((item) => {
        // if (item.Department) {
        //   return { ID: item.ID, Remark: item.Remark, Department: item.Department };
        // }
        const _DepartmentObj = {
          ID: item.Department,
        };
        return { ID: item.ID, Remark: item.Remark, Department: _DepartmentObj };
      });
      _obj.QuestionList = arr;
      _obj.LossAmount = state.lossesFund.lossesFund;
      const arr1 = [...state.submitPackageList];
      const PackageList = arr1.map((it) => ({ ID: it.ID }));
      _obj.PackageList = PackageList;
      _obj.Order = {};
      _obj.Order.OrderID = curOrderID;
      state.requestObj = _obj;
    },
    /* 售后单页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    setSearchWatchKey(state) {
      state.searchWatchKey += 1;
    },
    setDateFormat(state) {
      CommonClassType.setDate(state.obj4RequestServiceList, 'OperateTime');
    },
  },
  actions: {
    /* 获取售后单数据列表
    -------------------------------*/
    async getServiceListData({ state, commit }, prop = { page: 1, type: 'get' }) {
      let method;
      if (prop.type === 'get') { // 根据type来判断是第一次加载数据还是加载更多数据
        method = 'setTableData';
        commit('setLoadPage', prop.page);
        commit('setTableData', []);
      } else if (prop.type === 'add') {
        method = 'addTableData';
        commit('setLoadPage', state.obj4RequestServiceList.Page + 1);
        commit('setIsShowLoadingMore', true);
      }
      commit('setCanLoadingMore', false);
      commit('setServiceDataLoading', true);
      commit('setSearchWatchKey');
      commit('setDateFormat');
      const temp = CommonClassType.filter(state.obj4RequestServiceList);
      const res = await api.getOrderAfterSaleManageList(temp);
      commit('setServiceDataLoading', false);
      if (!res.data.Data && res.data.Status !== 1000) return;
      const tableData = res.data.Data;
      commit('setTotalCount', res.data.DataNumber);
      commit(method, tableData);
      commit('setIsShowLoadingMore', false);
      if (state.tableData.length < state.totalCount) commit('setCanLoadingMore', true);
    },
    /* 售后单提交
    -------------------------------*/
    // 已弃用
    // async submitServiceForm({ state, commit }, [curOrderID, AppyCode, callback]) {
    //   const data = state.replenishFile;
    //   const uniqueName = state.replenishFileUniqueName;
    //   const onUploadProgressFunc = (complete) => commit('setPercentage', complete);
    //   if (data && uniqueName && state.SolutionType === 'replenish') { // 上传补印文件
    //     const key = await UploadFileByBreakPoint(data, uniqueName, onUploadProgressFunc);
    //     if (!key) {
    //       commit('setPercentage', null);
    //       return;
    //     }
    //   }
    //   let PicList = await Promise.all(state.serviceImgList2Upload.map((imgData) => api.uploadImage(imgData, 3).then((res) => { // 上传照片列表
    //     if (res.data.Status === 1000) return res.data.Data.Url;
    //     return false;
    //   }))).catch(() => {
    //     commit('setPercentage', null);
    //     return false;
    //   });
    //   if (PicList.includes(false)) return;
    //   if (state.serviceImgList2Upload.length < state.serviceImgList.length) {
    //     const _d = state.serviceImgList.length - state.serviceImgList2Upload.length;
    //     const host = 'http://192.168.1.92:8055/';
    //     const arr = state.serviceImgList.slice(0, _d).map(it => (it.includes(host) ? it.replace(host, '') : it));
    //     PicList = [...arr, ...PicList];
    //   }
    //   commit('setPercentage', 99);
    //   commit('setRequestObj', { PicList, curOrderID, AppyCode }); // 收集信息，用于设置请求头信息
    //   const result = await api.saveServiceOrder(state.requestObj).catch(() => commit('setPercentage', null)); // 提交
    //   if (!result) return;
    //   if (result.data.Status === 1000) {
    //     commit('setPercentage', 100);
    //     messageBox.successSingle('提交成功', () => {
    //       if (callback) callback();
    //       return commit('orderModule/setIsShowServiceDiaFail', {}, { root: true });
    //     });
    //   }
    //   commit('setPercentage', null);
    // },
    /* 获取售后问题列表
    -------------------------------*/
    async getQuestionTypeList({ state, commit }) {
      if (state.QuestionTypeList.length > 0) return;
      const res = await api.getQuestionList();
      if (res.data.Status === 1000) {
        commit('setQuestionTypeList', res.data.Data);
      }
    },
    /* 根据订单号获取该单包含的包裹列表 -- 售后单中使用 getPackageListByOrderID
    -------------------------------*/
    async getPackageListByOrderID({ commit }, orderId) {
      const res = await api.getPackagesByOrderID(orderId);
      if (res.data.Status === 1000) commit('setOrderPackageListTableData', res.data.Data);
    },

    // async getServiceDetail({ commit }, aferSalesID) {
    //   commit('setCurServiceOrdrData', null);
    //   commit('setBackImgList', []);
    //   const res = await api.getServiceDetail(aferSalesID);
    //   if (res.data.Status === 1000) {
    //     commit('setCurServiceOrdrData', res.data.Data);
    //     const list = res.data.Data.PicList;
    //     commit('setBackImgList', list);
    //   } else {
    //     throw new Error(res.data.Message);
    //   }
    // },
    async getPayPackageByOrder({ commit }, orderId) {
      const res = await api.getPayPackageByOrder(orderId);
      if (res && res.data.Status === 1000) {
        // 获取成功
        commit('setPayPackageData', res.data.Data);
      }
    },
  },
};
