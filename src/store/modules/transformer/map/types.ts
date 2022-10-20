import { AssistMappingTypeEnum } from './enum';

export interface IAssistMapParams {
  ServerID: string
  InstanceID?: string
  ProductID?: string
  Type: AssistMappingTypeEnum
}
