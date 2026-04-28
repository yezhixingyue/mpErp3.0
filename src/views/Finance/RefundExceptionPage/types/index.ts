import { RefundApplyChannelEnum, RefundExceptionStatusEnum } from './enum';

interface IAreaCell {
  RegionalID: number
  RegionalName?: string
  CityID: number
  CityName?: string
  CountyID: number
  CountyName?: string
}

interface IOrderCustomer {
  CustomerID: string
  CustomerSN: string
  CustomerName: string
  /** 客户类型 */
  Type: {
    First: number
    Second: string
  }
  Mobile: string
  QQ: string
  /** 行政区域 */
  Location: IAreaCell
  /** 销售区域 */
  SellArea: IAreaCell
  /** 等级 */
  Grade: {
    First: number
    Second: string
    Third: number
  }
}

/** 退款异常条目接口 */
export interface IRefundExceptionItem {
  /** 退款ID */
  ID: number
  /** 订单ID */
  OrderID: number
  /** 订单付款时间 */
  PayTime: string
  /** 客户信息 */
  Customer: IOrderCustomer
  /** 支付单号 */
  PayCode: number
  /** 扫码账户 BillAccountEnumList */
  QRAccount: number
  /** 通联支付单号 */
  ThirdTradeSN: string
  /** 微信/支付宝单号 */
  OutTradeSN: string
  /** 金额 */
  Amount: number
  /** 状态 0 未支付  1 未处理  2 已处理  */
  Status: RefundExceptionStatusEnum
  /** 通联支付应用ID */
  AppID: string
  /** 说明 */
  Remark: string
  /** 退款申请渠道 */
  Channel: RefundApplyChannelEnum
  /** 申请人 */
  ApplyName: string
  /** 申请时间 */
  ApplyTime: string
  /** 重试次数 */
  RetyTimes: number
  /** 异常原因 */
  Error: string
  /** 重试时间 */
  RetryTime: string
  /** 操作人 */
  OperatorName: string
  /** 操作时间 */
  FinishTime: string
}
