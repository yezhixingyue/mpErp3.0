import CommonClassType from '@/store/CommonClassType';
import { ISetConditionParams } from '@/assets/types';
import { RefundApplyChannelEnum, RefundExceptionStatusEnum } from '../types/enum';

export class RefundExceptionCondition {
  /** 客户类型 */
  CustomerType = {
    First: '',
    Second: '',
  }

  /** 客户账户 BillAccountEnumList */
  Account: '' | number = ''

  /** 处理人 */
  Operator = ''

  /** 退款申请渠道 */
  Channel: '' | RefundApplyChannelEnum

  /** 申请退款时间筛选 */
  CreateTime = {
    First: '',
    Second: '',
  }

  DateType = 'last7Date'

  KeyWords = ''

  /** 筛选状态 */
  Status: '' | RefundExceptionStatusEnum = ''

  Page = 1

  PageSize = 20

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'CreateTime', { First: 'First', Second: 'Second' });

    /** 筛选结果 */
    return CommonClassType.filter(this, true);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
