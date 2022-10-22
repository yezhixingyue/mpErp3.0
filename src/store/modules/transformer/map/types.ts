import { AssistMappingTypeEnum } from './enum';

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
