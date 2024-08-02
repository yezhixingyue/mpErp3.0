import { ApplicationTypeEnum } from './enum';

export interface IApplication {
  ID: string
  Name: string
  DeveloperID: string
  DeveloperName: string
  Key: string
  SecretKey: string
  Useable: boolean
  CreateTime: string
  BindIP: string
  Customer?: {
    Mobile: string
    Name: string
  }
  /** 应用类型 */
  Type: ApplicationTypeEnum
  UrlDic: { [key: number]: string }
}
