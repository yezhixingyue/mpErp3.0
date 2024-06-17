import { DeveloperStatusEnum, DeveloperTypeEnum } from './enum';

/** 开发者账号接口类型 */
export interface IDeveloper {
  ID: string
  Name: string
  Mobile: string
  Type: DeveloperTypeEnum
  Code: string
  Pic: string
  Contacts: string
  ContactMobile: string
  Status: DeveloperStatusEnum
  IsLock: boolean
  AppNumber: number
  CreateTime: string
  CheckTime?: string
  Checker?: string
  Remark?: string
}
