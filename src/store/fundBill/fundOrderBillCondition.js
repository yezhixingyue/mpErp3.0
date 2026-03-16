/** 客户订单流水筛选条件类 */
export default class FundOrderBillCondition {
  /** 销售区域 */
  SellArea = {
    RegionalID: '',
    CityID: '',
    CountyID: '',
  }

  /** [订单流水] - 筛选类型 */
  Type = ''

  /** [订单流水] - 客户账户 */
  Account = ''

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

  KeyWords = ''

  Page = 1

  PageSize = 30
}
