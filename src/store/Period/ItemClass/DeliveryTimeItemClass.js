
import messageBox from '@/assets/js/utils/message';
import { getValueIsOrNotNumber } from '@/assets/js/utils/util';

export default class DeliveryTimeItemClass {
  ItemID = ''

  ItemName = '' // 有

  Shift = [{ ...DeliveryTimeItemClass.generateOneNewShiftItem() }] // 发货班次列表 初始长度为1

  AreaDescribe = ''

  AreaList = [
    // {
    //   CountryID: '', // number 国家ID 可不传?
    //   ProvinceID: '',
    //   CityID: '',
    //   CountyID: '',
    //   IsAll: false,
    // },
  ]

  ExpressList = [
    // {
    //   ID: '',
    //   Name: '',
    // },
  ]

  constructor(data) {
    if (data) {
      const { ItemID, ItemName, Shift, AreaDescribe, AreaList, ExpressList } = data;
      if (ItemID) this.ItemID = ItemID;
      if (ItemName) this.ItemName = ItemName;
      if (AreaDescribe) this.AreaDescribe = AreaDescribe;
      if (Array.isArray(Shift) && Shift.length > 0) this.Shift = Shift.map(it => DeliveryTimeItemClass.generateOneNewShiftItem(it));
      if (Array.isArray(AreaList) && AreaList.length > 0) this.AreaList = [...AreaList];
      if (Array.isArray(ExpressList) && ExpressList.length > 0) this.ExpressList = [...ExpressList];
    }
  }

  static generateOneNewShiftItem(shiftTtem) { // 生成一条发货班次时间设置数据
    if (!shiftTtem) {
      return {
        S: { // 时间点
          F: '', // number
          S: '', // number
        },
        D: '', // number  运输时长 天
        H: '', // number 运输时长 小时
        key: Math.random().toString(16).slice(-10),
      };
    }
    return { ...shiftTtem, key: Math.random().toString(16).slice(-10) };
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
    const { AreaList, ExpressList, ItemName, Shift } = data;
    if (!ItemName) return throwFalseFunc('请填写名称');
    if (AreaList.length === 0) return throwFalseFunc('请选择指定区域');
    if (ExpressList.length === 0) return throwFalseFunc('请选择配送方式');
    if (Shift.length === 0) return throwFalseFunc('请设置发货班次');

    let t = Shift.find(({ S }) => (!S.F && S.F !== 0) || (!S.S && S.S !== 0));
    if (t) return throwFalseFunc('发货班次信息不完整，请检查');
    t = Shift.find(({ D, H }) => (!D && D !== 0) && (!H && H !== 0));
    if (t) return throwFalseFunc('请设置运输时长');
    t = Shift.find(({ D, H }) => (D && !getValueIsOrNotNumber(D, true)) || (H && !getValueIsOrNotNumber(H, true)));
    if (t) return throwFalseFunc('运输时长类型设置不正确，应为整数类型');
    t = Shift.find(({ D, H }) => D < 0 || H < 0);
    if (t) return throwFalseFunc('运输时长类型不能为负');
    t = Shift.find(({ D, H }) => D === 0 && H === 0);
    if (t) return throwFalseFunc('运输时长天与小时不能同时为0');
    return true;
  }
}
