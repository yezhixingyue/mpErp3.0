/** 退款异常状态枚举 0 未支付  1 未处理  2 已处理 */
export enum RefundExceptionStatusEnum {
  /** 未支付 */
  Unpaid = 0,
  /** 未处理 */
  Pending = 1,
  /** 已自动处理 */
  Processed = 2,
  /** 人工处理完成 */
  ManualProcessed = 3,
}

/** 退款异常状态枚举 */
export const RefundExceptionStatusEnumList = [
  {
    ID: RefundExceptionStatusEnum.Unpaid,
    Name: '未支付',
    /** 列表筛选隐藏该项 */
    hideToFilter: true,
  },
  {
    ID: RefundExceptionStatusEnum.Pending,
    Name: '未处理',
  },
  {
    ID: RefundExceptionStatusEnum.Processed,
    Name: '已处理',
    /** 列表筛选隐藏该项 -- 自动处理的不会进入到该列表 */
    hideToFilter: true,
  },
  {
    ID: RefundExceptionStatusEnum.ManualProcessed,
    Name: '已处理',
  },
];

/** 原路退回申请渠道枚举 */
export enum RefundApplyChannelEnum {
  /** 网页版 */
  Web = 0,
  /** 微信小程序 */
  MiniProgram = 1,
  /** 人工客服 */
  Staff = 2,
}

/** 原路退回申请渠道枚举列表 */
export const RefundApplyChannelEnumList = [
  {
    ID: RefundApplyChannelEnum.Web,
    Name: '网页版',
  },
  {
    ID: RefundApplyChannelEnum.MiniProgram,
    Name: '移动端',
  },
  {
    ID: RefundApplyChannelEnum.Staff,
    Name: '人工客服',
  },
];
