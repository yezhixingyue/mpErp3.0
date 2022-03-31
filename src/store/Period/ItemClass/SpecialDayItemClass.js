import messageBox from '@/assets/js/utils/message';

const getDateString = ({ First, Second }) => `${First}T${Second}:00.000Z`;

export default class SpecialDayItemClass {
  ItemID = ''

  EndTime = { // 停止开始时间
    First: '',
    Second: '23:59',
  }

  Tips = ''

  AreaDescribe = ''

  AreaList = []

  ExpressList = []

  AddTime = ''

  OperatorUserName = ''

  constructor(data) {
    if (data) {
      const { ItemID, AreaDescribe, AreaList, ExpressList, EndTime, Tips, AddTime, OperatorUserName } = data;
      if (ItemID) this.ItemID = ItemID;
      if (AreaDescribe) this.AreaDescribe = AreaDescribe;
      if (EndTime) {
        this.EndTime.First = EndTime.split('T')[0] || '';
        this.EndTime.Second = EndTime.split('T')[1] ? (EndTime.split('T')[1].slice(0, 5) || '') : '';
      }
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
    const { AreaList, ExpressList, EndTime, Tips } = data;
    if (AreaList.length === 0) return throwFalseFunc('请选择指定区域');
    if (ExpressList.length === 0) return throwFalseFunc('请选择配送方式');
    if (!EndTime.First) return throwFalseFunc('请设置结束时间');
    if (new Date(getDateString(EndTime)).getTime() <= Date.now()) {
      return throwFalseFunc('结束时间必须晚于当前时间');
    }
    if (!Tips) return throwFalseFunc('请填写客户提示');
    return true;
  }

  static transform(data) {
    if (!data) return null;
    const temp = { ...data };
    temp.EndTime = getDateString(data.EndTime, false, true);
    return temp;
  }
}
