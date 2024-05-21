import CommonClassType from '@/store/CommonClassType';
import { ISetConditionParams } from '@/assets/types';

/** 开发者消息列表数据获取条件 */
export class Condition {
  KeyWords = ''

  Page = 1

  PageSize = 20

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
