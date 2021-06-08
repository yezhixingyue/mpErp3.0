/*
 * @Describe: 促销活动 状态管理
 * @FilePath: /src/store/Promote/promoteStore.js
 */
import api from '@/api/index';
import { Message } from 'element-ui';
import messageBox from '@/assets/js/utils/message';
import PromoteListRequestObj from './classType';
import PromoteAddEditObjClassType from './PromoteAddEditObjClassType';

export default {
  namespaced: true,
  state: {
    /** 请求列表数据的对象
     ---------------------------------------- */
    promoteListRequestObj: new PromoteListRequestObj(),
    /** 活动列表数据
     ---------------------------------------- */
    PromoteListData: [],
    /** 活动列表条数
     ---------------------------------------- */
    count: 0,
    /** 活动添加请求数据
     ---------------------------------------- */
    promoteAddRequestObj: new PromoteAddEditObjClassType(),
    /** 控制产品弹窗显示
     ---------------------------------------- */
    watchValue2ProductDia: 1,
    /** 控制产品弹窗打开操作类型 index索引位
     ---------------------------------------- */
    openTypeIndex2ProductDia: '',
    /** 表格文件是否在加载中
     ---------------------------------------- */
    promoteTableDataLoading: false,
    /** 接单员列表，只在回填时候使用
     ---------------------------------------- */
    promoteStaffList: null,
    /* input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    searchWatchKey: 0,
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
     ---------------------------------------- */
    setPromoteListRequestObj(state, [[key1, key2], value]) {
      if (!key2) state.promoteListRequestObj[key1] = value;
      else state.promoteListRequestObj[key1][key2] = value;
    },
    /** 重置清除请求对象信息
     ---------------------------------------- */
    clearPromoteListRequestObj(state) {
      PromoteListRequestObj.clear(state.promoteListRequestObj);
    },
    /** 设置活动列表数据
     ---------------------------------------- */
    setPromoteListData(state, [data, num]) {
      state.PromoteListData = data;
      if (!num && num !== 0) return;
      state.count = num;
    },
    /** 设置活动列表数据中某个数据的状态 多用于强制执行后状态修改
     ---------------------------------------- */
    setStatusInPromoteListData(state, [index, status]) {
      state.PromoteListData[index].Status = status;
    },
    /** 调整请求对象信息中的时间信息
     ---------------------------------------- */
    setRequestObjDate(state) {
      const dateTypeList = ['all', 'today', 'yesterday', 'beforeyesterday'];
      if (dateTypeList.includes(state.promoteListRequestObj.DateType)) {
        switch (state.promoteListRequestObj.DateType) {
          case 'all':
            state.promoteListRequestObj.ValidTime.key = this.getters['timeSelectModule/AlltimeDate'].First;
            state.promoteListRequestObj.ValidTime.value = this.getters['timeSelectModule/AlltimeDate'].Second;
            break;
          case 'today':
            state.promoteListRequestObj.ValidTime.key = this.getters['timeSelectModule/TodayDate'].First;
            state.promoteListRequestObj.ValidTime.value = this.getters['timeSelectModule/TodayDate'].Second;
            break;
          case 'yesterday':
            state.promoteListRequestObj.ValidTime.key = this.getters['timeSelectModule/YesterdayDate'].First;
            state.promoteListRequestObj.ValidTime.value = this.getters['timeSelectModule/YesterdayDate'].Second;
            break;
          case 'beforeyesterday':
            state.promoteListRequestObj.ValidTime.key = this.getters['timeSelectModule/BeforeYesterdayTimeDate'].First;
            state.promoteListRequestObj.ValidTime.value = this.getters['timeSelectModule/BeforeYesterdayTimeDate'].Second;
            break;
          default:
            break;
        }
      }
    },
    /** 设置活动添加请求数据
     ---------------------------------------- */
    setPromoteAddRequestObj(state, [[key1, key2], value]) {
      if (!key2) state.promoteAddRequestObj[key1] = value;
      else state.promoteAddRequestObj[key1][key2] = value;
    },
    /** 请求对象信息中新增条件
     ---------------------------------------- */
    addCondition4AddRequestObj(state, [ProductIndex, ConstraintIndex]) {
      const _obj = {
        ProductID: '',
        PartID: '',
        CraftID: '',
        GroupID: '',
        PropertyID: '', // 以上5个为回传项
        PropertyType: '', // 条件前半部分
        Operator: '', // 关系
        Value: '', // 条件后半部分： 输入的值 | 选项的ID
      };
      // eslint-disable-next-line max-len
      state.promoteAddRequestObj.ProductList[ProductIndex].List[ConstraintIndex].Constraint.ItemList.push(_obj);
    },
    /** 请求对象信息中新增价格
     ---------------------------------------- */
    addPrice4AddRequestObj(state, ProductIndex) {
      const _obj = {
        Constraint: {
          FilterType: 1, // 为1时表示需要满足所有条件 为2时满足任一条件
          ItemList: [
            // {
            //   ProductID: '',
            //   PartID: '',
            //   CraftID: '',
            //   GroupID: '',
            //   PropertyID: '', // 以上5个为回传项
            //   PropertyType: '', // 条件前半部分
            //   Operator: '', // 关系
            //   Value: '', // 条件后半部分： 输入的值 | 选项的ID
            // },
          ],
        },
        PriceUnit: 0, // 所选择的分类项： 单价 | 总价 | 百分比
        Price: '', // 输入的价格值
      };
      state.promoteAddRequestObj.ProductList[ProductIndex].List.push(_obj);
    },
    /** 请求对象信息中删除价格 (或替换)
     ---------------------------------------- */
    delPrice4AddRequestObj(state, [ProductIndex, ConstraintIndex, data]) {
    //  console.log(data);
      if (!data) {
        state.promoteAddRequestObj.ProductList[ProductIndex].List.splice(ConstraintIndex, 1);
      } else {
        state.promoteAddRequestObj.ProductList[ProductIndex].List.splice(ConstraintIndex, 1, data);
      }
    },
    /** 请求对象信息中删除条件
     ---------------------------------------- */
    delCondition4AddRequestObj(state, [ProductIndex, ConstraintIndex, itemIndex]) {
      // eslint-disable-next-line max-len
      state.promoteAddRequestObj.ProductList[ProductIndex].List[ConstraintIndex].Constraint.ItemList.splice(itemIndex, 1);
    },
    /** 请求对象信息中修改条件
     ---------------------------------------- */
    editCondition4AddRequestObj(state, [ProductIndex, ConstraintIndex, itemIndex, data]) {
      state.promoteAddRequestObj
        .ProductList[ProductIndex].List[ConstraintIndex]
        .Constraint.ItemList.splice(itemIndex, 1, data);
    },
    /** 请求对象信息中修改条件中的价格 价格类型 价格方式
     ---------------------------------------- */
    setPriceUnitAndFilterTypeAndPrice(state, [ProductIndex, ConstraintIndex, type, data]) {
      if (type === 'FilterType') {
        state.promoteAddRequestObj
          .ProductList[ProductIndex].List[ConstraintIndex]
          .Constraint.FilterType = data;
      } else if (type === 'PriceUnit') {
        state.promoteAddRequestObj
          .ProductList[ProductIndex].List[ConstraintIndex]
          .PriceUnit = data;
      } else if (type === 'Price') {
        state.promoteAddRequestObj
          .ProductList[ProductIndex].List[ConstraintIndex]
          .Price = data;
      }
    },
    /** 请求对象信息中删除产品项
     ---------------------------------------- */
    delProductItem4AddRequestObj(state, ProductIndex) {
      state.promoteAddRequestObj.ProductList.splice(ProductIndex, 1);
    },
    /** 设置控制产品弹窗显示
     ---------------------------------------- */
    setWatchValue2ProductDia(state, data) {
      state.watchValue2ProductDia = data;
    },
    /** 设置控制产品弹窗打开操作类型 create | change
     ---------------------------------------- */
    setOpenType2ProductDia(state, index) {
      state.openTypeIndex2ProductDia = index;
    },
    /* 清除活动新增对象数据
     ---------------------------------------- */
    clearPromoteAddEditObjClassType(state) {
      const _obj = PromoteAddEditObjClassType.clear();
      state.promoteAddRequestObj = _obj;
    },
    /** 回填请求新增活动的对象信息
     ---------------------------------------- */
    writeBackPromoteAddRequestObj(state, obj) {
      const _obj = PromoteAddEditObjClassType.back(obj);
      state.promoteAddRequestObj = _obj;
    },
    /* 控制表格文件是否在加载中
     ---------------------------------------- */
    setPromoteTableDataLoading(state, bool) {
      state.promoteTableDataLoading = bool;
    },
    /** 设置接单员列表，只在回填时候使用
     ---------------------------------------- */
    setPromoteStaffList(state, list) {
      state.promoteStaffList = list;
    },
    /* 页面input监听对象， 当其改变时从store中获取keywords的值并赋值给搜索input框中，其状态改变发生在数据获取时
    -------------------------------*/
    setSearchWatchKey(state) {
      state.searchWatchKey += 1;
    },
  },
  actions: {
    async getPromoteList({ state, commit }, page = 1) {
      commit('setRequestObjDate');
      commit('setPromoteListRequestObj', [['Page', ''], page]);
      commit('setPromoteListData', [[], '']);
      const _obj = PromoteListRequestObj.filter(state.promoteListRequestObj);
      commit('setPromoteTableDataLoading', true);
      commit('setSearchWatchKey');
      const res = await api.getPromoteList(_obj);
      commit('setPromoteTableDataLoading', false);
      if (res.data.Status === 1000) commit('setPromoteListData', [res.data.Data, res.data.DataNumber]);
    },
    async savePromote({ state, commit }, [func, type = '']) {
      const _obj = state.promoteAddRequestObj;
      const text = PromoteAddEditObjClassType.check(_obj);
      if (typeof text === 'string') {
        Message({
          showClose: true,
          message: text,
          type: 'error',
        });
        return;
      }
      const _tempObj = PromoteAddEditObjClassType.filter(_obj);
      const res = await api.savePromote(_tempObj);
      const msg = type === 'edit' ? '活动修改成功' : '活动添加成功';
      if (res.data.Status === 1000) {
        messageBox.successSingle(msg, func, func);
        commit('clearPromoteAddEditObjClassType');
      }
    },
  },
};
