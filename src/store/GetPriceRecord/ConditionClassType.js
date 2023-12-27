export default class RecordListConditonClass {
  Page = 1; // 页码

  KeyWords = ''; // 关键词 (活动名称)

  PageSize = 20; // 页容量

  DateType = 'today';

  CalculateDate = {
    First: '',
    Second: '',
  }

  SellArea = { // 销售区域
    RegionalID: '',
    CountyID: '',
    CityID: '',
    SellArea: '',
  }

  ProductID = '';

  ProductClass = { // 产品
    First: '',
    Second: '',
  }

  Amount = { // 成交价
    First: '',
    Second: '',
  }

  TrackStatus = '';

  CustomerType= {
    First: '',
    Second: '',
  }
  // initDateText = '今天';

  Order= {
    First: '',
    Second: '',
  }
}
