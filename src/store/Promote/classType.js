export default class PromoteListRequestObj {
  Status = '';

  ApplyUserID = ''; // 申请人ID

  OperateUserID = ''; // 创建人ID

  ValidTime = { // 活动起止时间
    key: '',
    value: '',
  };

  Customer = { // 客户类型
    First: '',
    Second: '',
  };

  SellArea = { // 销售区域
    RegionalID: '',
    CityID: '',
    CountyID: '',
  };

  Product = { // 产品信息
    ClassID: '',
    TypeID: '',
    ProductID: '',
  };

  FieldType = 3; // 请求类型1

  Page = 1; // 页码

  KeyWords = ''; // 关键词 (活动名称)

  PageSize = 30; // 页容量

  OrderType = '';

  DateType = 'all';

  static filter(obj) {
    const _tempObj = {};
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) !== '[object Object]') {
        if (obj[key] && key !== 'DateType') _tempObj[key] = obj[key];
        else if (obj[key] === 0 && key === 'Status') _tempObj[key] = obj[key];
      } else {
        const _t = obj[key];
        Object.keys(_t).forEach(subKey => {
          if (_t[subKey]) {
            if (!_tempObj[key]) _tempObj[key] = {};
            _tempObj[key][subKey] = _t[subKey];
          }
        });
      }
    });
    return _tempObj;
  }

  static clear(obj) {
    const temp = obj;
    Object.keys(temp).forEach(key => {
      if (Object.prototype.toString.call(temp[key]) !== '[object Object]' && key !== 'FieldType') {
        if (key === 'Page') temp[key] = 1;
        else if (key === 'PageSize') temp[key] = 30;
        else if (key === 'DateType') temp[key] = 'all';
        else temp[key] = '';
      } else {
        const _t = temp[key];
        Object.keys(_t).forEach(subKey => { temp[key][subKey] = ''; });
      }
    });
  }
}
