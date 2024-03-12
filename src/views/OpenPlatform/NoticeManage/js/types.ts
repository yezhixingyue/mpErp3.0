import { DeveloperNoticeTargetEnum } from './enum';

/** 开发者信息接口类型 */
export interface IDeveoperNotice {
  ID: string
  /** 接收对象类型枚举 */
  TargetType: DeveloperNoticeTargetEnum
  /** 是否包含新增 */
  IncludeNew: boolean
  DeveloperID: string
  DeveloperName: string
  OperatorID: string
  OperatorName: string
  Title: string
  Content: string
  CreateTime: string
}
