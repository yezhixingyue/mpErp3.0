import { AssistMappingTypeEnum, FixedType, GenerelMappingTypeEnum } from './enum';

export interface IAssistMapParams {
  ServerID: string
  InstanceID?: string
  ProductID?: string
  Type: AssistMappingTypeEnum
}

export interface IGeneralMapParams {
  ServerID: string
  InstanceID?: string
  ProductID?: string
  Type: GenerelMappingTypeEnum
}

export interface IFactoryMaterialClass {
  ID: string,
  Name: string,
  List: { ID: string, Name: string }[],
}

export interface IPropertyItemType {
  ID: string
  Name: string
}
export interface IPropertyType {
  Element: IPropertyItemType | null
  Group: IPropertyItemType | null
  Craft: IPropertyItemType | null
  Product: IPropertyItemType | null
  Part: IPropertyItemType | null
  Material: IPropertyItemType | null
  TableData: IPropertyItemType | null
  Cost: IPropertyItemType | null
  Formula: IPropertyItemType | null
  Constraint: IPropertyItemType | null
  FixedType: FixedType | null
  Type: number
  DefaultValue: number | string | null
  CraftOptionList: null | { ID: string, Name: string, Part: null | { ID: string, Name: string } }[]
}

export interface IConstraintListItem {
  ConstraintID: string
  Property: IPropertyType
  Operator: number // 可调整为枚举
  ValueList: { Property?: IPropertyType, ValueType?: number, Value?: string }[]
}

export interface IConstraint {
  ConstraintID: string
  FilterType: 1 | 2 // 可调整为枚举
  ItemList: IConstraintListItem[]
}

export interface IGetConditonResult{
  ID: string
  Name: string
  Priority: number
  Constraint: IConstraint
}
