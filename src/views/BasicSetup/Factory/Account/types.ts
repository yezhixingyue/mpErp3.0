import { FactoryAccountStatusEnum } from './enum';

/**
 * 工厂账号类型接口
 *
 * @export
 * @interface IFactoryAccount
 */
export interface IFactoryAccount {
  ID: string
  Name: string
  FactoryID: number
  Mobile: string
  Password: string
  Status: FactoryAccountStatusEnum
  CreateTime: string
}
