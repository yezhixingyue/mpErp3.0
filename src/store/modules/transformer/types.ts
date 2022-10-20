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
}

export interface IPart {
  ID: string
  Name: string
  IsSelected: boolean
  /** 默认生产线 */
  DefaultLine: null
  /** 生产线映射条数 */
  LineCount: number
  /** 数值信息映射条数 */
  NumbericInfoCount: number
  /** 半成品 */
  SemiFinishedProduct: null
  /** 合拼禁用设置条数 */
  UnionMakeupLimitCount: number
  /** 文字信息映射条数  */
  WordsInfoCount: number
  /** 作业次数映射条数 */
  WorkTimesCount: number
  /** 工序映射条数  */
  WorkingCount: number
  UseTimes: {
    MinValue: number
    MaxValue: number
  }
}

export interface IProduct extends Omit<IPart, 'UseTimes'> {
  ServerID: string
  Class: {
    FirstLevel: { ID: number },
    SecondLevel: { ID: number },
  }
  /** 默认组合生产线 */
  DefaultUnionLine: null
  /** 组合生产线映射数量  */
  UnionLineCount: number
  /** 组合工序映射条数 */
  UnionWorkingCount: number
  PartList: IPart[]
}

export interface IPartChangeParams {
  ID: string
  IsSelected: boolean
  ServerID: string
  PartList: { ID: string, IsSelected: boolean }[]
}
