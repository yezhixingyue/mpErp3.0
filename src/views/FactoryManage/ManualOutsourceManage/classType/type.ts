/** 手动外购-外购记录-单个条目接口类型 */
export interface IOutsourceProgress {
  /** 描述文字 */
  Description: string
  /** 顺序 */
  Index: number
  /** 操作人 */
  Operator: string
  /** 操作时间 */
  OperateTime: string
  /** 当前所处状态 */
  StatusName: string
}
