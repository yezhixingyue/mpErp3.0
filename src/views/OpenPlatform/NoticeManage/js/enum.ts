/** 开发者发送信息接受对象枚举类型 */
export enum DeveloperNoticeTargetEnum {
  /** 所有账号 */
  All = 0,
  /** 企业账号 */
  Company = 1,
  /** 个人账号 */
  Persional = 2,
  /** 单个账号 */
  Developer = 3
}

/** 开发者发送信息接受对象枚举类型列表 */
export const DeveloperNoticeTargetEnumList = [
  {
    ID: DeveloperNoticeTargetEnum.All,
    Name: '所有账号',
  },
  {
    ID: DeveloperNoticeTargetEnum.Company,
    Name: '企业账号',
  },
  {
    ID: DeveloperNoticeTargetEnum.Persional,
    Name: '个人账号',
  },
  {
    ID: DeveloperNoticeTargetEnum.Developer,
    Name: '单个账号',
  },
];
