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
  WordsInfo = 5,
  /**  数值信息 */
  Numberic = 6
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
  UnionMakeupLimit = 4,
  /** 贴序 帖标 */
  SheetIndex = 5,
  /** 爬移 */
  Move = 6,
  /** 叼口 */
  FeedEdge = 7,
  /** 铣背 */
  Milling = 8,
  /** 数码自动拼版 */
  NumericalCodeAutoMakeup = 9,
}

/** 生产端辅助信息枚举类型： 文件 | 文字信息 | 数值 */
export enum AssistInfoTypeEnum {
  file = 0,
  text = 1,
  numerical = 2,
}

export enum FixedType {
  Material = 54,
  Size = 55,
  constant = 255
}

export enum UseModuleEnum {
  /** 合拼禁用限制 */
  UnionMakeupLimit = 52,
  /** 生产线映射 */
  NormalLine = 52,
  /** 工序映射 */
  NormalWorking = 52,
  /** 组合生产线映射 */
  UnionLine = 52,
  /** 组合工序映射 */
  UnionWorking = 52,
  // /** 贴序 帖标映射 */
  // SheetIndex = 52,
  // /** 爬移映射 */
  // Move = 52,
  // /** 叼口映射 */
  // FeedEdge = 52,
  // /** 铣背映射 */
  // Milling = 52,
  /** 转换设置 - 其它设置 帖标、爬移、叼口、铣背共用 */
  otherSetupGeneral = 52,
  /** 数码自动拼版 */
  NumericalCodeAutoMakeup = 52,
}

/** 爬移类型枚举 */
export enum MoveTypeEnum {
  /** 偏移 */
  Skewing = 1,
  /** 缩放 */
  Zoom = 2
}

/** 叼口类型枚举 */
export enum FeedEdgePosition {
  /** 前叼口 */
  Front = 1,
  /** 后叼口 */
  Back = 2,
}
