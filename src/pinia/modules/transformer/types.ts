import { UseModuleEnum } from './map/enum';

/** 页面头部按钮种类信息 */
export enum menuTypeEnum {
  /** 操作日志 */
  log = 'log',
  /** 辅助文件映射 */
  assist = 'assist',
  /** 拼版文件映射 */
  makeup = 'makeup',
  /** 专色文件映射 */
  color = 'color',
  /** 物料映射 */
  material = 'material',
  /** 工艺分解 */
  processDecomposition = 'processDecomposition',
  /** 选择产品部件 */
  partSetup = 'partSetup',
  /** 组合生产线映射 */
  UnionLine = 'UnionLineCount',
  /** 组合工序映射 */
  UnionWorking = 'UnionWorkingCount',
  /** 生产线映射 */
  LineCount = 'LineCount',
  /** 工序映射 */
  WorkingCount = 'WorkingCount',
  /** 作业次数 */
  WorkTimes = 'WorkTimesCount',
  /** 文字信息映射 */
  WordsInfo = 'WordsInfoCount',
  /** 数值映射 */
  NumbericInfo = 'NumbericInfoCount',
  /** 合拼设置 */
  UnionMakeupLimit = 'UnionMakeupLimitCount',
  /** 数码自动拼版 */
  NumericalCodeAutoMakeup = 'AutoImpositionCount',
  /** 其它设置（主要为折手及其相关） */
  OtherSetup = 'OtherSetup',
  /** 半成品设置 */
  SemiFinishedProduct = 'SemiFinishedProduct',
}

export interface IPart {
  ID: string
  Name: string
  IsSelected: boolean
  /** 默认生产线 */
  DefaultLine: null | { ID: string, Name: string }
  /** 生产线映射条数 */
  LineCount: number
  /** 数值信息映射条数 */
  NumbericInfoCount: number
  /** 半成品 */
  SemiFinished: null | { ID: string, Name: string }
  /** 合拼禁用设置条数 */
  UnionMakeupLimitCount: number
  /** 数码自动拼版 */
  AutoImpositionCount: number
  /** 文字信息映射条数  */
  WordsInfoCount: number
  /** 作业次数映射条数 */
  WorkTimesCount: number
  /** 工序映射条数  */
  WorkingCount: number
  UseTimes: {
    MinValue: number
    MaxValue: number
  },
  /** 是否需要折手  */
  NeedFolding: boolean
}

export interface IProduct extends Omit<IPart, 'UseTimes'> {
  ServerID: string
  Class: {
    FirstLevel: { ID: number, Name: null | string },
    SecondLevel: { ID: number, Name: null | string },
  }
  /** 默认组合生产线 */
  DefaultUnionLine: null | { ID: string, Name: string }
  /** 组合生产线映射数量  */
  UnionLineCount: number
  /** 组合工序映射条数 */
  UnionWorkingCount: number
  /** 组合 - 数值信息映射条数 */
  UnionNumbericInfoCount: number
  /** 组合 - 作业映射条数 */
  UnionWorkTimesCount: number
  /** 组合 - 文字信息映射条数 */
  UnionWordsInfoCount: number
  PartList: IPart[]
  /** 工艺分解条目数量 */
  CraftResolveCount: number
}

export interface IPartChangeParams {
  ID: string
  IsSelected: boolean
  ServerID: string
  PartList: { ID: string, IsSelected: boolean }[]
}

export interface ISemiFinishedSaveParams {
  ServerID: string
  ProductID: string
  InstanceID: string
  SemiFinishedID: string
}

/** 设置是否需要折手要提交的参数数据类型 */
export interface IFoldingSetupSaveParams {
  ServerID: string
  ProductID: string
  InstanceID: string
  NeedFolding: boolean
}

export interface IGetWorkingProcedureParams {
  ServerID: string
  OnlyShowNormal?: boolean
  ProductID: string
  InstanceID?: string
  Page?: number
  PageSize?: number
}

export interface IGetFormulaParams {
  ProductID: string
  PartID?: string
}

export interface IGetPropertyListParams extends IGetFormulaParams {
  UseModule: UseModuleEnum
}

export interface IGetDefaultLineSetupParams {
  ServerID: string
  ProductID: string
  InstanceID?: string
  DefaultLineID?: string
  DefaultUnionLineID?: string
}
