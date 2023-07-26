import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { FactoryAccountStatusEnum } from './enum';
import { IFactoryAccount } from './types';

export class AccountItemRuleForm {
  ID = ''

  Name = ''

  FactoryID: number

  Mobile = ''

  Password = ''

  Status = FactoryAccountStatusEnum.enable

  CreateTime = ''

  constructor(data: number | IFactoryAccount) {
    if (typeof data === 'number') {
      this.FactoryID = data;
    } else {
      restoreInitDataByOrigin(this, data);
    }
  }
}
