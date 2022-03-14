/* eslint-disable max-len */
import messageBox from '@/assets/js/utils/message';
import { getValueIsOrNotNumber } from '@/assets/js/utils/util';
import getEnumList from '../../../assets/js/utils/getEnumList';

export const ProduceSpecialTypeEnums = {
  delay: {
    Name: '延长工时',
    ID: 1,
  },
  stop: {
    Name: '停工停产',
    ID: 2,
  },
};
const ProduceDelayTypeEnums = {
  pay: {
    Name: '付款时间范围',
    ID: 1,
  },
  dispatch: {
    Name: '发货时间范围',
    ID: 2,
  },
};

export const ProduceSpecialTypeEnumList = getEnumList(ProduceSpecialTypeEnums);
export const ProduceDelayTypeEnumList = getEnumList(ProduceDelayTypeEnums);

const ProduceSpecialTypeEnumIDList = ProduceDelayTypeEnumList.map(it => it.ID);
const ProduceDelayTypeEnumIDList = ProduceDelayTypeEnumList.map(it => it.ID);

// eslint-disable-next-line no-nested-ternary
// const getDateString = ({ First, Second }, isStart, isEnd) => `${First}T${Second}${isStart ? ':00.000Z' : (isEnd ? ':59.997Z' : '')}`;
const getDateString = ({ First, Second }) => `${First}T${Second}:00.000Z`;

export default class ProduceSpecialDayItemClass {
  ItemID = ''

  ItemName = ''

  SpecialType = ProduceSpecialTypeEnums.delay.ID // [{ Name: '延长工时', ID: 1 }, { Name: '快递停发', ID: 2 }]   number

  DelayType = '' // [{ Name: '付款时间范围', ID: 1 }, { Name: '发货时间范围', ID: 2 }]  number

  StartTime = { // 2021-12-31T01:58:45.384Z   开始时间
    First: '',
    Second: '',
  }

  EndTime = { // 2021-12-31T01:58:45.384Z     结束时间
    First: '',
    Second: '',
  }

  ChangeTime = '' // number

  Tips = ''

  ProductList = []

  AddTime = ''

  OperatorUserName = ''

  constructor(data) {
    if (data) {
      const { ItemID, ItemName, ProductList, SpecialType, DelayType, StartTime, EndTime, ChangeTime, Tips, AddTime, OperatorUserName } = data;
      if (ItemID) this.ItemID = ItemID;
      if (ItemName) this.ItemName = ItemName;
      if (ProduceSpecialTypeEnumIDList.includes(SpecialType)) this.SpecialType = SpecialType;
      if (ProduceDelayTypeEnumIDList.includes(DelayType)) this.DelayType = DelayType;
      if (StartTime) {
        this.StartTime.First = StartTime.split('T')[0] || '';
        this.StartTime.Second = StartTime.split('T')[1] ? (StartTime.split('T')[1].slice(0, 5) || '') : '';
      }
      if (EndTime) {
        this.EndTime.First = EndTime.split('T')[0] || '';
        this.EndTime.Second = EndTime.split('T')[1] ? (EndTime.split('T')[1].slice(0, 5) || '') : '';
      }
      if (ChangeTime || ChangeTime === 0) this.ChangeTime = ChangeTime;
      if (Tips) this.Tips = Tips;
      if (Array.isArray(ProductList) && ProductList.length > 0) this.ProductList = [...ProductList];
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
    const { ProductList, SpecialType, StartTime, EndTime, DelayType, ChangeTime, Tips, ItemName } = data;
    if (ProductList.length === 0) return throwFalseFunc('请选择产品');
    if (!ItemName) return throwFalseFunc('请输入标题');
    if (SpecialType === ProduceSpecialTypeEnums.delay.ID) { // 选中延长工时
      if (!ProduceDelayTypeEnumIDList.includes(DelayType)) return throwFalseFunc('请选择时间范围类型');
    }
    if (!StartTime.First) return throwFalseFunc('请设置开始时间日期');
    if (!StartTime.Second) return throwFalseFunc('请设置开始时间具体时间');
    if (!EndTime.First) return throwFalseFunc('请设置结束时间日期');
    if (!EndTime.Second) return throwFalseFunc('请设置结束时间具体时间');
    if (new Date(getDateString(StartTime)).getTime() >= new Date(getDateString(EndTime)).getTime()) {
      return throwFalseFunc('结束时间不能早于开始时间');
    }
    if (SpecialType === ProduceSpecialTypeEnums.stop.ID) { // 快递停发
      if (new Date(getDateString(StartTime)).getTime() <= Date.now()) {
        return throwFalseFunc('开始时间不能早于当前时间');
      }
    }
    // if (SpecialType === ProduceSpecialTypeEnums.delay.ID) { // 选中延长工时
    let title = '';
    if (SpecialType === ProduceSpecialTypeEnums.delay.ID) title = '延长工时';
    if (SpecialType === ProduceSpecialTypeEnums.stop.ID) title = '可生产工期';
    if (!ChangeTime && ChangeTime !== 0) return throwFalseFunc(`请设置${title}时间`);
    if (!getValueIsOrNotNumber(ChangeTime, true) || ChangeTime < 0) return throwFalseFunc(`${title}时间不能小于0`);
    // }
    if (!Tips) return throwFalseFunc('请填写客户提示');
    return true;
  }

  static transform(data) {
    if (!data) return null;
    const temp = { ...data };
    temp.StartTime = getDateString(data.StartTime, true);
    temp.EndTime = getDateString(data.EndTime, false, true);
    if (data.SpecialType === ProduceSpecialTypeEnums.stop.ID) {
      delete temp.DelayType; // 删除时间范围类型
    }
    return temp;
  }
}
