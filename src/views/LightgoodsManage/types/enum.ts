/** 产品所属分类类型枚举：代客下单|自助上传 */
export enum ProductClassifyTypeEnum {
  /** 代客下单 */
  helpOrder = 1,
  /** 自助上传 */
  selfOrder = 2,
}

/** 产品所属分类类型枚举列表：代客下单|自助上传 */
export const ProductClassifyTypeEnumList = [
  { ID: ProductClassifyTypeEnum.helpOrder, Name: '代客下单' },
  { ID: ProductClassifyTypeEnum.selfOrder, Name: '自助上传' },
];
