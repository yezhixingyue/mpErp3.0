import CommonClassType from '../../../../store/CommonClassType';

export default class ConditionClass {
  TimeRange = {
    MinValue: '',
    MaxValue: '',
  }

  DateType = 'today'

  ShowOrderCount = true // 订单量

  ShowKind = true // 款数

  ShowAmount = true // 金额

  Page = 1

  PageSize = 30

  getFilterObj() {
    CommonClassType.setDate(this, 'TimeRange', { First: 'MinValue', Second: 'MaxValue' });
    const temp = CommonClassType.filter(this, true);
    temp.ShowOrderCount = true;
    temp.ShowKind = true;
    temp.ShowAmount = true;
    return temp;
  }

  static setCondition(obj, [[key1, key2], value]) { // 设置条件
    if (!obj) return;
    const _obj = obj;
    if (!key2) _obj[key1] = value;
    else _obj[key1][key2] = value;
  }
}
