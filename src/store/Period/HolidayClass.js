/* eslint-disable max-len */
import Calendar from '@/assets/js/TypeClass/Calendar';
import messageBox from '@/assets/js/utils/message';
import { getValueIsOrNotNumber } from '@/assets/js/utils/util';
import api from '../../api';

const getCurYearMonth = () => `${new Date().getFullYear()}${`0${new Date().getMonth() + 1}`.slice(-2)}`;

export const createYearMonthByYM = ({ y, m } = {}) => {
  if (!y || (!m && m !== 0)) return '';
  const date = new Date(new Date(new Date().setDate(1)).setFullYear(y)).setMonth(m);
  const YearMonth = `${new Date(date).getFullYear()}${`0${new Date(date).getMonth() + 1}`.slice(-2)}`;
  return YearMonth;
};

export default class HolidayClass {
  ItemID = ''

  ItemName = ''

  DelayType = 2

  LatestTime = {
    First: '', // number
    Second: '', // number
  }

  ChangeTime = 0 // number 整数 可为负

  ProductionTime = '' // number 整数

  Tips = ''

  YearMonth = '' // number  格式202101 年月组合

  RestDateList = [
    // 1
  ]

  NoSetDateList = []

  DisableDateList = []

  constructor(initData) {
    if (initData && typeof initData === 'object') { // 编辑
      const { ItemID, ItemName, DelayType, LatestTime, ChangeTime, ProductionTime, Tips, YearMonth, RestDateList, NoSetDateList, DisableDateList, WorkDateList } = initData;
      if (ItemID) this.ItemID = ItemID;
      if (ItemName) this.ItemName = ItemName;
      if (DelayType) this.DelayType = DelayType;
      if (LatestTime && (LatestTime.First || LatestTime.First === 0)) this.LatestTime.First = LatestTime.First;
      if (LatestTime && (LatestTime.Second || LatestTime.Second === 0)) this.LatestTime.Second = LatestTime.Second;
      if (ChangeTime || ChangeTime === 0) this.ChangeTime = ChangeTime;
      if (ProductionTime || ProductionTime === 0) this.ProductionTime = ProductionTime;
      if (Tips) this.Tips = Tips;
      this.YearMonth = YearMonth || getCurYearMonth();
      if (Array.isArray(WorkDateList) && WorkDateList.length > 0) this.WorkDateList = WorkDateList; // 工作
      if (Array.isArray(RestDateList) && RestDateList.length > 0) this.RestDateList = RestDateList; // 休息
      if (Array.isArray(NoSetDateList) && NoSetDateList.length > 0) this.NoSetDateList = NoSetDateList; // 未设置
      if (Array.isArray(DisableDateList) && DisableDateList.length > 0) this.DisableDateList = DisableDateList; // 不可选
    } else { // 新增
      this.YearMonth = getCurYearMonth();
    }
  }

  /**
   * 获取节假日初始化数据 或为详情（ItemID有值） 或为新增信息（ItemID无值 YearMonth有值取YearMonth 无值则取当前日期）
   *
   * @static
   * @param {*} { ItemID, YearMonth }
   * @memberof HolidayClass
   */
  static async getInitData({ ItemID, YearMonth } = {}, item = null) {
    let temp = null;
    if (ItemID) { // 获取详情数据
      const resp = await api.getRestDayDetailByID(ItemID).catch(() => null);
      if (resp && resp.data.Status === 1000) temp = resp.data.Data;
      else return null;
    } else { // 获取该月初始详情数据
      const _YearMonth = YearMonth || getCurYearMonth();
      const resp = await api.getRestDayDetailByMonth(_YearMonth).catch(() => null);
      if (resp && resp.data.Status === 1000 && resp.data.Data && typeof resp.data.Data === 'object') {
        temp = { ...resp.data.Data, YearMonth: _YearMonth };
        if (item) {
          const { ItemName, DelayType, LatestTime, ChangeTime, ProductionTime, Tips } = item;
          temp = { ...temp, ItemName, DelayType, LatestTime, ChangeTime, ProductionTime, Tips };
        }
      } else {
        return null;
      }
    }
    const ItemData = new HolidayClass(temp);
    const dateData = this.getABAdIsCalendarData(ItemData);
    return { ...dateData, ItemData };
  }

  static getABAdIsCalendarData({ YearMonth, RestDateList, NoSetDateList, DisableDateList, WorkDateList }) {
    const year = `${YearMonth}`.slice(0, 4);
    const month = `${YearMonth}`.slice(4) - 1;
    const date = new Date(new Date(new Date(new Date().setDate(1)).setFullYear(year)).setMonth(month));
    const { weekList, dateList, currentDate, monthList, yearList } = Calendar.getANaturalCalendarData(date);
    const list = dateList.map(it => {
      const temp = { // 对日期列表进行进一步处理 添加业务中需要用到的状态 --- 后期状态名称可能修改
        ...it,
        hidden: it.disabled, // 隐藏显示
        empty: false, // 未设置 4种状态
        resting: false, // 休息
        working: false, // 工作
        disabled: false, // 不可选
      };
      if (!temp.hidden) {
        if (Array.isArray(RestDateList) && RestDateList.includes(it.d)) temp.resting = true;
        else if (Array.isArray(NoSetDateList) && NoSetDateList.includes(it.d)) temp.empty = true;
        else if (Array.isArray(DisableDateList) && DisableDateList.includes(it.d)) temp.disabled = true;
        else if (Array.isArray(WorkDateList) && WorkDateList.includes(it.d)) temp.working = true;
      }
      return temp;
    });
    // 后面在此根据请求到的数据来指定每项数据的状态值
    return { weekList, dateList: list, currentDate, monthList, yearList };
  }

  static async checkerAndSubmit(itemData, dateList, callback) {
    const throwFalseFunc = msg => {
      messageBox.failSingleError('保存失败', msg);
      return false;
    };
    if (!itemData || !Array.isArray(dateList) || dateList.length === 0) return throwFalseFunc('未获取到数据');
    const _itemData = { ...itemData };
    const { ItemName, DelayType, LatestTime, ChangeTime, ProductionTime, YearMonth } = _itemData;
    if (!ItemName) return throwFalseFunc('请填写名称');
    if (DelayType === 1) {
      if (!LatestTime || (!LatestTime.First && LatestTime.First !== 0) || (!LatestTime.Second && LatestTime.Second !== 0)) return throwFalseFunc('请设置每天最晚付款时间');
      _itemData.ChangeTime = '';
    } else if (DelayType === 2) {
      if (!getValueIsOrNotNumber(ChangeTime, true)) return throwFalseFunc('推移时间设置不正确');
      _itemData.LatestTime = null;
    } else {
      return throwFalseFunc('最晚付款时间选项设置不正确');
    }
    // if (!Tips) return throwFalseFunc('请填写给客户的提示信息');
    if (!getValueIsOrNotNumber(ProductionTime, true)) return throwFalseFunc('可生产工期设置不正确');
    if (ProductionTime < 0) return throwFalseFunc('可生产工期不能为负');
    if (!YearMonth) return throwFalseFunc('年月获取失败');
    const _RestDateList = dateList.filter(it => it.resting).map(it => it.d);
    const _NoSetDateList = dateList.filter(it => it.empty).map(it => it.d);
    const _WorkDateList = dateList.filter(it => it.working).map(it => it.d);
    if (_RestDateList.length === 0 && _NoSetDateList.length === 0 && _WorkDateList.length === 0) return throwFalseFunc('未设置有效状态'); // --- !!
    // 完成校验

    _itemData.RestDateList = _RestDateList;
    _itemData.NoSetDateList = _NoSetDateList;
    _itemData.WorkDateList = _WorkDateList;
    delete _itemData.DisableDateList;
    // 数据准备完成 执行提交
    const res = await this.submit(_itemData, callback);
    return res;
  }

  static async submit(itemData, callback) {
    if (!itemData) return false;
    const resp = await api.getRestDaySave(itemData).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        if (callback) callback(itemData, resp.data.Data);
      };
      const title = itemData.ItemID ? '编辑成功' : '添加成功';
      messageBox.successSingle(title, cb, cb);
      return true;
    }
    return false;
  }
}
