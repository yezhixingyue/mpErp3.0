import CommonClassType from '@/store/CommonClassType';
import { DeveloperStatusEnum, DeveloperTypeEnum } from './enum';
import { ISetConditionParams } from '@/assets/types';

/** 开发者列表数据获取条件 */
export class Condition {
  Type: DeveloperTypeEnum | '' = ''

  Status: DeveloperStatusEnum | '' = ''

  IsLock: boolean | '' = ''

  KeyWords = ''

  Page = 1

  PageSize = 20

  RegTime = {
    key: '',
    value: '',
  }

  /** 转换时间并筛选掉多余属性 */
  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'RegTime', { First: 'key', Second: 'value' });

    /** 筛选结果 */
    return CommonClassType.filter(this, true);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
