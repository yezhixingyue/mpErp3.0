/** 开发者类型枚举 */
export enum DeveloperTypeEnum {
  /** 企业 */
  Company = 0,
  /** 个人 */
  Persional = 1
}

/** 开发者类型枚举列表 */
export const DeveloperTypeEnumList = [
  { ID: DeveloperTypeEnum.Company, Name: '企业' },
  { ID: DeveloperTypeEnum.Persional, Name: '个人' },
];

/** 开发者状态枚举 */
export enum DeveloperStatusEnum {
  /** 未处理 */
  Apply = 0,
  /** 未通过 */
  Forbit = 1,
  /** 已通过 */
  Checked = 2,
}

/** 开发者状态枚举列表 */
export const DeveloperStatusEnumList = [
  { ID: DeveloperStatusEnum.Apply, Name: '未处理' },
  { ID: DeveloperStatusEnum.Forbit, Name: '未通过' },
  { ID: DeveloperStatusEnum.Checked, Name: '已通过' },
];
