export default class RecordListConditonClass {
  Page = 1; // 页码

  KeyWords = ''; // 关键词 (活动名称)

  PageSize = 30; // 页容量

  DateType = 'today';

  CalculateDate = {
    First: '',
    Second: '',
  }

  SellArea = { // 销售区域
    RegionalID: '',
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

  Terminal = '';

  // initDateText = '今天';
}
