import store from '@/store';

export default class FundBillClassType {
    SellArea = {
      RegionalID: '',
      CityID: '',
      CountyID: '',
    }

    Type= ''

    Currency= ''

    Date = {
      First: '',
      Second: '',
    }

    CustomerType = {
      First: '',
      Second: '',
    }

    KeyWords= ''

    Page= 0

    PageSize= 30

    constructor(DateType) {
      if (DateType) this.DateType = DateType;
      else this.DateType = 'all';
    }


    static setDate(obj) {
      const _obj = obj;
      const dateTypeList = ['all', 'today', 'yesterday', 'beforeyesterday', 'curMonth', 'lastMonth'];
      if (dateTypeList.includes(obj.DateType)) {
        switch (obj.DateType) {
          case 'all':
            _obj.Date.First = store.getters['timeSelectModule/AlltimeDate'].First;
            _obj.Date.Second = store.getters['timeSelectModule/AlltimeDate'].Second;
            break;
          case 'today':
            _obj.Date.First = store.getters['timeSelectModule/TodayDate'].First;
            _obj.Date.Second = store.getters['timeSelectModule/TodayDate'].Second;
            break;
          case 'yesterday':
            _obj.Date.First = store.getters['timeSelectModule/YesterdayDate'].First;
            _obj.Date.Second = store.getters['timeSelectModule/YesterdayDate'].Second;
            break;
          case 'beforeyesterday':
            _obj.Date.First = store.getters['timeSelectModule/BeforeYesterdayTimeDate'].First;
            _obj.Date.Second = store.getters['timeSelectModule/BeforeYesterdayTimeDate'].Second;
            break;
          case 'curMonth':
            _obj.Date.First = store.getters['timeSelectModule/curMonthDate'].First;
            _obj.Date.Second = store.getters['timeSelectModule/curMonthDate'].Second;
            break;
          case 'lastMonth':
            _obj.Date.First = store.getters['timeSelectModule/lastMonthDate'].First;
            _obj.Date.Second = store.getters['timeSelectModule/lastMonthDate'].Second;
            break;
          default:
            break;
        }
      }
    }

    static filter(obj) {
      const _tempObj = {};
      Object.keys(obj).forEach(key => {
        if (Object.prototype.toString.call(obj[key]) !== '[object Object]') {
          if (obj[key] && key !== 'DateType') _tempObj[key] = obj[key];
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
