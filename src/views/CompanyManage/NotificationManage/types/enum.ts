/** 系统消息类型枚举 */
export enum SystemMessageTypeEnum {
    /** 商标证书审核 */
    Certificate = 0,
    /** 客户认证审核 */
    CustomerAuthentication = 1,
    /** 开放平台注册审核 */
    Developer = 2,
    /** 开票信息审核 */
    Invoice
}

/** 系统消息类型枚举列表 */
export const SystemMessageTypeEnumList = [
  { ID: SystemMessageTypeEnum.Certificate, Name: '商标证书审核' },
  { ID: SystemMessageTypeEnum.CustomerAuthentication, Name: '客户认证审核' },
  { ID: SystemMessageTypeEnum.Developer, Name: '开放平台注册审核' },
  { ID: SystemMessageTypeEnum.Invoice, Name: '开票信息审核' },
];
