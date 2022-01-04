
import messageBox from '@/assets/js/utils/message';

export default class DispatchTimeItemClass {
  ItemID = ''

  ItemName = '' // 有

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

  LatestDispatchTime = {
    First: '', // number
    Second: '', // number
  }

  constructor(data) {
    if (data) {
      const { ItemID, ItemName, AreaDescribe, AreaList, LatestDispatchTime } = data;
      if (ItemID) this.ItemID = ItemID;
      if (ItemName) this.ItemName = ItemName;
      if (AreaDescribe) this.AreaDescribe = AreaDescribe;
      if (Array.isArray(AreaList) && AreaList.length > 0) this.AreaList = [...AreaList];
      const { First, Second } = LatestDispatchTime;
      if (First || First === 0) this.LatestDispatchTime.First = `0${First}`.slice(-2);
      if (Second || Second === 0) this.LatestDispatchTime.Second = `0${Second}`.slice(-2);
    }
  }

  /**
   * 提交时的验证方法，返回布尔值
   *
   * @static
   * @param {*} data
   * @memberof DispatchTimeItemClass
   */
  static submitChecker(data) {
    const throwFalseFunc = msg => {
      messageBox.failSingleError('保存失败', msg);
      return false;
    };
    if (!data) return throwFalseFunc('未获取到数据');
    const { AreaList, LatestDispatchTime, ItemName } = data;
    if (!ItemName) return throwFalseFunc('请填写名称');
    if (AreaList.length === 0) return throwFalseFunc('请选择指定区域');
    const { First, Second } = LatestDispatchTime;
    if (!First || !Second) return throwFalseFunc('请设置当天最迟派件时间');

    return true;
  }
}
