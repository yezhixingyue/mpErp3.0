import { ServerTypeEnum } from '@/views/serverManage/utils/types';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

export class LogConditionClass {
  ServerID = ''

  OperatorID = ''

  Type = ServerTypeEnum.ManageConvert

  Page = 1

  PageSize = 20

  constructor(options?: GetLogOptions) {
    if (options) restoreInitDataByOrigin(this, options);
  }
}

export type GetLogOptions = Partial<LogConditionClass>;
