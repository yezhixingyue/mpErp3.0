/**
 * 状态管理 -- 优惠券模块
 */
import api from '@/api/index';
import messageBox from '@/assets/js/utils/message';
// import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import ListRequestObjType from './listRequestObjType';
import Condition2CouponSaveClassType from './condition2CouponSaveClassType';

export default {
  namespaced: true,
  state: {
    /* 列表数据请求对象
    ---------------------------------------- */
    condition2ListData: new ListRequestObjType(),
    /* 添加与保存提交对象
    ---------------------------------------- */
    condition2CouponSave: new Condition2CouponSaveClassType(),
    /** 优惠券使用状态请求对象信息
    ---------------------------------------- */
    condition2CouponUseList: {
      Page: 1,
      KeyWords: '',
      PageSize: 30,
      Status: '',
      Channel: '',
      FieldType: 1,
      ID: '',
    },
    /* input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    searchWatchKey: 0,
    /* input监听对象， 优惠券使用列表 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    searchWatchKey2CouponUseList: 0,
    /* 优惠券列表数据
    ---------------------------------------- */
    couponListData: [],
    /* 优惠券列表数据条数
    ---------------------------------------- */
    count: 0,
    /* 优惠券使用列表数据
    ---------------------------------------- */
    couponUseListData: [],
    /* 优惠券使用列表数据条数
    ---------------------------------------- */
    couponUseListCount: 0,
    /** 接单员列表，只在回填时候使用
    ---------------------------------------- */
    addPageCurStaff: null,
    /** 表格数据是否处于加载状态
    ---------------------------------------- */
    tableDataLoading: false,
    /** 优惠劵使用列表页面中传递的信息数据
    ---------------------------------------- */
    objectInfo2CouponUseListPage: null,
    productInfo2CouponUseListPage: null,
    /** 优惠劵使用列表页面  ---  弹窗相关 -- 绑定用户
    ---------------------------------------- */
    dialogVisible2UsePage: false,
    dialogData2UsePage: null,
    /** 优惠劵使用列表页面  ---  弹窗相关 -- 订单详情
    ---------------------------------------- */
    dialogVisible2UsePageOrderDetail: false,
    dialogData2UsePageOrderDetail: null,
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
    ---------------------------------------- */
    setCondition2ListData(state, [[key1, key2], value]) {
      if (!key2) state.condition2ListData[key1] = value;
      else state.condition2ListData[key1][key2] = value;
    },
    /** 设置请求列表数据的对象信息
    ---------------------------------------- */
    setCondition2CouponSave(state, [[key1, key2], value]) {
      if (!key2) state.condition2CouponSave[key1] = value;
      else state.condition2CouponSave[key1][key2] = value;
    },
    /** 设置优惠券使用状态请求对象信息
    ---------------------------------------- */
    setCondition2CouponUseList(state, [[key1, key2], value]) {
      if (!key2) state.condition2CouponUseList[key1] = value;
      else state.condition2CouponUseList[key1][key2] = value;
    },
    /** 重置清除请求对象信息
     ---------------------------------------- */
    clearCondition2ListData(state) {
      // console.log(state.condition2ListData);
      ListRequestObjType.clear(state.condition2ListData);
    },
    /** 重置清除优惠券使用列表请求对象信息
     ---------------------------------------- */
    clearCondition2CouponUseList(state) {
      const _id = state.condition2CouponUseList.ID;
      state.condition2CouponUseList = {
        Page: 1,
        KeyWords: '',
        PageSize: 30,
        Status: '',
        Channel: '',
        FieldType: 1,
        ID: _id,
      };
    },
    /* 页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    setSearchWatchKey(state) {
      state.searchWatchKey += 1;
    },
    /* 页面input监听对象， 优惠券使用列表 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    setSearchWatchKey2CouponUseList(state) {
      state.searchWatchKey2CouponUseList += 1;
    },
    /** 设置接单员列表，只在回填时候使用
    ---------------------------------------- */
    setAddPageCurStaff(state, list) {
      state.addPageCurStaff = list;
    },
    /* 设置优惠券列表数据
    ---------------------------------------- */
    setCouponListData(state, [data, num]) {
      state.couponListData = data;
      if (!num && num !== 0) return;
      state.count = num;
    },
    /* 修改优惠券列表数据
    ---------------------------------------- */
    changeCouponListData(state, [index, [key1, key2], value]) {
      if (!key2) {
        state.couponListData[index][key1] = value;
      } else {
        state.couponListData[index][key1][key2] = value;
      }
    },
    /* 删除优惠券列表数据
    ---------------------------------------- */
    removeCouponListData(state, index) {
      state.couponListData.splice(index, 1);
    },
    /* 设置优惠券使用列表数据
    ---------------------------------------- */
    setCouponUseListData(state, [data, num]) {
      state.couponUseListData = data;
      if (!num && num !== 0) return;
      state.couponUseListCount = num;
    },
    /* 控制表格文件是否在加载中
    ---------------------------------------- */
    setTableDataLoading(state, bool) {
      state.tableDataLoading = bool;
    },
    /** 回填编辑信息
    ---------------------------------------- */
    backfillCondition2CouponSave(state, data) {
      state.condition2CouponSave = Condition2CouponSaveClassType.backfill(data);
    },
    /** 清除编辑信息
    ---------------------------------------- */
    clearCondition2CouponSave(state) {
      state.condition2CouponSave = new Condition2CouponSaveClassType();
      state.addPageCurStaff = null;
    },
    /** 设置优惠劵使用列表页面中传递的信息数据
    ---------------------------------------- */
    setInfo2CouponUseListPage(state, [obj, productInfo]) {
      state.objectInfo2CouponUseListPage = obj;
      state.productInfo2CouponUseListPage = productInfo;
    },
    /** 优惠劵使用列表页面  ---  弹窗相关 -- 绑定用户
    ---------------------------------------- */
    setDialogVisible2UsePage(state, bool) {
      state.dialogVisible2UsePage = bool;
    },
    setDialogData2UsePage(state, data) {
      state.dialogData2UsePage = data;
    },
    /** 优惠劵使用列表页面  ---  弹窗相关 -- 订单详情
    ---------------------------------------- */
    setDialogVisible2UsePageOrderDetail(state, bool) {
      state.dialogVisible2UsePageOrderDetail = bool;
    },
    setDialogData2UsePageOrderDetail(state, data) {
      state.dialogData2UsePageOrderDetail = data;
    },
  },
  actions: {
    async getCouponList({ state, commit }, page = 1) {
      commit('setCondition2ListData', [['Page', ''], page]);
      commit('setCouponListData', [[], '']);
      const _obj = ListRequestObjType.filter(state.condition2ListData);
      commit('setTableDataLoading', true);
      commit('setSearchWatchKey'); // 数据请求前执行一次
      const res = await api.getCouponList(_obj);
      commit('setTableDataLoading', false);
      if (res.data.Status === 1000) {
        commit('setCouponListData', [res.data.Data, res.data.DataNumber]);
      }
    },
    async submitOrEditCoupon({ state }) {
      if (!Condition2CouponSaveClassType.check(state.condition2CouponSave)) return;
      const _obj = Condition2CouponSaveClassType.filter(state.condition2CouponSave);
      const res = await api.submitAndEditCoupon(_obj);
      // eslint-disable-next-line consistent-return
      if (res.data.Status === 1000) return true;
      // eslint-disable-next-line consistent-return
      return false;
    },
    // eslint-disable-next-line max-len
    async getAccountReceivableExcel(storeData, [rowData, amount, minPayAmount, ValidEndTime, cb]) { // txt优惠券文件下载
      const res = await api.downloadGeneratedCoupons2Excel(rowData.RecordID);
      if (res.status !== 200) {
        messageBox.failSingleError('出错啦 ！', `[ 导出失败：${res.statusText} ]`);
        return;
      }

      const { data } = res;
      const blobData = new Blob([data]);

      // const First = rowData.CreateTime;
      const f = `${ValidEndTime.split('T')[0]} ${ValidEndTime.split('T')[1].slice(0, 5)}`;
      let fileName = '优惠券.txt';
      if (f) fileName = `优惠券(使用截止：${f}，领取人：${rowData.ReceiveUser.StaffName}，面值：${amount}元， 数量：${rowData.Number}张，满${minPayAmount}可用).txt`;

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobData, fileName);
      } else {
        const url = window.URL.createObjectURL(blobData, { type: 'text/plain' });
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
      setTimeout(() => {
        // 2s后控制页面显示为已导出
        cb();
      }, 1000);
    },
    async removeCoupon({ commit }, [CouponID, index]) {
      const res = await api.removeCoupon(CouponID);
      if (res.data.Status === 1000) {
        messageBox.successSingle('优惠券删除成功!', () => { commit('removeCouponListData', index); }, () => { commit('removeCouponListData', index); });
      }
    },
    async getCouponUseList({ state, commit }, page = 1) { // 获取优惠券使用列表
      commit('setCondition2CouponUseList', [['Page', ''], page]);
      const _obj = state.condition2CouponUseList;
      if (!_obj.ID) return false;
      const keys = Object.keys(_obj);
      const _tempObj = {};
      keys.forEach(key => { // 清除未勾选设置的参数值
        if (_obj[key] || `${_obj[key]}` === '0') {
          _tempObj[key] = _obj[key];
        }
      });

      commit('setCouponUseListData', [[], '']);
      commit('setTableDataLoading', true);
      commit('setSearchWatchKey2CouponUseList');
      let key = true;
      const res = await api.getCouponUseList(_tempObj).catch(() => { key = false; });
      commit('setTableDataLoading', false);
      if (key && res && res.status === 200 && res.data.Status === 1000) {
        commit('setCouponUseListData', [res.data.Data, res.data.DataNumber]);
        return true;
      }
      return false;
    },
    async getCustomerData({ commit }, _id) {
      const res = await api.getCustomerList({
        ID: _id,
        FieldType: 3,
      });
      if (res.data.Status !== 1000 || res.data.Data.length === 0) return;
      commit('setDialogData2UsePage', res.data.Data[0]);
    },
    async getOrderDetail({ commit }, _id) {
      const res = await api.getOrderDetail(_id);
      if (res.data.Status !== 1000 || res.data.Data.length === 0) return;
      commit('setDialogData2UsePageOrderDetail', res.data.Data);
    },
  },
};
