// import store from '@/store';
// import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

export default class FundBillClassType {
    SellArea = {
      RegionalID: '',
      CityID: '',
      CountyID: '',
    }

    /** 原交易类型 */
    // Type= ''

    /** 原账单类型 */
    // BillType = 1

    /** 原方式 */
    // Currency= ''

    /** 新流水类型 - 类型 */
    CustomerBillType = ''

    /** 新支付方式 - 方式 */
    CustomerBillMode = ''

    /** 新流水账号 - 客户账号 */
    CustomerBillAccount = ''

    Date = {
      First: '',
      Second: '',
    }

    CustomerType = {
      First: '',
      Second: '',
    }

    KeyWords= ''

    Page= 1

    PageSize= 30

    DateType = ''

    // initDateText= ''

    constructor(DateType = 'last30Date') {
      this.DateType = DateType;
    }
}
