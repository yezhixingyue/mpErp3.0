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

  Page = 1

  PageSize = 20

  getFilterObj() {
    const temp = CommonClassType.filter(this, true);
    return temp;
  }
}
