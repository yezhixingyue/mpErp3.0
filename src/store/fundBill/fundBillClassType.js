/** 客户资金流水筛选条件类 */
export default class FundBillClassType {
    SellArea = {
      RegionalID: '',
      CityID: '',
      CountyID: '',
    }

    /** [资金流水] - 类型 */
    CustomerBillType = ''

    /** [资金流水] - 方式 */
    CustomerBillMode = ''

    /** [资金流水] - 客户账户 */
    CustomerBillAccount = ''

    /** 日期筛选 */
    DateType = 'last30Date'

    Date = {
      First: '',
      Second: '',
    }

    /** 用户类型和等级 */
    CustomerType = {
      First: '',
      Second: '',
    }

    KeyWords= ''

    Page= 1

    PageSize= 30
}
