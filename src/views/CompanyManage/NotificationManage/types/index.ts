import { SystemMessageTypeEnum } from './enum';

export interface IMessageMember {
  ID: string
  Types: SystemMessageTypeEnum[]
}

export interface IWebSocketMessage {
  Type: SystemMessageTypeEnum
  /** 字符串类型的数值 */
  Content: string
}
