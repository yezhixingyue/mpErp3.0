import CommonClassType from '@/store/CommonClassType';
import { ISetConditionParams } from '@/assets/types';

export class Condition {
  Page = 1

  PageSize = 20

  KeyWords = ''

  Key = ''

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
