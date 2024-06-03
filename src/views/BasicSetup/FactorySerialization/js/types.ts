import { ElementTypeEnum, ProductDisplayPropertyTypeEnum } from './enum';

export interface IMRCommonProperties {
  /** 是否整体显示 */
  IsShow: boolean
  ID: string
  Name: string
  /** 是否显示名称或选项 */
  IsShowName: boolean
}

/** 选项类型元素 选项列表 */
export type MRElementOption = Omit<IMRCommonProperties, 'IsShow'>

/** 元素 */
export interface IMRElement extends IMRCommonProperties {
  Type: ElementTypeEnum
  /** 选项类型有 */
  OptionList?: MRElementOption[]
  /** 开关元素 文字内容 */
  ShowWord?: string
  /** 开关元素 是否显示文字 */
  IsShowWord: boolean
}

/** 元素组 */
export interface IMRElementGroup extends IMRCommonProperties {
  List: IMRElement[]
}

/** 工艺 */
export interface IMRCraft extends IMRCommonProperties {
  ElementList: IMRElement[]
  GroupList: IMRElementGroup[]
}

/** 尺寸组 */
export interface IMRSizeGroup extends IMRCommonProperties {
  /** 是否 优先显示常规尺寸名称 */
  IsShowGenerateName: boolean
  List: IMRElement[]
}

export interface IMRPart extends Omit<IMRCommonProperties, 'IsShow'> {
  /** 物料 */
  Material?: IMRCommonProperties
  /** 元素列表 */
  ElementList: IMRElement[]
  /** 元素组列表 */
  ElementGroupList: IMRElementGroup[]
  /** 工艺列表 */
  CraftList: IMRCraft[]
  /** 尺寸组 */
  SizeGroup?: IMRSizeGroup

  /** 工艺分组列表 */
  CraftGroupList: {
    ID: string
    List: string[]
  }[]
  /** 排序 */
  DisplayList: {
    Type: ProductDisplayPropertyTypeEnum
    Property: {
      ID: string
    }
  }[]
}

/** 产品序列化列表信息条目 */
export interface IMRProduct extends IMRPart {
  ID: string
  Name: string
  ProductClass: {
    First: number
    Second: number
  }
  HaveChange: boolean
  /** 是否已设置订单信息 */
  HaveSetupOrder: boolean
  /** 是否已设置产品信息 */
  HaveSetupProduct: boolean
  /** 最后修改人 */
  Operator: string

  /** 是否显示订单号 */
  ShowOrderID: boolean
  /** 是否显示订单名称 */
  ShowOrderName: boolean
  /** 是否显示工期 */
  ShowPeriod: boolean

  /** 通用分隔符 */
  SplitChars: string
  /** 尺寸连接符 */
  SizeJoinChars: string
  /** 部件开始结束符 */
  PartSplitChars: string
  /** 元素组开始结束符 */
  GroupSplitChars: string
  /** 工艺开始结束符 */
  CraftSplitChars: string

  /** 部件列表 */
  List: IMRPart[]
}
