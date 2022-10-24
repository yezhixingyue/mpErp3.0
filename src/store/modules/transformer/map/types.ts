import { AssistMappingTypeEnum, FixedType } from './enum';

export interface IAssistMapParams {
  ServerID: string
  InstanceID?: string
  ProductID?: string
  Type: AssistMappingTypeEnum
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
