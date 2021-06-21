import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import api from '@/api/index';
import { Message } from 'element-ui';
import messageBox from '../assets/js/utils/message';

function filter(obj) {
  const tempObj = obj;
  Object.keys(tempObj).forEach((key) => {
    if (tempObj[key] === '' || tempObj[key] === 0) delete tempObj[key];
  });
}

export default {
  namespaced: true,
  state: {
    searchCondition4Finance: {
      SellArea: {
        RegionalID: -777,
        CityID: -777,
        CountyID: -777,
      },
      ProductClass: {
        First: -777,
        Second: -777,
      },
      ProductID: -777,
      ExpressType: '',
      OutstoreDate: { // 时间区间
        First: '',
        Second: '',
      },
      OrderType: '',
      KeyWords: '', // 关键字搜索
      HaveWriteOff: '', // 销账状态
      Page: 1,
      PageSize: 30,
      Status: '',
      WriteOffOperator: '',
      HaveUnPaid: '',
    },
    /* 产品类别相关
    -------------------------------*/
    productList: [],
    subProductList: [{ ProductID: 0, ProductName: '不限' }],
    largeProTitle: '不限',
    midProTitle: '不限',
    smProTitle: '不限',
    /* 配送方式相关
    -------------------------------*/
    expressTitle: '不限',
    /* 销售区域相关
    -------------------------------*/
    largeTitle: '不限',
    midTitle: '不限',
    smTitle: '不限',
    /* 时间选择相关
    -------------------------------*/
    selectedTimeArr: [0, 1, 0, 0, 0, 0],
    /* 财务列表数据加载状态
    -------------------------------*/
    financeDataLoading: false,
    /* 财务列表页面相关数据
    -------------------------------*/
    UnPaidAmount: 0, // 余额
    PackageList: [], // 列表数据
    PaidAmount: 0, // 已付金额
    TotalAmount: 0, // 总金额
    /* 财务列表数据总条数
    -------------------------------*/
    count: 0,
    /* 选中的需要销账的订单列表
    -------------------------------*/
    will2WriteCheckedList: [],
    /* 财务管理列表页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    searchWatchKey: 0,
  },
  getters: {
    /* 产品类别相关
    -------------------------------*/
    largeProduct(state) {
      const arr = [{ ID: 0, ClassName: '不限' }];
      if (state.productList.length > 0) {
        const tempArr = state.productList.filter((item) => item.Level === 1);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midProduct(state) {
      const arr = [{ ID: 0, ClassName: '不限' }];
      const id = state.searchCondition4Finance.ProductClass.First;
      if (id) {
        const tempArr = state.productList.filter((item) => item.ParentID === id);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    /* 筛选后的列表数据请求对象
    -------------------------------*/
    requestObj(state) {
      const tempObj = { ...state.searchCondition4Finance };
      tempObj.Product = {
        ClassID: -777,
        TypeID: -777,
        ProductID: -777,
      };
      tempObj.Product.ClassID = state.searchCondition4Finance.ProductClass.First;
      tempObj.Product.TypeID = state.searchCondition4Finance.ProductClass.Second;
      tempObj.Product.ProductID = state.searchCondition4Finance.ProductID;
      tempObj.Express = state.searchCondition4Finance.ExpressType;

      delete tempObj.ProductClass;
      delete tempObj.ProductID;
      delete tempObj.ExpressType;

      filter(tempObj);

      return tempObj;
    },
  },
  mutations: {
    // /* 销售区域相关
    // -------------------------------*/
    setSellAreaRegional(state, [ID, name]) {
      state.searchCondition4Finance.SellArea.RegionalID = ID;
      state.searchCondition4Finance.SellArea.CityID = 0;
      state.searchCondition4Finance.SellArea.CountyID = 0;
      state.largeTitle = name;
      state.midTitle = '不限';
      state.smTitle = '不限';
    },
    setSellAreaCity(state, [ID, name]) {
      state.searchCondition4Finance.SellArea.CityID = ID;
      state.searchCondition4Finance.SellArea.CountyID = 0;
      state.midTitle = name;
      state.smTitle = '不限';
    },
    setSellAreaCounty(state, [ID, name]) {
      state.searchCondition4Finance.SellArea.CountyID = ID;
      state.smTitle = name;
    },
    /* 产品类别相关
    -------------------------------*/
    setProductList(state, arr) {
      state.productList = arr;
    },
    setSubProductList(state, arr) {
      state.subProductList = arr;
    },
    setProductClass1(state, [ID, name]) {
      state.searchCondition4Finance.ProductClass.First = ID;
      state.searchCondition4Finance.ProductClass.Second = -777;
      state.searchCondition4Finance.ProductID = -777;
      state.subProductList = [{ ProductID: -777, ProductName: '不限' }];
      state.largeProTitle = name;
      state.midProTitle = '不限';
      state.smProTitle = '不限';
    },
    setProductClass2(state, [ID, name]) {
      state.searchCondition4Finance.ProductClass.Second = ID;
      state.searchCondition4Finance.ProductID = -777;
      state.subProductList = [{ ProductID: -777, ProductName: '不限' }];
      state.midProTitle = name;
      state.smProTitle = '不限';
    },
    setProductClass3(state, [ID, name]) {
      state.searchCondition4Finance.ProductID = ID;
      state.smProTitle = name;
    },
    setExpressType(state, [ID, name]) {
      state.expressTitle = name;
      state.searchCondition4Finance.ExpressType = ID;
    },
    /* 设置财务列表数据加载状态
    -------------------------------*/
    setFinanceDataLoading(state, boolean) {
      state.financeDataLoading = boolean;
    },
    /* 时间选择相关
    -------------------------------*/
    setSelectTime(state, [type, num, obj]) {
      if (type !== 'timeSelect') {
        const timeObj = this.getters[`timeSelectModule/${type}`];
        state.searchCondition4Finance.OutstoreDate = timeObj;
      } else {
        state.searchCondition4Finance.OutstoreDate = obj;
      }
      state.selectedTimeArr = [0, 0, 0, 0, 0, 0];
      state.selectedTimeArr[num] = 1;
    },
    /* 关键字搜索相关
    -------------------------------*/
    setPlaceWord(state, type) {
      state.searchCondition4Finance.KeyWords = type;
    },
    /** 设置请求列表数据的对象信息 --- 主要为订单状态
    ---------------------------------------- */
    setFinanceRequestObj(state, [[key1, key2], value]) {
      if (!key2) state.searchCondition4Finance[key1] = value;
      else state.searchCondition4Finance[key1][key2] = value;
    },
    /* 清除筛选项相关
    -------------------------------*/
    clearConfigObj(state, type = 'clear') {
      const _keywordsText = state.searchCondition4Finance.KeyWords;
      state.searchCondition4Finance = {
        SellArea: {
          RegionalID: -777,
          CityID: -777,
          CountyID: -777,
        },
        ProductClass: {
          First: -777,
          Second: -777,
        },
        ProductID: -777,
        OutstoreDate: { // 时间区间
          First: '',
          Second: '',
        },
        HaveWriteOff: '',
        KeyWords: '', // 关键字搜索=
        OrderType: '',
        Page: 1,
        PageSize: 30,
        ExpressType: '',
        Status: '',
        WriteOffOperator: '',
        HaveUnPaid: '',
      };
      if (type === 'onKeyWordSubmit') state.searchCondition4Finance.KeyWords = _keywordsText;
      state.largeTitle = '不限';
      state.midTitle = '不限';
      state.smTitle = '不限';
      state.largeProTitle = '不限';
      state.midProTitle = '不限';
      state.smProTitle = '不限';
      state.expressTitle = '不限';
      state.selectedTimeArr = [0, 1, 0, 0, 0, 0];
      state.searchCondition4Finance.HaveWriteOff = '';
    },

    setHaveWriteOff(state, key) {
      if (key === true || key === false) {
      //  console.log(key);
        state.searchCondition4Finance.HaveWriteOff = key;
      } else if (!key) {
        state.searchCondition4Finance.HaveWriteOff = '';
      }
    },
    /* 设置财务列表页面相关数据
    -------------------------------*/
    setFinanceData(state, {
      UnPaidAmount, PackageList, PaidAmount, TotalAmount,
    }) {
      state.UnPaidAmount = UnPaidAmount; // 余额
      state.PackageList = PackageList; // 列表数据
      state.PaidAmount = PaidAmount; // 已付金额
      state.TotalAmount = TotalAmount; // 总金额
    },
    /* 筛选掉财务列表中当前数据中的已销账状态订单
    -------------------------------*/
    filterPackageList(state) {
      const _list = state.PackageList.filter(item => !item.HaveWriteOff);
      const clearLen = state.PackageList.length - _list.length;
      if (clearLen === 0) return;

      state.PackageList = _list;
      state.count -= clearLen;
      Message.success('清除成功!');
    },
    /* 设置财务列表数据总条数
    -------------------------------*/
    setCount(state, num) {
      state.count = num;
    },
    setLoadPage(state, page) {
      state.searchCondition4Finance.Page = page;
    },
    /* 设置选中的需要销账的订单列表
    -------------------------------*/
    setWill2WriteCheckedList(state, list) {
      state.will2WriteCheckedList = list;
    },
    /* 修改选中的需要销账的订单列表的销账状态
    -------------------------------*/
    changeWill2WriteCheckedListStatus(state, [idlist, StaffName, isSingle]) {
      idlist.forEach(item => {
        state.PackageList = state.PackageList.map(order => {
          if (order.PackageID === item) {
            if (!order.WriteOffOperator) return { ...order, HaveWriteOff: true, Status: '已完成', WriteOffOperator: StaffName };
            return { ...order, HaveWriteOff: true, Status: '已完成' };
          }
          return { ...order };
        });
      });
      if (!isSingle) state.will2WriteCheckedList = [];
    },
    /* 修改全部订单列表的销账后状态
    -------------------------------*/
    changeAllListStatus(state, StaffName) {
      state.PackageList = state.PackageList.map(order => ({ ...order, HaveWriteOff: true, Status: '已完成', WriteOffOperator: StaffName }));
    },
    /* 财务管理列表页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    setSearchWatchKey(state) {
      state.searchWatchKey += 1;
    },
  },
  actions: {
    getProductList({ commit }) {
      // 获取产品列表数据
      api.getVersionValid({
        Key: 6,
        Value: -1,
      }).then((res) => {
        const tempObj = res;
        commit('setProductList', tempObj.data.Data);
      });
    },
    getProductThird({ state, commit }) {
      // 获取产品列表数据
      const obj = {};
      obj.ProductClass = state.searchCondition4Finance.ProductClass;
      obj.FieldType = 1;
      api.getProductLists(obj).then((res) => {
        const arr = [{ ProductID: 0, ProductName: '不限' }, ...res.data.Data];
        commit('setSubProductList', arr);
      });
    },
    async getFinanceTableData({ getters, commit }, page = 1) { // getFinanceListData 获取列表数据
      commit('setLoadPage', page);
      commit('setFinanceData', {
        UnPaidAmount: 0,
        PackageList: null,
        PaidAmount: 0,
        TotalAmount: 0,
      });
      commit('setFinanceDataLoading', true);

      const tempObj = getters.requestObj;
      commit('setSearchWatchKey');

      const res = await api.getAccountReceivableList(tempObj);
      commit('setFinanceDataLoading', false);
      if (res.data.Status === 1000) {
        commit('setFinanceData', res.data.Data);
        commit('setCount', res.data.DataNumber);
      }
    },
    async getAccountReceivableExcel({ getters }) { // excel文件下载
      const tempObj = getters.requestObj;

      delete tempObj.Page;
      delete tempObj.PageSize;

      filter(tempObj);
      const res = await api.getAccountReceivableExcel(tempObj);
      if (res.status !== 200) {
        messageBox.failSingleError('出错啦 ！', `[ 下载失败：${res.statusText} ]`);
        return;
      }

      const { data } = res;
      const blobData = new Blob([data], { type: 'application/vnd.ms-excel' });

      let fileName = '财务应收列表.xls';
      if (!tempObj.OutstoreDate) {
        fileName = '财务应收列表(全部).xls';
      } else {
        const { First, Second } = tempObj.OutstoreDate;
        if (First && Second) {
          const f = First.split('T')[0];
          let _second = '';
          if (new Date(Second) > new Date()) {
            const PlaceDate = this.getters['timeSelectModule/TodayDate'];
            _second = PlaceDate.Second;
          } else {
            _second = Second;
          }
          const t2 = _second ? ConvertTimeFormat(new Date(new Date(_second).getTime() - 24 * 60 * 60 * 1000)) : '';
          if (f) fileName = `财务应收列表(${f}至${t2}).xls`;
        } else {
          fileName = '财务应收列表(全部).xls';
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
    async setWriteOffAll({ getters, commit, dispatch, rootState }, bool = false) { // 取消全部订单
      const tempObj = { ...getters.requestObj, IsCoerceWriteOff: bool };

      delete tempObj.Page;
      delete tempObj.PageSize;

      const res = await api.setWriteOffAll(tempObj);
      if (res && res.data.Status === 1000) {
        let StaffName = '';
        if (rootState.common.Permission) StaffName = rootState.common.Permission.StaffName;
        messageBox.successSingle('销账成功', () => commit('changeAllListStatus', StaffName), () => commit('changeAllListStatus', StaffName));
      } else if (res && res.data.Status === 8044) {
        // console.log(res);
        messageBox.warnCancelBox('有包裹未签收, 是否继续销账 ?', res.data.Message, () => dispatch('setWriteOffAll', true), null);
      }
    },
    async setWriteOffChecked({ state, commit, rootState }, id) { // 取消选中订单
      // if (id) {
      //   return;
      // }
      if (state.will2WriteCheckedList.length === 0 && !id) return;
      const idlist = id ? [id] : state.will2WriteCheckedList.map(item => item.PackageID);
      const res = await api.setWriteOffChecked(idlist);
      if (res.data.Status !== 1000) return;
      if (res && res.data.Status === 1000) {
        let StaffName = '';
        if (rootState.common.Permission) StaffName = rootState.common.Permission.StaffName;
        messageBox.successSingle('销账成功',
          () => commit('changeWill2WriteCheckedListStatus', [idlist, StaffName, !!id]),
          () => commit('changeWill2WriteCheckedListStatus', [idlist, StaffName, !!id]));
      }
    },
  },
};