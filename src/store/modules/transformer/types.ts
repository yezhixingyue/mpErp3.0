/** 页面头部按钮种类信息 */
export enum menuTypeEnum {
  log = 'log',
  assist = 'assist',
  makeup = 'makeup',
  color = 'color',
  material = 'material',
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
