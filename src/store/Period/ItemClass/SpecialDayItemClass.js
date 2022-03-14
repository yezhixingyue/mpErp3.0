import messageBox from '@/assets/js/utils/message';
import { getValueIsOrNotNumber } from '@/assets/js/utils/util';
import getEnumList from '../../../assets/js/utils/getEnumList';

export const SpecialTypeEnums = {
  delay: {
    Name: '延长工时',
    ID: 1,
  },
  stop: {
    Name: '快递停发',
    ID: 2,
  },
};
const DelayTypeEnums = {
  pay: {
    Name: '付款时间范围',
    ID: 1,
  },
  dispatch: {
    Name: '送达时间范围',
    ID: 2,
  },
};

export const SpecialTypeEnumList = getEnumList(SpecialTypeEnums);
export const DelayTypeEnumList = getEnumList(DelayTypeEnums);

const SpecialTypeEnumIDList = SpecialTypeEnumList.map(it => it.ID);
const DelayTypeEnumIDList = DelayTypeEnumList.map(it => it.ID);

// eslint-disable-next-line no-nested-ternary
const getDateString = ({ First, Second }) => `${First}T${Second}':00.000Z'`;

export default class SpecialDayItemClass {
  ItemID = ''

  SpecialType = SpecialTypeEnums.delay.ID // [{ Name: '延长工时', ID: 1 }, { Name: '快递停发', ID: 2 }]   number

  DelayType = '' // [{ Name: '付款时间范围', ID: 1 }, { Name: '发货 / 送达时间范围', ID: 2 }]  number

  DelayStartTime = { // 2021-12-31T01:58:45.384Z   延长工时开始时间
    First: '',
    Second: '',
  }

  DelayEndTime = { // 2021-12-31T01:58:45.384Z     延长工时结束时间
    First: '',
    Second: '',
  }

  StopEndTime = { // 停止开始时间
    First: '',
    Second: '23:59',
  }

  DelayTime = '' // number

  Tips = ''

  AreaDescribe = ''

  AreaList = []

  ExpressList = []

  AddTime = ''

  OperatorUserName = ''

  constructor(data) {
    if (data) {
      const { ItemID, AreaDescribe, AreaList, ExpressList, SpecialType, DelayType, StartTime, EndTime, DelayTime, Tips, AddTime, OperatorUserName } = data;
      if (ItemID) this.ItemID = ItemID;
      if (AreaDescribe) this.AreaDescribe = AreaDescribe;
      if (SpecialTypeEnumIDList.includes(SpecialType)) this.SpecialType = SpecialType;
      if (DelayTypeEnumIDList.includes(DelayType)) this.DelayType = DelayType;
      if (SpecialType === SpecialTypeEnums.delay.ID) {
        if (StartTime) {
          this.DelayStartTime.First = StartTime.split('T')[0] || '';
          this.DelayStartTime.Second = StartTime.split('T')[1] ? (StartTime.split('T')[1].slice(0, 5) || '') : '';
        }
        if (EndTime) {
          this.DelayEndTime.First = EndTime.split('T')[0] || '';
          this.DelayEndTime.Second = EndTime.split('T')[1] ? (EndTime.split('T')[1].slice(0, 5) || '') : '';
        }
      } else if (SpecialType === SpecialTypeEnums.stop.ID) {
        if (EndTime) {
          this.StopEndTime.First = EndTime.split('T')[0] || '';
          this.StopEndTime.Second = EndTime.split('T')[1] ? (EndTime.split('T')[1].slice(0, 5) || '') : '';
        }
      }
      if (DelayTime || DelayTime === 0) this.DelayTime = DelayTime;
      if (Tips) this.Tips = Tips;
      if (Array.isArray(AreaList) && AreaList.length > 0) this.AreaList = [...AreaList];
      if (Array.isArray(ExpressList) && ExpressList.length > 0) this.ExpressList = [...ExpressList];
      if (AddTime) this.AddTime = AddTime;
      if (OperatorUserName) this.OperatorUserName = OperatorUserName;
    }
  }

  /**
   * 提交时的验证方法，返回布尔值
   *
   * @static
   * @param {*} data
   * @memberof PayTimeClass
   */
  static submitChecker(data) {
    const throwFalseFunc = msg => {
      messageBox.failSingleError('保存失败', msg);
      return false;
    };
    if (!data) return throwFalseFunc('未获取到数据');
    const { AreaList, ExpressList, SpecialType, DelayStartTime, DelayEndTime, DelayType, DelayTime, StopEndTime, Tips } = data;
    if (AreaList.length === 0) return throwFalseFunc('请选择指定区域');
    if (ExpressList.length === 0) return throwFalseFunc('请选择配送方式');
    if (SpecialType === SpecialTypeEnums.delay.ID) { // 选中延长工时
      if (!DelayStartTime.First) return throwFalseFunc('请设置开始时间日期');
      if (!DelayStartTime.Second) return throwFalseFunc('请设置开始时间具体时间');
      if (!DelayEndTime.First) return throwFalseFunc('请设置结束时间日期');
      if (!DelayEndTime.Second) return throwFalseFunc('请设置结束时间具体时间');
      if (new Date(getDateString(DelayStartTime)).getTime() >= new Date(getDateString(DelayEndTime)).getTime()) {
        return throwFalseFunc('结束时间必须晚于开始时间');
      }
      // if (new Date(getDateString(DelayEndTime)).getTime() <= Date.now()) {
      //   return throwFalseFunc('结束时间必须晚于当前时间');
      // }
      if (!DelayTypeEnumIDList.includes(DelayType)) return throwFalseFunc('请选择时间范围类型');
      if (!DelayTime && DelayTime !== 0) return throwFalseFunc('请输入延长工时');
      if (!getValueIsOrNotNumber(DelayTime, true)) return throwFalseFunc('延长工时必须为整数格式');
      if (DelayTime <= 0) return throwFalseFunc('延长工时必须大于0');
    } else if (SpecialType === SpecialTypeEnums.stop.ID) { // 快递停发
      if (!StopEndTime.First) return throwFalseFunc('请设置结束时间');
      if (new Date(getDateString(StopEndTime)).getTime() <= Date.now()) {
        return throwFalseFunc('结束时间必须晚于当前时间');
      }
    }
    if (!Tips) return throwFalseFunc('请填写客户提示');
    return true;
  }

  static transform(data) {
    if (!data) return null;
    const temp = { ...data };
    if (data.SpecialType === SpecialTypeEnums.delay.ID) { // StartTime, EndTime
      temp.StartTime = getDateString(data.DelayStartTime, true);
      temp.EndTime = getDateString(data.DelayEndTime, false, true);
    } else if (data.SpecialType === SpecialTypeEnums.stop.ID) {
      temp.EndTime = getDateString(data.StopEndTime, false, true);
      delete temp.DelayType;
      delete temp.DelayTime;
    }
    delete temp.DelayStartTime;
    delete temp.DelayEndTime;
    delete temp.StopEndTime;
    return temp;
  }
}
