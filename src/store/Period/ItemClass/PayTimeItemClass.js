import messageBox from '@/assets/js/utils/message';
// import { getValueIsOrNotNumber } from '@/assets/js/utils/util';

export default class PayTimeClass {
  ItemID = ''

  ItemName = '' // 无

  LatestPayTime = {
    First: '', // number
    Second: '', // number
  }

  ProduceStartTime = {
    First: '', // number
    Second: '', // number
  }

  // ProduceDelayTime = '' // number

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
      const { ItemID, LatestPayTime, ProduceStartTime, AreaDescribe, AreaList, ExpressList } = data;
      if (ItemID) this.ItemID = ItemID;
      const { First, Second } = LatestPayTime;
      if (First || First === 0) this.LatestPayTime.First = `0${First}`.slice(-2);
      if (Second || Second === 0) this.LatestPayTime.Second = `0${Second}`.slice(-2);
      if (ProduceStartTime.First || ProduceStartTime.First === 0) this.ProduceStartTime.First = `0${ProduceStartTime.First}`.slice(-2);
      if (ProduceStartTime.Second || ProduceStartTime.Second === 0) this.ProduceStartTime.Second = `0${ProduceStartTime.Second}`.slice(-2);
      // if (ProduceDelayTime || ProduceDelayTime === 0) this.ProduceDelayTime = ProduceDelayTime;
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
    const { AreaList, ExpressList, LatestPayTime, ProduceStartTime } = data;
    if (AreaList.length === 0) return throwFalseFunc('请选择指定区域');
    if (ExpressList.length === 0) return throwFalseFunc('请选择配送方式');
    if (!LatestPayTime.First || !LatestPayTime.Second) return throwFalseFunc('请设置付款时间');
    if (!ProduceStartTime.First || !ProduceStartTime.Second) return throwFalseFunc('请设置生产开始时间');
    // if (!ProduceDelayTime && ProduceDelayTime !== 0) return throwFalseFunc('请设置生产开始时间');
    // if (!getValueIsOrNotNumber(ProduceDelayTime, true)) return throwFalseFunc('生产开始时间必须为整型数字类型');
    // if (ProduceDelayTime < 0) return throwFalseFunc('生产开始时间不能为负');
    return true;
  }
}
