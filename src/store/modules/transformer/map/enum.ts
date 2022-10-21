/** 辅助映射类型 */
export enum AssistMappingTypeEnum {
  /** 辅助文件 */
  AssistFile = 0,
  /** 拼版文件 */
  MakeupFile = 1,
  /** 专色文件 */
  SpecialColor = 2,
  /** 物料 */
  Material = 3,
  /** 作业次数 */
  WorkTimes = 4,
  /** 文字信息 */
  WordsInfo = 4,
  /**  数值信息 */
  Numberic = 5
}

/** 常用映射类型 ( 包含条件 ) */
export enum GenerelMappingTypeEnum {
  /** 组合生产线映射 */
  UnionLine = 0,
  /** 组合工序映射 */
  UnionWorking = 1,
  /** 生产线映射 */
  NormalLine = 2,
  /** 工序映射 */
  NormalWorking = 3,
  /** 合拼禁用限制 */
  UnionMakeupLimit = 4
}

/** 生产端辅助信息枚举类型： 文件 | 文字信息 | 数值 */
export enum AssistInfoTypeEnum {
  file = 0,
  text = 1,
  numerical = 2,
}
