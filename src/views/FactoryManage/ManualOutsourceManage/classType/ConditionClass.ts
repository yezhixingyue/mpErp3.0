import CommonClassType from '../../../../store/CommonClassType';

export default class ConditionClass {
  ProductClass = {
    First: '',
    Second: '',
  }

  ProductID = ''

  FactoryID = ''

  KeyWords = '' // 订单号

  CheckFileOrderStatus = ''

  PayTime = {
    First: '',
    Second: '',
  }

  DateType = 'last3Date'

  CustomerType = '' // 客户类型

  Checker = '' // 审稿人

  Sender = '' // 外购操作人

  Page = 1

  PageSize = 20

  getFilterObj() {
    const temp = CommonClassType.filter(this, true);
    return temp;
  }
}
