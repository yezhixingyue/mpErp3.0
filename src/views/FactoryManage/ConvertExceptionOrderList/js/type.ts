import { IBaseProperty } from '@/assets/types';

/** 排程异常列表条目数据类型 */
export interface IConvertExceptionListItem {
  ID: number
  /** 订单ID */
  OrderID: number
  /** 内容 */
  Content: string
  /** 处理时间 */
  DealTime: string
  /** 处理人 */
  Operator: IBaseProperty<string>
  /** 转换器 */
  Server: IBaseProperty<string>
  /** 创建时间 */
  CreateTime: string
}
