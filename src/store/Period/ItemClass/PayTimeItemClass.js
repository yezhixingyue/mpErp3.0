import messageBox from '@/assets/js/utils/message';
import { getValueIsOrNotNumber } from '@/assets/js/utils/util';

export default class PayTimeClass {
  ItemID = ''

  ItemName = '' // 无

  LatestPayTime = {
    First: '', // number
    Second: '', // number
  }

  ProduceDelayTime = '' // number

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
      const { ItemID, LatestPayTime, ProduceDelayTime, AreaDescribe, AreaList, ExpressList } = data;
      if (ItemID) this.ItemID = ItemID;
      const { First, Second } = LatestPayTime;
      if (First || First === 0) this.LatestPayTime.First = `0${First}`.slice(-2);
      if (Second || Second === 0) this.LatestPayTime.Second = `0${Second}`.slice(-2);
      if (ProduceDelayTime || ProduceDelayTime === 0) this.ProduceDelayTime = ProduceDelayTime;
      if (AreaDescribe) this.AreaDescribe = AreaDescribe;
      if (Array.isArray(AreaList) && AreaList.length > 0) this.AreaList = [...AreaList];
      if (Array.isArray(ExpressList) && ExpressList.length > 0) this.ExpressList = [...ExpressList];
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
    const { AreaList, ExpressList, LatestPayTime, ProduceDelayTime } = data;
    if (AreaList.length === 0) return throwFalseFunc('请选择指定区域');
    if (ExpressList.length === 0) return throwFalseFunc('请选择配送方式');
    const { First, Second } = LatestPayTime;
    if (!First || !Second) return throwFalseFunc('请设置付款时间');
    if (!ProduceDelayTime && ProduceDelayTime !== 0) return throwFalseFunc('请设置生产延后时长');
    if (!getValueIsOrNotNumber(ProduceDelayTime, true)) return throwFalseFunc('生产延后时长必须为整型数字类型');
    if (ProduceDelayTime < 0) return throwFalseFunc('生产延后时长不能为负');
    return true;
  }
}
