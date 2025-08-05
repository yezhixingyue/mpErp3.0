import { ISetConditionParams } from '@/assets/types';
import CommonClassType from '@/store/CommonClassType';

export class LightgoodsListCondition {
  Page = 1

  PageSize = 20

  KeyWords = ''

  filter() {
    /** 处理时间 */
    // CommonClassType.setDate(this, 'CreateTime', { First: 'First', Second: 'Second' });

    /** 筛选结果 */
    return CommonClassType.filter(this);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
