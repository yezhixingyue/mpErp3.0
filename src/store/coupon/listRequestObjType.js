export default class ListRequestObjType {
  ApplyUserID = '' // 申请人

  OperateUserID = '' // 操作人

  Customer = { // 用户类型与等级信息
    First: '',
    Second: '',
  }

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

  ProvideStatus = '' // 发放状态 枚举列表

  UseStatus = '' // 可使用状态 枚举列表

  FieldType = 1 // 值传几

  Page = 1

  KeyWords = ''

  PageSize = 30

  static clear(obj) {
    const _obj = obj;
    _obj.ApplyUserID = ''; // 申请人

    _obj.OperateUserID = ''; // 操作人

    _obj.Customer = { // 用户类型与等级信息
      First: '',
      Second: '',
    };

    _obj.SellArea = { // 销售区域
      RegionalID: '',
      CityID: '',
      CountyID: '',
    };

    _obj.Product = { // 产品信息
      ClassID: '',
      TypeID: '',
      ProductID: '',
    };

    _obj.ProvideStatus = ''; // 发放状态 枚举列表

    _obj.UseStatus = ''; // 可使用状态 枚举列表

    _obj.FieldType = 1; // 值传几

    _obj.Page = 1;

    _obj.KeyWords = '';

    _obj.PageSize = 30;

    // return _obj;
  }

  static filter(obj) {
    const _tempObj = {};
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) !== '[object Object]') {
        if (obj[key] && key !== 'DateType') _tempObj[key] = obj[key];
        else if (obj[key] === 0 && (key === 'UseStatus' || key === 'ProvideStatus')) _tempObj[key] = obj[key];
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
}
