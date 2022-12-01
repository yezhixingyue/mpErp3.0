import getEnumList from '../../assets/js/utils/getEnumList';

export const RegTypeEnum = { // 注册方式
  Client: { ID: 0, Name: '客户端' },

  Web: { ID: 1, Name: '网页版' },

  Mobile: { ID: 2, Name: '微信端' },

  Manual: { ID: 255, Name: '员工添加' }, // 员工添加
};

export const AuthStatusEnum = { // 认证状态
  Initial: { ID: 0, Name: '未申请' },

  Apply: { ID: 1, Name: '申请中' },

  Checked: { ID: 2, Name: '已通过' },

  Refuse: { ID: 3, Name: '已拒绝' },
};

export const CustomerStatusEnum = { // 客户状态

  Nomal: { ID: 1, Name: '正常' },

  Freezed: { ID: 2, Name: '已冻结' },

  Deleted: { ID: 3, Name: '已删除' },
};

export const AccountStatusEnum = { // 账号状态

  Nomal: { ID: 1, Name: '正常' },

  Disabled: { ID: 2, Name: '禁用' },
};

export const CashBackTypeEnum = { // 返现类型

  Recharge: { ID: 1, Name: '充值返现' },

  Consume: { ID: 2, Name: '消费返现' },
};

export const CompanyTypeEnum = { // 公司类型
  DesignCompany: { ID: 1, Name: '设计公司' },

  SelfEmployed: { ID: 2, Name: '个体门店' },

  MultyShop: { ID: 3, Name: '连锁门店' },

  ChannelShop: { ID: 4, Name: '渠道店铺' },

  EBusiness: { ID: 5, Name: '电商商户' },

  UnKown: { ID: 0, Name: '类型不清楚' },
};

export const CompanyPlaceEnum = { // 办公场所
  Shops: { ID: 1, Name: '店面' },

  House: { ID: 2, Name: '住宅' },

  Office: { ID: 3, Name: '办公室' },

  IndustrialPark: { ID: 4, Name: '工业园' },

  UnKown: { ID: 0, Name: '场所不清楚' },
};

export const CompanyScaleEnum = { // 公司规模
  OneToFive: { ID: 1, Name: '1-5人' },

  SixToFifteen: { ID: 2, Name: '6-15人' },

  SixteenToFifty: { ID: 3, Name: '16-50人' },

  MoreThanFifty: { ID: 4, Name: '大于50人' },

  UnKown: { ID: 0, Name: '规模不清楚' },
};

export const ReChangeTypeEnum = { // 充值扣款
  topUp: {
    ID: 16,
    Name: '充值',
  },
  topDown: {
    ID: 23,
    Name: '扣款',
  },
};

export const CustomerPriceTypeEnum = { // 客户定价方式 - 客户定价类型
  AreaAndGrade: { ID: 1, Name: '按区域和客户等级' },
  Single: { ID: 2, Name: '单独定价' },
};

export const CompanyTypeEnumList = getEnumList(CompanyTypeEnum);
export const CompanyPlaceEnumList = getEnumList(CompanyPlaceEnum);
export const CompanyScaleEnumList = getEnumList(CompanyScaleEnum);
export const AuthStatusEnumList = getEnumList(AuthStatusEnum);
export const CustomerStatusEnumList = getEnumList(CustomerStatusEnum);
export const RegTypeEnumList = getEnumList(RegTypeEnum);
export const AccountStatusEnumList = getEnumList(AccountStatusEnum);
export const ReChangeTypeEnumList = getEnumList(ReChangeTypeEnum);
export const CashBackTypeEnumList = getEnumList(CashBackTypeEnum);
export const CustomerPriceTypeEnumList = getEnumList(CustomerPriceTypeEnum);

export default {};
